<template>
  <div class="movie-grid">

    <!-- LOADING -->
    <template v-if="loading">
      <div
        v-for="i in skeletonCount"
        :key="i"
        class="movie-card"
      >
        <div class="skeleton"></div>
      </div>
    </template>

<template v-else-if="movies.length === 0">
          <div
            v-for="i in skeletonCount"
            :key="i"
            class="movie-card"
          >
            <v-img
              class="mx-auto"
              :src="imageError"
            ></v-img>
          </div>
        </template>
    <!-- MOVIES -->
    <template v-else>

      <div
        v-for="movie in getCategoriesToShow(movies)"
        :key="movie.slug"
        class="movie-card"
      >

        <router-link
          :to="{ name:'Movies', params:{ slug: movie.slug } }"
          class="movie-link"
        >

          <!-- POSTER -->
          <div class="poster-wrapper">

            <v-img
              :src="movie.thumb_url"
              aspect-ratio="2/3"
              cover
              loading="lazy"
              height="169"
              class="poster"
            >
            <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate />
                  </div>
                </template>
            </v-img>

            <!-- BADGES -->
            <div class="badges">

              <span class="badge quality">
                {{ movie.quality || "HD" }}
              </span>

              <span class="badge lang">
                {{ movie.lang || "Vietsub" }}
              </span>

            </div>

            <!-- EPISODE -->
            <div class="episode">
              ▶ {{ movie.episode_current || "Full" }}
            </div>

          </div>

          <!-- INFO -->
          <div class="info">

            <div class="title">
              {{ movie.name }}
            </div>

            <div class="meta">

              <span class="rating">
                ⭐ {{ movie.rating || "8.5" }}
              </span>

              <span class="year">
                {{ movie.year }}
              </span>

              <span class="time">
                {{ movie.time || "120m" }}
              </span>

            </div>

            <div class="genres">
              {{
                movie.category
                  ?.slice(0,2)
                  .map(c => c.name)
                  .join(" • ")
              }}
            </div>

          </div>

        </router-link>

      </div>

    </template>

  </div>
</template>

<script>
import { urlImage1 } from "@/model/api"
import imageError from "@/assets/imageError.png";

export default {

  props:["movies"],

  data(){
    return{
      imageError: imageError,
      urlImage1,

      skeletonCount:12

    }
  },

  methods:{
    getCategoriesToShow(item){
      const isMobile = this.$vuetify.display.xs
    if (isMobile) {
        return item.slice(0, 8);  // Mobile → 8 item
      } else {
        return item;
      }
    },
    getImage(path){

      if(!path) return ""

      if(path.includes("http"))
        return path

      return this.urlImage1 +
        "https://phimimg.com/" +
        path

    }

  }

}
</script>

<style scoped>

/* GRID */

.movie-grid{

  display:grid;

  grid-template-columns:
    repeat(auto-fit,minmax(260px,1fr));

  gap:24px;

}

/* CARD */

.movie-card{

  position:relative;

  transition:.35s;

}

.movie-card:hover{

  transform:translateY(-6px);

}

/* LINK */

.movie-link{

  text-decoration:none;

  color:inherit;

  display:block;

}

/* POSTER */

.poster-wrapper{

  position:relative;

  border-radius:14px;

  overflow:hidden;

}

.poster{

  border-radius:14px;

  transition:.4s;

}

.movie-card:hover .poster{

  transform:scale(1.06);

}

/* BADGES */

.badges{

  position:absolute;

  top:8px;
  left:8px;

  display:flex;

  gap:6px;

}

.badge{

  font-size:11px;

  padding:3px 7px;

  border-radius:6px;

  font-weight:600;

}

.quality{

  background:#ff3d00;

  color:white;

}

.lang{

  background:rgba(0,0,0,.75);

  color:white;

}

/* EPISODE */

.episode{

  position:absolute;

  bottom:8px;
  right:8px;

  font-size:12px;

  background:rgba(0,0,0,.7);

  padding:4px 8px;

  border-radius:6px;

  color:white;

}

/* INFO */

.info{

  padding:10px 4px 0;

}

.title{

  font-size:15px;

  font-weight:600;

  line-height:1.35;

  display:-webkit-box;

  -webkit-line-clamp:2;

  -webkit-box-orient:vertical;

  overflow:hidden;

}

/* META */

.meta{

  display:flex;

  gap:10px;

  margin-top:4px;

  font-size:12px;

  color:#b3b3b3;

}

.genres{

  font-size:11px;

  color:#888;

  margin-top:3px;

}

/* SKELETON */

.skeleton{

  width:100%;

  aspect-ratio:2/3;

  border-radius:14px;

  background:linear-gradient(
    110deg,
    #1a1a1a 25%,
    #2a2a2a 37%,
    #1a1a1a 63%
  );

  background-size:200% 100%;

  animation:skeleton 1.2s infinite;

}

@keyframes skeleton{

  0%{
    background-position:100% 0;
  }

  100%{
    background-position:-100% 0;
  }

}

/* RESPONSIVE */

@media (max-width:900px){

.movie-grid{

  grid-template-columns:
    repeat(auto-fill,minmax(160px,1fr));

}

}

@media (max-width:600px){

.movie-grid{

  grid-template-columns:
    repeat(2,1fr);

  gap:16px;

}

.title{
  font-size:14px;
}

}

</style>
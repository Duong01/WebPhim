<template>
  <div class="row-scroll">
    <template v-if="movies && movies.length">
      <div class="row-container">
        <v-btn icon class="arrow left" v-if="showLeft" @click="scrollLeft">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <div class="row-scroll" ref="row" @scroll="checkScroll">
          <div v-for="movie in movies" :key="movie.slug" class="movie-card">
            <div class="card-inner">
              <v-img
                :src="getImage(movie.thumb_url)"
                height="250"
                loading="lazy"
                aspect-ratio="2/3"
                cover
                class="poster"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate :width="5" />
                  </div>
                </template>

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
                  <v-icon size="14">mdi-play-circle</v-icon>
                  {{ movie.episode_current || "Full" }}
                </div>
              </v-img>

              <!-- HOVER OVERLAY -->
              <div class="hover-overlay">
                <div class="info">
                  <h4 class="title">
                    {{ movie.name }}
                  </h4>

                  <div class="meta">
                    ⭐ {{ movie.tmdb?.vote_average || 8.5 }} • {{ movie.year }}
                  </div>

                  <div class="actions">
                    <router-link
                    :to="{ name: 'Movies', params: { slug: movie.slug } }"
                    
                  >
                    <v-btn icon size="small">
                      <v-icon>mdi-play</v-icon>
                    </v-btn>
                    </router-link>

                    <v-btn icon size="small">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>

                    <v-btn icon size="small">
                      <v-icon>mdi-heart-outline</v-icon>
                    </v-btn>
                    <div class="genres">
                      {{
                        movie.category
                          ?.slice(0, 2)
                          .map((c) => c.name)
                          .join(" • ")
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <v-btn icon class="arrow right" v-if="showRight" @click="scrollRight">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </template>
    <template v-else>
      <v-btn icon class="arrow left" v-if="showLeft" @click="scrollLeft">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      <div v-for="i in skeletonCount" :key="i" class="movie-card">
        <div class="skeleton-poster"></div>
      </div>
      <v-btn icon class="arrow right" v-if="showRight" @click="scrollRight">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
    </template>
  </div>
</template>

<script>
import { urlImage1 } from "@/model/api";
export default {
  props: ["movies"],

  data() {
    return {
      urlImage1: urlImage1,
      hover: null,
      showLeft:false,
      showRight:false,
      skeletonCount: 8,
    };
  },

  mounted(){
    this.$nextTick(()=>{
      this.checkScroll()
    })
  },

  watch:{
    movies(){
      this.$nextTick(()=>{
        this.checkScroll()
      })
    }
  },

  methods: {
    getImage(imagePath) {
      if (imagePath.includes("https://phimimg.com/upload")) {
        return `${this.urlImage1 + encodeURIComponent(imagePath)}`;
      } else {
        return `${
          this.urlImage1 +
          "https://phimimg.com/" +
          encodeURIComponent(imagePath)
        }`;
      }
    },
    scrollLeft() {
      const el = this.$refs.row;
      if (!el) return;

      const width = el.clientWidth;

      el.scrollBy({
        left: -width * 0.8,
        behavior: "smooth",
      });
    },

    scrollRight() {
      const el = this.$refs.row;
      if (!el) return;

      const width = el.clientWidth;

      el.scrollBy({
        left: width * 0.8,
        behavior: "smooth",
      });
    },

    checkScroll(){

      const el = this.$refs.row
      if(!el) return

      this.showLeft = el.scrollLeft > 5
      this.showRight = el.scrollWidth > el.clientWidth + el.scrollLeft + 5

    }
  },
};
</script>

<style scoped>
/* CONTAINER */

.row-container {
  position: relative;
  padding: 0 24px;
  overflow: visible;
}
.row-container:hover .arrow {
  opacity: 1;
}
@media (max-width: 600px) {
  .row-container {
    padding: 0 12px;
  }
}

/* ROW SCROLL */

.row-scroll {
  display: flex;

  gap: 16px;

  padding-bottom: 10px;

  overflow-x: auto;
  overflow-y: visible;

  scroll-snap-type: x mandatory;

  scrollbar-width: none;
  scroll-behavior: smooth;
}

.row-scroll::-webkit-scrollbar {
  display: none;
}

/* MOVIE CARD */

.movie-card {
  flex: 0 0 auto;
  width: 240px;
  min-height: 200px;

  scroll-snap-align: start;

  cursor: pointer;
}

.card-inner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

/* HOVER EFFECT */

.movie-card:hover .card-inner {
  transform: scale(1.18) translateY(-10px);

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.6);

  z-index: 20;
}

/* POSTER */

.poster {
  width: 100%;
  height: 100%;
  border-radius: 12px;

  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

/* HOVER OVERLAY */

.hover-overlay {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: flex-end;

  padding: 14px;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95),
    rgba(0, 0, 0, 0.5),
    transparent
  );

  opacity: 0;

  transition: opacity 0.3s ease;
}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

/* INFO */

.title {
  font-size: 14px;

  font-weight: 600;

  color: white;
}

.meta {
  font-size: 12px;

  opacity: 0.85;

  margin-top: 2px;
}

/* ACTION BUTTONS */

.actions {
  display: flex;

  gap: 6px;

  margin-top: 6px;
}

/* ARROWS */

.arrow {
  position: absolute;
  top: 40%;

  width: 42px;
  height: 42px;

  background: rgba(0,0,0,.6);

  border-radius: 50%;

  color: white;

  z-index: 10;

  opacity: .9;   /* luôn thấy */
  transition: .25s;
}
.row-container:hover .arrow {
  opacity: 1;
  transform: scale(1.15);
}

.left{
  left:0;
  background:linear-gradient(
    to right,
    rgba(0,0,0,.8),
    transparent
  );
}

.right{
  right:0;
  background:linear-gradient(
    to left,
    rgba(0,0,0,.8),
    transparent
  );
}

@media (max-width: 600px) {
  .arrow {
    display: none;
  }
}

/* SKELETON */

.skeleton-poster {
  width: 100%;

  aspect-ratio: 2/3;

  border-radius: 10px;

  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 37%, #1a1a1a 63%);

  background-size: 400% 100%;

  animation: skeleton 1.3s infinite;
}

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
}

/* RESPONSIVE */

/* Mobile */

@media (max-width: 600px) {
  .movie-card {
    width: 140px;
  }
}

/* Tablet */

@media (min-width: 600px) and (max-width: 900px) {
  .movie-card {
    width: 180px;
  }
}

/* Laptop */

@media (min-width: 900px) and (max-width: 1200px) {
  .movie-card {
    width: 220px;
  }
}

/* Desktop */

@media (min-width: 1200px) {
  .movie-card {
    width: 260px;
  }
}
.actions button {
  width: 32px;
  height: 32px;

  border-radius: 50%;

  border: 1px solid rgba(255, 255, 255, 0.5);

  backdrop-filter: blur(5px);

  background: rgba(0, 0, 0, 0.5);
}
.movie-card:hover::before {
  content: "";
  position: absolute;
  inset: -10px;

  border-radius: 14px;

  background: rgba(0, 0, 0, 0.4);

  filter: blur(20px);

  z-index: -1;
}
.badges {
  position: absolute;
  top: 8px;
  left: 8px;

  display: flex;
  gap: 6px;
}
.badge {
  font-size: 11px;
  font-weight: 600;

  padding: 3px 6px;

  border-radius: 6px;

  backdrop-filter: blur(6px);
}
.quality {
  background: #ff3d00;
  color: white;
}
.lang {
  background: rgba(0, 0, 0, 0.7);
  color: white;
}
.episode {
  position: absolute;
  bottom: 8px;
  right: 8px;

  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 12px;
  font-weight: 500;

  color: white;

  background: rgba(0, 0, 0, 0.65);

  padding: 4px 8px;

  border-radius: 6px;

  backdrop-filter: blur(6px);
}
.genres {
  font-size: 11px;
  color: #b3b3b3;

  margin-top: 4px;
}
</style>

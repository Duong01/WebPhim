<template>
  <div class="movie-grid">
    <!-- LOADING -->
    <template v-if="!movies || !movies.length">
      <div v-for="i in skeletonCount" :key="i" class="movie-card">
        <div class="skeleton"></div>
      </div>
    </template>

    <!-- MOVIES -->
    <template v-else>

      <div
        v-for="movie in movies.slice(0, 8)"
        :key="movie.slug"
        class="movie-card"
      >
      <router-link
        :to="{ name: 'Movies', params: { slug: movie.slug } }"
        
      >
        <v-img
          :src="getImage(movie.thumb_url)"
          aspect-ratio="16/9"
          cover
          class="poster"
        >
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
          <div class="episode">▶ {{ movie.episode_current || "Full" }}</div>
        </v-img>

        <!-- INFO -->
        <div class="info">
          <h3 class="title">
            {{ movie.name }}
          </h3>

          <div class="meta">
            <span class="rating">
              ⭐ {{ movie.tmdb?.vote_average || "8.5" }}
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
                ?.slice(0, 2)
                .map((c) => c.name)
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
import { urlImage1 } from "@/model/api";

export default {
  props: ["movies"],

  data() {
    return {
      urlImage1,
      skeletonCount: 8,
    };
  },

  methods: {
    getImage(path) {
      if (!path) return "";

      if (path.includes("http")) return path;

      return this.urlImage1 + "https://phimimg.com/" + path;
    },
  },
};
</script>

<style scoped>
/* GRID */

.movie-grid {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 16px;
}

/* CARD */

.movie-card {
  position: relative;

  cursor: pointer;

  overflow: hidden;

  border-radius: 12px;

  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.movie-card:hover {
  transform: scale(1.06);

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
}

/* POSTER */

.poster {
  border-radius: 12px;
}

/* OVERLAY */

.overlay {
  position: absolute;

  bottom: 0;
  left: 0;
  right: 0;

  padding: 18px;

  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
}

.overlay h3 {
  color: white;

  font-size: 16px;

  font-weight: 700;
}

/* SKELETON */

.skeleton {
  width: 100%;

  aspect-ratio: 16/9;

  border-radius: 12px;

  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 37%, #1a1a1a 63%);

  background-size: 400% 100%;

  animation: skeleton 1.2s infinite;
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

/* tablet */

@media (max-width: 1100px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* mobile */

@media (max-width: 700px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.info{
  padding:10px 6px 4px;
}

.title{
  font-size:15px;
  font-weight:600;

  color:white;

  line-height:1.35;

  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;

  overflow:hidden;
}
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
.badges{
  position:absolute;
  top:8px;
  left:8px;

  display:flex;
  gap:6px;
}
.badge{
  font-size:11px;
  font-weight:600;

  padding:3px 6px;

  border-radius:6px;

  backdrop-filter:blur(6px);
}
.quality{
  background:#ff3d00;
  color:white;
}
.lang{
  background:rgba(0,0,0,.7);
  color:white;
}
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
.movie-grid{
  display:grid;

  grid-template-columns:
    repeat(auto-fill,minmax(240px,1fr));

  gap:20px;
}
.movie-card:hover{
  transform:translateY(-6px) scale(1.03);

  box-shadow:
    0 15px 40px rgba(0,0,0,.7);
}
.skeleton{
  width:100%;
  aspect-ratio:16/9;

  border-radius:12px;

  background:linear-gradient(
    110deg,
    #1a1a1a 25%,
    #2a2a2a 37%,
    #1a1a1a 63%
  );

  background-size:200% 100%;

  animation:skeleton 1.2s infinite;
}
</style>

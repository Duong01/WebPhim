<template>
  <div class="movie-grid">

    <!-- LOADING -->
    <template v-if="!movies || !movies.length">
      <div
        v-for="i in skeletonCount"
        :key="i"
        class="movie-card"
      >
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
        <v-img
          :src="getImage(movie.thumb_url)"
          aspect-ratio="16/9"
          cover
          class="poster"
        />

        <div class="overlay">
          <h3>{{ movie.name }}</h3>
        </div>
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
      skeletonCount: 8
    };
  },

  methods: {
    getImage(path) {
      if (!path) return "";

      if (path.includes("http")) return path;

      return this.urlImage1 + "https://phimimg.com/" + path;
    }
  }
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

  transition: transform .35s ease, box-shadow .35s ease;
}

.movie-card:hover {
  transform: scale(1.06);

  box-shadow: 0 15px 40px rgba(0,0,0,.7);
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

  background: linear-gradient(
    transparent,
    rgba(0,0,0,.8)
  );
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

  background: linear-gradient(
    90deg,
    #1a1a1a 25%,
    #2a2a2a 37%,
    #1a1a1a 63%
  );

  background-size: 400% 100%;

  animation: skeleton 1.2s infinite;
}

@keyframes skeleton {
  0% { background-position: 100% 0 }
  100% { background-position: -100% 0 }
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

</style>
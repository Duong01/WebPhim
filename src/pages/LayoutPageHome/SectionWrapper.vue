<template>
  <div class="section-wrapper">
    <div class="category-header">
      <div class="title-group">

        <h2 class="category-title">
          {{ title }}
        </h2>
      </div>

      <router-link v-if="link" :to="link" class="view-all">
        <span>Xem tất cả</span>

        <v-icon size="18"> mdi-chevron-right </v-icon>
      </router-link>
    </div>

    <component
  :is="componentType"
  :movies="movies"
  :loading="loading"
  v-memo="[movies]"
  />

  <div v-if="loading" class="skeleton-row">
    <div v-for="i in 6" :key="i" class="skeleton-card"></div>
  </div>
      <v-divider
    :thickness="2"
    class="border-opacity-25"
    color="success"
  ></v-divider>
  </div>
</template>

<script>
import MovieRow from "./MovieRow.vue";
import MovieGrid from "./MovieGrid.vue";
import MovieRanking from "./MovieRanking.vue";
import MovieSlide from "./MovieSlide.vue";
import MovieDashboard from "./MovieDashboard.vue";
import MovieSpotlightVue from './MovieSpotlight.vue';


export default {
  props: {
    title: String,
    type: String,
    movies: Array,
    link: Object,
    loading: Boolean
  },

  components: {
    MovieRow,
    MovieGrid,
    MovieRanking,
    MovieSlide,
    MovieDashboard,
    MovieSpotlightVue,
  },

  computed: {
    componentType() {
      switch (this.type) {
        case "grid":
          return "MovieGrid";

        case "slider":
          return "MovieRow";

        case "ranking":
          return "MovieRanking";

        case "large":
          return "MovieSlide";

        case "continue":
          return "MovieContinue";

        case "spotlight":
          return "MovieSpotlightVue";

        case "dashboard":
          return "MovieDashboard";

        default:
          return "MovieRow";
      }
    },
  },

  methods: {},
};
</script>

<style>
.section-wrapper {
  margin-bottom: 28px;
  min-height: 260px;
}

/* HEADER */

.category-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 0 24px 10px 24px;
}

/* TITLE */

.title-group {
  display: flex;

  align-items: center;

  gap: 8px;
}

.title-icon {
  color: #ff9800;
}

.category-title {
  font-family: "Montserrat", "Roboto", sans-serif;
  font-size: clamp(12px, 3.2vw, 18px);
  font-weight: 800;
  text-transform: uppercase !important;
  letter-spacing: 1.2px;
  color: #ffffff;
  position: relative;
  padding-left: 16px;
  line-height: 1.2;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.category-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 75%;
  background: linear-gradient(to bottom, #ffb700, #ff8c00);
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(255, 183, 0, 0.4);
}

/* VIEW ALL */

.view-all {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #ffb700;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 6px 16px;
  border-radius: 20px;
  background: rgba(255, 183, 0, 0.1);

  transition: all 0.3s ease;
}

.view-all:hover {
  color: #000;
  background: linear-gradient(45deg, #ffb700, #ff8c00);
  transform: translateX(4px) scale(1.02);
  box-shadow: 0 4px 15px rgba(255, 183, 0, 0.3);
}

/* TABLET */

/* MOBILE */

@media (max-width: 600px) {
  .category-header {
    padding: 0 12px 10px 12px;
  }

  .category-title {
    padding-left: 12px;
    letter-spacing: 1px;
  }

  .view-all {
    font-size: 10px;
    padding: 4px 12px;
  }
}
.section-wrapper::after {
  content: "";

  display: block;

  height: 1px;

  /* background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.15),
    transparent
  ); */

  margin-top: 6px;
}
.skeleton-row {
  display: flex;
  gap: 12px;
  padding: 0 24px;
}

.skeleton-card {
  width: 160px;
  height: 220px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    #1a1a1a 25%,
    #2a2a2a 37%,
    #1a1a1a 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}
</style>

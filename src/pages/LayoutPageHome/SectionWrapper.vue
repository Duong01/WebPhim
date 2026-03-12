<template>
  <div class="section-wrapper">
    <div class="category-header">
      <div class="title-group">
        <v-icon size="20" class="title-icon"> mdi-filmstrip </v-icon>

        <h2 class="category-title">
          {{ title }}
        </h2>
      </div>

      <router-link v-if="link" :to="link" class="view-all">
        <span>Xem tất cả</span>

        <v-icon size="18"> mdi-chevron-right </v-icon>
      </router-link>
    </div>

    <component :is="componentType" :movies="movies" />
  </div>
</template>

<script>
import MovieRow from "./MovieRow.vue";
import MovieGrid from "./MovieGrid.vue";
import MovieRanking from "./MovieRanking.vue";
import MovieSlide from "./MovieSlide.vue";
import MovieDashboard from "./MovieDashboard.vue";

export default {
  props: {
    title: String,
    type: String,
    movies: Array,
    link: Object,
  },
  mounted(){
    console.log(this.movies)
  },

  components: {
    MovieRow,
    MovieGrid,
    MovieRanking,
    MovieSlide,
    MovieDashboard,
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
          return "MovieSpotlight";

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
  font-size: 22px;

  font-weight: 800;

  letter-spacing: 0.6px;

  color: white;
}

/* VIEW ALL */

.view-all {
  display: flex;

  align-items: center;

  gap: 4px;

  font-size: 14px;

  font-weight: 600;

  color: #ffd54f;

  text-decoration: none;

  transition: 0.25s;
}

.view-all:hover {
  color: #4caf50;

  transform: translateX(4px);
}

/* TABLET */

@media (max-width: 960px) {
  .category-title {
    font-size: 20px;
  }
}

/* MOBILE */

@media (max-width: 600px) {
  .category-header {
    padding: 0 12px 10px 12px;
  }

  .category-title {
    font-size: 18px;
  }

  .view-all {
    font-size: 13px;
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
</style>

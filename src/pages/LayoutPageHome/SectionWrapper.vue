<template>
  <div class="section-wrapper">
    <div class="category-header">
      <div class="title-group">

        <h2 class="category-title">
          {{ title }}
        </h2>
      </div>

      <router-link v-if="link" :to="link" class="view-all">
        <span>{{$t('Xem tất cả')}}</span>

        <v-icon size="18"> mdi-chevron-right </v-icon>
      </router-link>
    </div>

    <component
      v-if="movies.length"
      :is="componentType"
      :movies="movies"
      :loading="loading"
      v-memo="[movies]"
    />

  <div v-if="loading" class="skeleton-row">
    <div v-for="i in 12" :key="i" class="skeleton-card"></div>
  </div>
      <hr class="section-divider">
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

const MovieRow = defineAsyncComponent(() =>
  import("./MovieRow.vue")
);

const MovieGrid = defineAsyncComponent(() =>
  import("./MovieGrid.vue")
);
const MovieRanking = defineAsyncComponent(() =>
  import("./MovieRanking.vue")
);
const MovieSlide = defineAsyncComponent(() =>
  import("./MovieSlide.vue")
);
const MovieDashboard = defineAsyncComponent(() =>
  import("./MovieDashboard.vue")
);
const MovieSpotlightVue = defineAsyncComponent(() =>
  import("./MovieSpotlight.vue")
);
// import MovieRow from "./MovieRow.vue";
// import MovieGrid from "./MovieGrid.vue";
// import MovieRanking from "./MovieRanking.vue";
// import MovieSlide from "./MovieSlide.vue";
// import MovieDashboard from "./MovieDashboard.vue";
// import MovieSpotlightVue from './MovieSpotlight.vue';


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
  color: #ffb700;
}

.category-title {
  font-family: "Montserrat", "Be Vietnam Pro", sans-serif;
  font-size: clamp(13px, 3.2vw, 19px);
  font-weight: 800;
  text-transform: uppercase !important;
  letter-spacing: 1.2px;
  color: var(--zc-text);
  position: relative;
  padding-left: 16px;
  line-height: 1.2;
  text-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.category-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 78%;
  background: var(--zc-grad);
  border-radius: 4px;
  box-shadow: 0 0 12px rgba(255, 183, 0, 0.55);
}

/* VIEW ALL */

.view-all {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #ffb700;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 7px 16px;
  border-radius: 999px;
  background: rgba(255, 183, 0, 0.08);
  border: 1px solid rgba(255, 183, 0, 0.22);
  transition: all 0.3s var(--zc-ease);
}

.view-all:hover {
  color: #0a0a12;
  background: var(--zc-grad);
  transform: translateX(4px) scale(1.03);
  box-shadow: 0 6px 18px rgba(255, 140, 0, 0.4);
}

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
  border-radius: 12px;
  background: linear-gradient(110deg, #16161f 25%, #23232f 37%, #16161f 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}

.section-divider {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.09), transparent);
}
</style>

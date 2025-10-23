<template>
  <v-container class="search-page" fluid>
    <!-- 🧭 Thanh bộ lọc tìm kiếm -->
    <v-row class="mb-6 align-center" justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-4 filter-bar" elevation="4">
          <v-row align="center" dense>
            <!-- Tìm kiếm -->
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="filters.keyword"
                label="Tìm phim..."
                clearable
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                @keyup.enter="applyFilters"
              />
            </v-col>

            <!-- Lọc theo năm -->
            <v-col cols="6" sm="3">
              <v-select
                v-model="filters.year"
                :items="years"
                label="Năm"
                clearable
                variant="outlined"
                density="comfortable"
                @change="applyFilters"
              />
            </v-col>

            <!-- Lọc theo ngôn ngữ -->
            <v-col cols="6" sm="3">
              <v-select
                v-model="filters.lang"
                :items="languages"
                label="Ngôn ngữ"
                clearable
                variant="outlined"
                density="comfortable"
                @change="applyFilters"
              />
            </v-col>

            <!-- Sắp xếp -->
            <v-col cols="12" sm="2">
              <v-select
                v-model="filters.sort"
                :items="sortOptions"
                label="Sắp xếp"
                variant="outlined"
                density="comfortable"
                @change="applyFilters"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 🏷️ Tiêu đề -->
    <v-row justify="center" class="mb-4">
      <v-col cols="12">
        <h2 class="text-center">
          Danh sách phim: {{ titlePage }}
        </h2>
        <v-divider class="my-4" />
      </v-col>
    </v-row>

    <!-- 🔄 Loading -->
    <v-row justify="center">
      <v-col cols="12" class="text-center" v-if="loading">
        <v-progress-circular indeterminate color="primary" size="50" />
      </v-col>

      <!-- 🎬 Danh sách phim -->
      <v-col cols="12" v-else>
        <v-alert v-if="movies.length === 0" class="text-center">
          Không tìm thấy phim nào phù hợp.
          <br />
          <router-link to="/home">
            <v-btn variant="outlined" class="mt-2">Về trang chủ</v-btn>
          </router-link>
        </v-alert>

        <v-row
          no-gutters
          tag="transition-group"
          name="fade-scale"
          class="movie-list"
        >
          <v-col
            v-for="movie in movies"
            :key="movie.id"
            cols="6"
            sm="4"
            md="2"
            style="padding: 10px"
          >
            <router-link
              :to="{ name: 'MovieDetail', params: { slug: movie.slug } }"
              class="text-decoration-none"
            >
              <v-card class="mx-auto bg-dark movie-card" width="auto">
                <v-img
                  :src="getOptimizedImage(movie.poster_url)"
                  :lazy-src="getOptimizedImage(movie.poster_url)"
                  :alt="movie.name"
                  class="movie-image"
                  transition="fade-transition"
                  height="250"
                  cover
                >
                  <div class="movie-overlay" aria-hidden="true"></div>
                  <div class="movie-play" aria-hidden="true">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <circle
                        cx="32"
                        cy="32"
                        r="30"
                        fill="rgba(0,0,0,0.55)"
                      />
                      <path d="M26 20 L46 32 L26 44 Z" fill="#fff" />
                    </svg>
                  </div>
                </v-img>

                <v-card-subtitle class="episode-lang" style="margin-top: 5px;">
                  {{
                    movie.episode_current === "Tập 0"
                      ? `Full - ${movie.lang}`
                      : `${movie.episode_current} - ${movie.lang}`
                  }}
                </v-card-subtitle>

                <v-card-title class="movie-title">{{ movie.name }}</v-card-title>
                <v-card-text class="movie-info">
                  <div class="text-grey text-truncate">
                    <v-icon size="14" class="mr-1">mdi-tag</v-icon>
                    {{ movie.origin_name }} ({{ movie.year }})
                  </div>
                </v-card-text>
              </v-card>
            </router-link>
          </v-col>
        </v-row>

        <!-- Phân trang -->
        <v-pagination
          v-model="currentPage"
          :length="Math.ceil(totalMovies / moviesPerPage)"
          class="my-4 justify-center"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { urlImage1, ListMovieByCate1 } from "@/model/api";

export default {
  name: "HoatHinh",
  data() {
    return {
      loading: true,
      currentPage: 1,
      moviesPerPage: 20,
      totalMovies: 100,
      movies: [],
      path: "hoat-hinh",
      urlImage: urlImage1,
      titlePage: "",

      // Bộ lọc
      filters: {
        keyword: "",
        year: "",
        lang: "",
        sort: "year_desc",
      },
      years: Array.from({ length: 20 }, (_, i) => `${2025 - i}`),
      languages: ["Tiếng Việt", "Thuyết minh", "Lồng tiếng", "Phụ đề"],
      sortOptions: [
        { title: "Năm ↓", value: "year_desc" },
        { title: "Năm ↑", value: "year_asc" },
        { title: "Tên A–Z", value: "name_asc" },
        { title: "Tên Z–A", value: "name_desc" },
      ],
    };
  },
  mounted() {
    this.ListMovie();
  },
  methods: {
    // 📦 Gọi API danh sách phim
    ListMovie() {
      this.loading = true;
      const { sort, year, keyword, lang } = this.filters;
      let sortField = "year";
      let sortType = "desc";

      if (sort === "year_asc") sortType = "asc";
      else if (sort === "name_asc") sortField = "name", sortType = "asc";
      else if (sort === "name_desc") sortField = "name", sortType = "desc";

      let query = `${this.path}?page=${this.currentPage}&sort_field=${sortField}&sort_type=${sortType}&limit=20`;

      if (year) query += `&year=${year}`;
      if (keyword) query += `&keyword=${encodeURIComponent(keyword)}`;
      if (lang) query += `&lang=${encodeURIComponent(lang)}`;

      ListMovieByCate1(query, (result) => {
        if (result.status === "success" || result.status == true) {
          this.movies = result.data.items;
          this.titlePage = result.data.titlePage;
          if (result.data.seoOnPage) {
            this.updateMetaTags(result.data.seoOnPage);
          }
        }
        this.loading = false;
      }, (err) => {
        console.error(err);
        this.loading = false;
      });
    },

    applyFilters() {
      this.currentPage = 1;
      this.ListMovie();
    },

    getOptimizedImage(imagePath) {
      return `${this.urlImage + "https://phimimg.com/" + encodeURIComponent(imagePath)}`;
    },

    updateMetaTags(seo) {
      document.title = seo.titleHead || "Phim hay";
    },
  },
  watch: {
    currentPage() {
      this.ListMovie();
    },
  },
};
</script>

<style scoped>
.filter-bar {
  background-color: #1f1f2a;
  border-radius: 12px;
  color: white;
}
.search-page {
  background: linear-gradient(to right, #0f0c29, #302b63, #24243e);
  color: #fff;
  min-height: 100vh;
  padding: 2rem 1rem;
}
</style>

<template>
  <v-container class="search-page" fluid>
    <!-- <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <h2 class="text-title">{{ $t("Danh sách phim:") }} Phim Bộ Hay Nhất - Bộ Sưu Tập Đỉnh Cao</h2>
        <v-divider class="my-4" />
      </v-col>
    </v-row> -->

    <FilterMovie @filter-changed="onFilterChanged" />
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="6" class="text-md-left">
        <h2 class="page-title">🎬 Phim Bộ Hay Nhất - Bộ Sưu Tập Đỉnh Cao</h2>
      </v-col>

      <v-col cols="12" md="6" class="text-md-right">
        <span class="stats-bar"> {{ movies.length }} phim </span>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" class="text-center" v-if="loading">
        <v-progress-circular indeterminate color="primary" size="50" />
      </v-col>

      <v-col cols="12" v-else>
        <v-alert
          v-if="movies.length === 0 && MessageErr == ''"
          class="text-center"
        >
          {{ $t("Không tìm thấy phim nào với từ khóa") }} "<strong>{{
            $route.query.keyword
          }}</strong
          >".
          <br />
          <router-link to="/home">
            <v-btn variant="outlined" class="mt-2">{{
              $t("Về trang chủ")
            }}</v-btn>
          </router-link>
        </v-alert>

        <v-alert
          v-else-if="movies.length === 0 && MessageErr != ''"
          class="text-center"
        >
          {{ $t("Không tìm thấy phim nào với từ khóa") }} "<strong>{{
            MessageErr
          }}</strong
          >".
        </v-alert>

        <v-row v-else class="movie-grid">
          <v-col
            v-for="movie in movies"
            :key="movie.slug"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <router-link
              :to="{ name: 'Movies', params: { slug: movie.slug } }"
              class="movie-link"
            >
              <v-card class="movie-card">
                <div class="poster-wrapper">
                  <v-img
                    :src="getOptimizedImage(movie.poster_url)"
                    height="300"
                    cover
                  >
                    <template #placeholder>
                      <div
                        class="d-flex align-center justify-center fill-height"
                      >
                        <v-progress-circular indeterminate />
                      </div>
                    </template>
                  </v-img>

                  <!-- overlay -->
                  <div class="gradient-overlay"></div>

                  <!-- hover play -->
                  <div class="hover-overlay">
                    <v-icon size="50">mdi-play-circle</v-icon>
                  </div>

                  <!-- TOP BADGE -->
                  <div class="top-badges">
                    <span class="badge quality">{{ movie.quality }}</span>
                    <span class="badge lang">{{ movie.lang }}</span>
                  </div>

                  <!-- EPISODE -->
                  <div class="episode-badge">
                    {{ movie.episode_current }}
                  </div>

                  <!-- RATING -->
                  <div class="rating">
                    ⭐ {{ Number(movie.tmdb.vote_average || 0).toFixed(1) }}
                  </div>
                </div>

                <v-card-text class="movie-info">
                  <!-- TITLE -->
                  <div class="movie-title">
                    {{ movie.name }}
                  </div>

                  <!-- SUB -->
                  <div class="movie-sub">
                    {{ movie.origin_name }}
                  </div>

                  <!-- META -->
                  <div class="meta-row">
                    <span>{{ movie.year }}</span>
                    <span>•</span>
                    <span>{{ movie.time }}</span>
                  </div>

                  <!-- GENRE -->
                  <div class="genre-list">
                    <span
                      v-for="c in movie.category.slice(0, 2)"
                      :key="c.id"
                      class="genre-item"
                    >
                      {{ c.name }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </router-link>
          </v-col>
        </v-row>
        <div
          ref="loadMoreTrigger"
          v-show="movies.length > 0 && !isLastPage"
          class="load-more-trigger"
        >
          <v-progress-circular v-if="loadingMore" indeterminate color="red" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { urlImage1, ListMovieByCate1 } from "@/model/api";
import FilterMovie from "@/pages/FilterMovie.vue";
export default {
  name: "PhimBo",
  data() {
    return {
      loading: true,
      currentPage: 1,
      moviesPerPage: 20,
      totalMovies: 100,
      movies: [],
      path: "phim-bo",
      urlImage: urlImage1,
      titlePage: "",
      MessageErr: "",

      loadingMore: false,
      isLastPage: false,
      observer: null,

      filters: {
        keyword: "",
        year: "",
        lang: "",
        category: "",
        country: "",
        sortOption: "modified.time",
      },
    };
  },
  components: {
    FilterMovie,
  },
  mounted() {
    this.ListMovie();
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    onFilterChanged(newFilters) {
      this.filters = { ...newFilters };
      this.currentPage = 1;
      this.ListMovie();
    },

    ListMovie(isLoadMore = false) {
      if (isLoadMore) {
        this.loadingMore = true;
      } else {
        this.loading = true;
        this.movies = [];
        this.isLastPage = false;
      }

      if (this.filters.year == null || this.filters.year == undefined) {
        this.filters.year = "";
      }
      if (this.filters.lang == null || this.filters.lang == undefined) {
        this.filters.lang = "";
      }
      if (this.filters.category == null || this.filters.category == undefined) {
        this.filters.category = "";
      }
      if (this.filters.country == null || this.filters.country == undefined) {
        this.filters.country = "";
      }
      // this.movies = [];
      if (this.currentPage === 1) {
        this.movies = [];
      }
      ListMovieByCate1(
        `${this.path}?keyword=${this.filters.keyword}&page=${this.currentPage}&sort_field=${this.filters.sortOption}&sort_type=desc&sort_lang=${this.filters.lang}&category=${this.filters.category}&country=${this.filters.country}&year=${this.filters.year}&limit=20`,
        (result) => {
          if (result.status === "success" || result.status == true) {
            const newMovies = result.data.items || [];
            if (isLoadMore) {
              this.movies = [...this.movies, ...newMovies];
            } else {
              this.movies = newMovies;
            }

            this.titlePage = result.data.titlePage;
            
            // Chỉ dừng lại khi không còn phim nào trả về
            if (newMovies.length === 0) {
              this.isLastPage = true;
            }
            if (result.data.seoOnPage) {
              this.updateMetaTags(result.data.seoOnPage);
            }
            this.loading = false;
            this.loadingMore = false;
          } else {
            this.loading = false;
            this.loadingMore = false;
            this.MessageErr = this.$t(
              "Không có dữ liệu được hiển thị, vui lòng tải lại trang",
            );
          }
        },
        (err) => {
          console.log(err);
          this.loading = false;
          this.loadingMore = false;
          this.MessageErr = this.$t(
            "Hết thời gian chờ, vui lòng tải lại trang",
          );
        },
      );
    },
    initObserver() {
      if (!this.$refs.loadMoreTrigger) return;

      if (this.observer) {
        this.observer.disconnect();
      }

      this.observer = new IntersectionObserver((entries) => {
        const entry = entries[0];

        if (
          entry.isIntersecting &&
          !this.loadingMore &&
          !this.isLastPage &&
          !this.loading
        ) {
          this.currentPage++;
          this.ListMovie(true);
        }
      }, { rootMargin: "250px 0px" });

      this.observer.observe(this.$refs.loadMoreTrigger);
    },
    getOptimizedImage(imagePath) {
      return `${
        this.urlImage + "https://phimimg.com/" + encodeURIComponent(imagePath)
      }`;
    },
    // Chuan SEO
    updateMetaTags(seo) {
      document.title = seo.titleHead || "Phim hay";

      const removeOldMeta = (key, attr = "name") => {
        const old = document.querySelectorAll(`meta[${attr}="${key}"]`);
        old.forEach((tag) => tag.remove());
      };

      const setMeta = (key, content, attr = "name") => {
        if (!content) return;
        const meta = document.createElement("meta");
        meta.setAttribute(attr, key);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      };

      // Xóa cũ
      removeOldMeta("description");
      removeOldMeta("og:title", "property");
      removeOldMeta("og:description", "property");
      removeOldMeta("og:type", "property");
      removeOldMeta("og:image", "property");

      // Thêm mới
      setMeta("description", seo.descriptionHead);
      setMeta("og:title", seo.titleHead, "property");
      setMeta("og:description", seo.descriptionHead, "property");
      setMeta("og:type", seo.og_type || "website", "property");

      if (Array.isArray(seo.og_image)) {
        seo.og_image.forEach((img) => {
          setMeta("og:image", img, "property");
        });
      }
    },
  },
  watch: {
    movies() {
      this.$nextTick(() => {
        this.initObserver();
      });
    },
  },
};
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  padding: 3rem 1rem;
  background: linear-gradient(to right, #0f0c29, #302b63, #24243e);
  color: #fff;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
}

.stats-bar {
  font-size: 1rem;
  color: #aaa;
}

.movie-link {
  text-decoration: none;
  color: inherit;
}

.movie-grid {
  row-gap: 24px;
}

.movie-card {
  border-radius: 12px;
  overflow: hidden;
  background: #1a1c23;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    box-shadow 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: fadeUp 0.6s ease-out backwards;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.movie-card:hover {
  transform: translateY(-6px) scale(1.03);
  z-index: 2;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.8);
}

.poster-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 2 / 3;
  background-color: #111;
}

/* Tối ưu phóng to ảnh mượt mà khi hover */
:deep(.v-img__img) {
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.movie-card:hover :deep(.v-img__img) {
  transform: scale(1.1);
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(20, 21, 28, 1) 0%,
    rgba(20, 21, 28, 0.2) 50%,
    transparent 100%
  );
  pointer-events: none;
}

.hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

.hover-overlay .v-icon {
  transform: scale(0.8);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: #fff;
}

.movie-card:hover .hover-overlay .v-icon {
  transform: scale(1);
  color: #ff9800;
}

.top-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 6px;
  z-index: 3;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.badge.quality {
  color: #ffeb3b;
  border: 1px solid rgba(255, 235, 59, 0.3);
}

.badge.lang {
  color: #64b5f6;
  border: 1px solid rgba(100, 181, 246, 0.3);
}

.episode-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #e53935;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(229, 57, 53, 0.4);
}

.rating {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: #ffeb3b;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  z-index: 3;
  backdrop-filter: blur(4px);
}

.movie-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.movie-title {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 4px;
  min-height: 42px;
}

.movie-card:hover .movie-title {
  color: #ff9800;
}

.movie-sub {
  font-size: 12px;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 6px;
}

.meta-row {
  font-size: 12px;
  color: #bbb;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.genre-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: auto;
}

.genre-item {
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: #ddd;
  transition: background 0.2s;
}

.genre-item:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.load-more-trigger {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;
}

/* Responsive Design cho Mobile */
@media (max-width: 600px) {
  .movie-grid {
    row-gap: 16px;
  }
  .movie-title {
    font-size: 13px;
    min-height: 36px;
  }
  .movie-info {
    padding: 10px;
  }
  .badge,
  .episode-badge,
  .rating {
    font-size: 10px;
    padding: 2px 6px;
  }
}
</style>

<template>
  <v-container class="search-page" fluid>
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <h2 class="text-center">
          Danh sách phim: {{ titlePage }}
        </h2>
        <v-divider class="my-4" />
      </v-col>
    </v-row>


    <!-- 🧭 Thanh bộ lọc tìm kiếm -->

  <v-row
    justify="center"
  >
    <!-- 🔍 Tìm kiếm -->
    <v-col>
      <v-text-field
        v-model="filters.keyword"
        label="Tìm phim..."
        clearable
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
      />
    </v-col>

    <!-- 🎞 Thể loại -->
    <v-col >
      <v-select
        v-model="filters.category"
        :items="Categories"
        item-title="title"
        item-value="value"
        label="Thể loại"
        clearable
        variant="outlined"
        density="comfortable"
      />
    </v-col>

    <!-- 🌍 Quốc gia -->
    <v-col >
      <v-select
        v-model="filters.country"
        :items="Countries"
        item-title="title"
        item-value="value"
        label="Quốc gia"
        clearable
        variant="outlined"
        density="comfortable"
      />
    </v-col>

    <!-- 📅 Năm -->
    <v-col >
      <v-select
        v-model="filters.year"
        :items="years"
        label="Năm"
        clearable
        variant="outlined"
        density="comfortable"
      />
    </v-col>

    <!-- 💬 Ngôn ngữ -->
    <v-col  >
      <v-select
        v-model="filters.lang"
        :items="languages"
        label="Ngôn ngữ"
        clearable
        variant="outlined"
        density="comfortable"
      />
    </v-col>

    <!-- ↕️ Sắp xếp -->
    <v-col  >
      <v-select
        v-model="filters.sort"
        :items="sortOptions"
        item-title="title"
        item-value="value"
        label="Sắp xếp"
        variant="outlined"
        density="comfortable"
      />
    </v-col>

    <!-- 🧭 Nút lọc -->
    <v-col >
      <el-button
        type="primary"
        icon="el-icon-search"
        class="mt-2"
        @click="applyFilters"
      >
        Lọc
      </el-button>
    </v-col>
  </v-row>
<v-divider class="my-4" />





    <v-row justify="center">
      <v-col cols="12" class="text-center" v-if="loading">
        <v-progress-circular indeterminate color="primary" size="50" />
      </v-col>

      <v-col cols="12" v-else>
        <v-alert v-if="movies.length === 0" class="text-center">
          Không tìm thấy phim nào với từ khóa "<strong>{{
            $route.query.keyword
          }}</strong
          >".
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
                    <v-card
                      class="mx-auto bg-dark movie-card"
                      width="auto"
                    >
                      <v-img
                        :src="getOptimizedImage(movie.poster_url)"
                        :lazy-src="getOptimizedImage(movie.poster_url)"
                        :alt="movie.name"
                        spect-ratio="16/9"
                        class="movie-image"
                        transition="fade-transition"
                        height="250"
                        width="100%"
                        cover
                      >
                        <template #default>
                          <!-- <v-btn
                            icon
                            size="small"
                            color="red"
                            variant="flat"
                            class="favorite-btn"
                            @click.stop="toggleFavorite(item)"
                          >
                            <v-icon>
                              {{
                                isFavorite(item)
                                  ? "mdi-heart"
                                  : "mdi-heart-outline"
                              }}
                            </v-icon>
                          </v-btn> -->

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
                        </template>
                      </v-img>

                      <v-card-subtitle class="episode-lang" style="margin-top: 5px;">
                        {{
                          movie.episode_current === "Tập 0"
                            ? `Full - ${movie.lang}`
                            : `${movie.episode_current} - ${movie.lang}`
                        }}
                      </v-card-subtitle>

                      <v-card-title class="movie-title">{{
                        movie.name
                      }}</v-card-title>

                      <v-card-text class="movie-info">
                        <div class="text-grey text-truncate">
                          <v-icon size="14" class="mr-1"
                            >mdi-tag</v-icon
                          >
                          {{ movie.origin_name }} ({{ movie.year }})
                        </div>
                      </v-card-text>
                    </v-card>
                  </router-link>
                </v-col>
              </v-row>

        <!-- <router-link
          v-for="movie in movies"
          :key="movie.id"
          :to="{ name: 'MovieDetail', params: { slug: movie.slug } }"
          class="text-decoration-none"
        >
          <v-card class="mb-5 overflow-hidden movie-card" elevation="4" hover>
            <v-row>
              <v-col cols="12" md="4">
                <v-img
                  :src="getOptimizedImage(movie.poster_url)"
                  :lazy-src="getOptimizedImage(movie.poster_url)"
                  :alt="movie.name"
                  spect-ratio="16/9"
                  class="movie-image"
                  transition="fade-transition"
                  cover
                />
              </v-col>
              <v-col cols="12" md="8" class="pa-6">
                <h3 class="text-left title">{{ movie.name }}</h3>
                <div class="genre-section mb-3">
                  <v-chip
                    v-for="(genre, index) in movie.category"
                    :key="index"
                    class="ma-1"
                    label
                  >
                    {{ genre.name }}
                  </v-chip>
                </div>

                <div class="meta-info mb-2 d-flex align-center flex-wrap">
                  <v-rating
                    v-model="valueRate"
                    active-color="orange"
                    color="orange-lighten-1"
                  ></v-rating>
                  <v-icon size="18" class="me-1 text-grey">mdi-calendar</v-icon>
                  <span class="me-4">{{ movie.year }}</span>
                </div>

                <p class="text-body-2 description-text">
                  Miêu tả: {{ movie.origin_name }}
                </p>

                <div class="action-buttons mt-4">
                  <v-btn
                    variant="flat"
                    color="primary"
                    class="me-2"
                    prepend-icon="mdi-play-circle"
                  >
                    {{ $t("Xem ngay") }}
                  </v-btn>
                  <v-btn
                    v-bind="props"
                    color="secondary"
                    variant="outlined"
                    prepend-icon="mdi-share-variant"
                  >
                    {{ $t("Chia sẻ") }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </router-link> -->

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
import { urlImage1, ListMovieByCate1,Search1 } from "@/model/api";

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
        category: "",
        country: "",
        sort: "desc",
      },

      years: Array.from({ length: 20 }, (_, i) => `${2025 - i}`),
      languages: ["vietsub ", "thuyet-minh ", "long-tieng"],
      Categories:[
        { title: "Hành động", value: "hanh-dong" },
        { title: "Tình cảm", value: "tinh-cam" }
      ],
      Contry: [
        { title: "Trung Quốc", value: "trung-quoc" },
        { title: "Việt Nam", value: "viet-nam" }
      ],
      sortOptions: [
        { title: "Năm ↓", value: "desc" },
        { title: "Năm ↑", value: "asc" }
      ],
    };
  },
  mounted() {
    this.ListMovie();
  },
  methods: {
    ListMovie() {
      ListMovieByCate1(
        
        `${this.path}?page=${this.currentPage}&sort_field=year&sort_type=desc&limit=20`,
        (result) => {
          if (result.status === "success" || result.status == true) {
            this.movies = result.data.items;
            this.titlePage = result.data.titlePage;
            if (result.data.seoOnPage) {
              this.updateMetaTags(result.data.seoOnPage);
            }
            this.loading = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    getOptimizedImage(imagePath) {
      return `${ this.urlImage + "https://phimimg.com/" + encodeURIComponent(imagePath) }`;
    },


    applyFilters() {
      this.loading = true;
      this.movies = [];
      this.currentPage = 1;
      const params = new URLSearchParams({
        keyword: this.filters.keyword || "",
        page: this.currentPage,
        sort_field: "modified.time",
        sort_type: "desc",
        sort_lang: this.filters.lang || "",
        category: this.filters.category || "",
        country: this.filters.country || "",
        year: this.filters.year || "",
        limit: 20,
      }).toString();
      
      Search1(
        `${params}`,
        (result) => {
          if (result.status === "success" || result.status === true) {
            this.movies = result.data.items;
            this.titlePage = result.data.titlePage;
            if (result.data.seoOnPage) {
              this.updateMetaTags(result.data.seoOnPage);
            }
          } else {
            console.warn("⚠️ Không có dữ liệu hợp lệ từ API");
          }
          this.loading = false;
        },
        (err) => {
          console.error("❌ Lỗi gọi API:", err);
          this.loading = false;
        }
      );
      
    },
    //return `${this.urlImage + "https://phimimg.com/" + encodeURIComponent(imagePath)}&w=384&q=100`;
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
    currentPage() {
      this.loading = true;
      this.ListMovie();
    },
  },
};
</script>
  
  <style scoped>
.search-page {
  min-height: 100vh;
  padding: 2rem 0;
  padding: 3rem 1rem;
}

.movie-card {
  border: none;
  border-radius: 8px;
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: translateY(-3px);
  color: orange;
}
.movie-image-loaded {
  opacity: 1;
}
.movie-image {
  width: 440px;
  height: 250px;
  object-fit: cover;
  border-radius: 8px 0 0 8px;
  transition: opacity 0.5s ease-in;
  opacity: 1;
}

.rating-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
}

.genre-section {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.genre-item {
  border-radius: 5px;
  font-size: 0.9rem;
  opacity: 0.8;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.meta-info {
  font-size: 0.95rem;
}

.description-text {
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.action-buttons {
  border-top: 1px solid #444;
  padding-top: 1rem;
}
.d-flex {
  display: flex !important;
  align-items: flex-start;
}
.b-card-body {
  text-align: left;
}

.genre-section,
.meta-info,
.description-text {
  display: flex;
  justify-content: flex-start;
}

.genre-item {
  display: inline-block;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
}
.overflow-hidden {
  background-color: #111218;
  color: #fff;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.overflow-hidden:hover {
  transform: scale(1.01);
  box-shadow: 0 5px 12px rgba(255, 255, 255, 0.05);
}
.search-page {
  min-height: 100vh;
  padding: 3rem 1rem;
  background: linear-gradient(to right, #0f0c29, #302b63, #24243e);
  color: #fff;
}

.movie-card {
  border-radius: 12px;
  transition: transform 0.25s ease, box-shadow 0.3s ease;
  background-color: #1e1f29;
}

.movie-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(255, 255, 255, 0.08);
}

.movie-image {
  border-radius: 12px 0 0 12px;
  transition: opacity 0.5s ease;
}

.genre-section {
  flex-wrap: wrap;
}

.genre-section .v-chip {
  background-color: #2e2f3a;
  color: #fff;
  font-size: 0.85rem;
}

.description-text {
  font-size: 0.95rem;
  line-height: 1.6;
  -webkit-line-clamp: 4;
}

.meta-info .v-icon {
  vertical-align: middle;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.v-btn {
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
}
.v-list-item-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.title:hover {
  color: orange;
}

.movie-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.25s ease;
  pointer-events: none; /* không chặn click */
}

.movie-card:hover .movie-overlay {
  background: rgba(0, 0, 0, 0.45);
}

.movie-play {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  opacity: 0;
  transition: opacity 0.18s ease, transform 0.18s ease;
  pointer-events: none;
  z-index: 2;
}

/* show play khi hover */
.movie-card:hover .movie-play {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.filter-bar {
  background: #1f1f2a;
  color: #fff;
  border-radius: 12px;
}
.v-select,
.v-text-field {
  color: white;
}
.movie-title{
  font-size: 14px;
}
</style>
  
<template>
  <v-container class="search-page" fluid>
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <h2 class="text-center">
         {{$t('Danh sách phim:')}}  {{ titlePage }}
        </h2>
        <v-divider class="my-4" />
      </v-col>
    </v-row>
    <FilterMovie @filter-changed="onFilterChanged" />
    <v-row justify="center">
      <v-col cols="12" class="text-center" v-if="loading">
        <v-progress-circular indeterminate color="primary" size="50" />
      </v-col>

      <v-col cols="12" v-else>
        <v-alert v-if="movies.length === 0 && MessageErr == ''" class="text-center">
          {{$t('Không tìm thấy phim nào với từ khóa')}} "<strong>{{
            $route.query.keyword
          }}</strong
          >".
          <br />
          <router-link to="/home">
            <v-btn variant="outlined" class="mt-2">Về trang chủ</v-btn>
          </router-link>
        </v-alert>

        <v-alert v-else-if="movies.length === 0 && MessageErr != ''" class="text-center">
          {{$t('Không tìm thấy phim nào với từ khóa')}} "<strong>{{
            MessageErr
          }}</strong
          >".
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
                  sm="6"
                  md="3"
                  style="padding: 10px"
                >
                  
                  <router-link
                    :to="{ name: 'Movies', params: { slug: movie.slug } }"
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
<div class="badge-container">
                          <!-- hiển thị bên trái -->
                          <v-btn
                            size="small"
                            variant="flat"
                            class="badge-top-left"
                          >
                            {{Number(movie.tmdb.vote_average).toFixed(1)}}
                            <v-icon
                            icon="mdi-star"
                            end
                            ></v-icon>
                          </v-btn>

                          <!-- hiển thị bên phải -->
                          <v-btn
                            icon
                            size="small"
                            variant="flat"
                            class="badge-top-right"
                          >
                            {{movie.quality}}
                          </v-btn>
                           </div>
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
                        <template #placeholder>
                          <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular
                              color="blue-lighten-3"
                :width="5"
                              indeterminate
                            ></v-progress-circular>
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
          :to="{ name: 'Movies', params: { slug: movie.slug } }"
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
import { urlImage1, ListMovieByCate1,ListMovieNew1 } from '@/model/api'
import FilterMovie from "@/pages/FilterMovie.vue"
export default {
  name: 'PhimNew',
  props: ['path'],
  data() {
    return {
      loading: true,
      currentPage: 1,
      moviesPerPage: 20,
      totalMovies: 100,
      movies: [],
      urlImage: urlImage1,
      titlePage: '',
      link1: '',
      MessageErr: '',
      loadingMore: false,
      isLastPage: false,
      observer: null,

      filters: {
        keyword: "",
        year: "",
        lang: "",
        category: "",
        country: "",
        sortOption: "year"
      },
    }
  },
  mounted() {
    this.ListMovie(this.path)
  },
  components:{
    FilterMovie
  },
  methods: {
    onFilterChanged(newFilters) {
      this.filters = { ...newFilters };
      this.currentPage = 1;
      this.ListMovie(this.path);
    },

    ListMovie(path) {
      if(this.filters.year == null || this.filters.year == undefined){
        this.filters.year = ''
      }
      if(this.filters.lang == null || this.filters.lang == undefined){
        this.filters.lang = ''
      }
      if(this.filters.category == null || this.filters.category == undefined){
        this.filters.category = ''
      }
      if(this.filters.country == null || this.filters.country == undefined){
        this.filters.country = ''
      }
      this.loading = true;
      this.movies = [];
      if(path.includes('phim-moi-cap-nhat')){
        ListMovieNew1(`${path}?keyword=${this.filters.keyword}&page=${this.currentPage}&sort_field=${this.filters.sortOption}&sort_type=desc&sort_lang=${this.filters.lang}&category=${this.filters.category}&country=${this.filters.country}&year=${this.filters.year}&limit=20`, (result) => {
        if (result.status === 'success' || result.status == true) {
          this.movies = result.items
          this.titlePage = "Phim mới cập nhật"
          this.link1 = 'link1'
          // if (result.data.seoOnPage) {
          //       this.updateMetaTags(result.data.seoOnPage)
          //     }
          this.loading = false
        }
        else{
            this.loading = false
          this.MessageErr = this.$t("Không có dữ liệu được hiển thị, vui lòng tải lại trang")
          }
      }, (err) => {
        console.log(err)
        this.loading = false
          this.MessageErr = this.$t("Hết thời gian chờ, vui lòng tải lại trang")
      })
      }
      else{
        ListMovieByCate1(`${path}?page=${this.currentPage}&sort_field=${this.filters.sortOption}&sort_type=desc&sort_lang=${this.filters.lang}&category=${this.filters.category}&country=${this.filters.country}&year=${this.filters.year}&limit=20`, (result) => {
        if (result.status === 'success' || result.status == true) {
          this.movies = result.data.items
          this.titlePage = "Phim mới cập nhật"
          // if (result.data.seoOnPage) {
          //       this.updateMetaTags(result.data.seoOnPage)
          //     }
          this.loading = false
        }
      }, (err) => {
        console.log(err)
      })
      }
      
    },
    getOptimizedImage(imagePath) {
      // return `${this.urlImage + "https://phimimg.com/" + encodeURIComponent(imagePath)}`
      if(this.link1 == 'link1'){
        return `${this.urlImage + encodeURIComponent(imagePath)}`
      }
      else{
      return `${this.urlImage + "https://phimimg.com/"+ encodeURIComponent(imagePath)}`

      }

    },

      // return `${this.urlImage + encodeURIComponent(imagePath)}&w=384&q=100`

    // Chuan SEO
    updateMetaTags(seo) {
    document.title = seo.titleHead || 'Phim hay'

    const removeOldMeta = (key, attr = 'name') => {
      const old = document.querySelectorAll(`meta[${attr}="${key}"]`)
      old.forEach(tag => tag.remove())
    }

    const setMeta = (key, content, attr = 'name') => {
      if (!content) return
      const meta = document.createElement('meta')
      meta.setAttribute(attr, key)
      meta.setAttribute('content', content)
      document.head.appendChild(meta)
    }

    // Xóa cũ
    removeOldMeta('description')
    removeOldMeta('og:title', 'property')
    removeOldMeta('og:description', 'property')
    removeOldMeta('og:type', 'property')
    removeOldMeta('og:image', 'property')

    // Thêm mới
    setMeta('description', seo.descriptionHead)
    setMeta('og:title', seo.titleHead, 'property')
    setMeta('og:description', seo.descriptionHead, 'property')
    setMeta('og:type', seo.og_type || 'website', 'property')

    if (Array.isArray(seo.og_image)) {
      seo.og_image.forEach(img => {
        setMeta('og:image', img, 'property')
      })
    }
  }
  },
  watch: {
    path(newPath) {
      this.currentPage = 1;
      this.ListMovie(newPath)
    },
    movies() {
      this.$nextTick(() => {
        this.initObserver();
      });
    },
  }
}
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
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
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
  background: linear-gradient(to top, rgba(20, 21, 28, 1) 0%, rgba(20, 21, 28, 0.2) 50%, transparent 100%);
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
  .badge, .episode-badge, .rating {
    font-size: 10px;
    padding: 2px 6px;
  }
}
</style>

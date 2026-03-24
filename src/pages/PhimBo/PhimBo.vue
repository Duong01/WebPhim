<template>
  <v-container class="search-page" fluid>
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <h2 class="text-center">
          {{$t('Danh sách phim:')}} {{ titlePage }}
        </h2>
        <v-divider class="my-4" />
      </v-col>
    </v-row>

    <FilterMovie @filter-changed="onFilterChanged" />
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="6" class="text-md-left">
        <h2 class="page-title">🎬 {{ titlePage }}</h2>
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
        <v-alert v-if="movies.length === 0 && MessageErr == ''" class="text-center">
          {{$t('Không tìm thấy phim nào với từ khóa')}} "<strong>{{
            $route.query.keyword
          }}</strong
          >".
          <br />
          <router-link to="/home">
            <v-btn variant="outlined" class="mt-2">{{$t('Về trang chủ')}}</v-btn>
          </router-link>
        </v-alert>

        <v-alert v-else-if="movies.length === 0 && MessageErr != ''" class="text-center">
          {{$t('Không tìm thấy phim nào với từ khóa')}} "<strong>{{
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
                    <div class="d-flex align-center justify-center fill-height">
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
      <span>•</span>
      <span>{{ movie.country[0]?.name }}</span>
    </div>

    <!-- GENRE -->
    <div class="genre-list">
      <span
        v-for="c in movie.category.slice(0,2)"
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
        v-show="movies.length"
        class="load-more-trigger"
      >
        <v-progress-circular v-if="loadingMore" indeterminate color="red" />
      </div>


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
      MessageErr: '',

      loadingMore: false,
      isLastPage: false,
      observer: null,
      observerInited: false,

      filters: {
        keyword: "",
        year: "",
        lang: "",
        category: "",
        country: "",
        sortOption: "modified.time"
      },
    };
  },
  components:{
    FilterMovie
  },
  mounted() {
    this.ListMovie();
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
      // this.movies = [];
      if (this.currentPage === 1) {
        this.movies = [];
      }
      ListMovieByCate1(
        `${this.path}?keyword=${this.filters.keyword}&page=${this.currentPage}&sort_field=${this.filters.sortOption}&sort_type=desc&sort_lang=${this.filters.lang}&category=${this.filters.category}&country=${this.filters.country}&year=${this.filters.year}&limit=20`,
        (result) => {
          if (result.status === "success" || result.status == true) {
            const newMovies = result.data.items;
            if (isLoadMore) {
              this.movies = [...this.movies, ...newMovies];
            } else {
              this.movies = newMovies;
            }

            this.titlePage = result.data.titlePage;
            // check hết data
            if (newMovies.length < this.moviesPerPage) {
              this.isLastPage = true;
            }
            if (result.data.seoOnPage) {
                this.updateMetaTags(result.data.seoOnPage)
              }
            this.loading = false;
            this.loadingMore = false;
          }
          else{
            this.loading = false
            this.loadingMore = false;
          this.MessageErr = this.$t("Không có dữ liệu được hiển thị, vui lòng tải lại trang")
          }
        },
        (err) => {
          console.log(err);
          this.loading = false
          this.loadingMore = false;
          this.MessageErr = this.$t("Hết thời gian chờ, vui lòng tải lại trang")
        }
      );
    },
    initObserver() {
      if (this.observerInited) return;
      if (!this.$refs.loadMoreTrigger) return;

      this.observerInited = true;

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
      });

      this.observer.observe(this.$refs.loadMoreTrigger);
    },
    getOptimizedImage(imagePath) {
      return `${this.urlImage + "https://phimimg.com/" +encodeURIComponent(imagePath)}`; 
    },
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
    movies() {
    if (!this.observerInited) {
      this.$nextTick(() => {
        this.initObserver();
      });
    }
  },
    currentPage() {
      this.loading = true;
      this.ListMovie();
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  border-radius: 16px;
  overflow: hidden;
  background: #181a24;
  transition: all 0.35s ease;
  position: relative;
}

.movie-card:hover {
  transform: translateY(-3px);
  color: orange;
  transform: translateY(-8px) scale(1.04);
  box-shadow: 0 20px 40px rgba(0,0,0,0.8);
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
.movie-title {
  font-size: 14px;
}
.badge-top-left,
.badge-top-right,
.badge-bottom-left,
.badge-bottom-right {
  position: absolute !important;
  background: rgba(105, 105, 105, 0.6) !important;
  color: orange !important;
  font-size: 12px !important;
  padding: 2px 10px !important;
  border-radius: 10px;
  z-index: 10;
  width: auto;
  height: auto;
  font-weight: 600 !important;
}

/* 4 góc */
.badge-top-left {
  top: 6px;
  left: 6px;
}

.badge-top-right {
  top: 6px;
  right: 6px;
  background-color: rgb(204, 35, 35) !important;
}
.movie-grid {
  row-gap: 20px;
}

.movie-card {
  border-radius: 16px;
  overflow: hidden;
  background: #111;
  transition: 0.35s;
}

.movie-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
}

.hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.3s;

}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

.movie-badges {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 6px;
}

.load-more-trigger {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* poster */
.poster-wrapper {
  position: relative;
}

/* gradient overlay */
.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.9), transparent 60%);
}
/* badge */
.top-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 6px;
}

.badge {
  background: rgba(0,0,0,.7);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
}

.badge.hot {
  background: #e53935;
}

/* rating */
.rating {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 13px;
  background: rgba(0,0,0,.7);
  padding: 3px 8px;
  border-radius: 6px;
}
.movie-info {
  padding: 10px;
}

.movie-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  height: 36px;
  overflow: hidden;
}

.movie-sub {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 4px;
}

/* genre */
.genre-list {
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.genre-item {
  font-size: 10px;
  background: rgba(255,255,255,0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

/* progress */
.progress-bar {
  margin-top: 8px;
  height: 3px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
}

.progress {
  width: 40%;
  height: 100%;
  background: red;
  border-radius: 3px;
}
.movie-link{
  text-decoration: none;
}
.movie-card {
  border-radius: 18px;
  overflow: hidden;
  background: #14151c;
  transition: all 0.4s ease;
  position: relative;
}

.movie-card:hover {
  transform: scale(1.05);
  z-index: 10;
  box-shadow: 0 20px 50px rgba(0,0,0,0.9);
}

/* poster */
.poster-wrapper {
  position: relative;
}

/* gradient */
.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.95), transparent 60%);
}

/* hover */
.hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,.6);
  opacity: 0;
  transition: .3s;
}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

/* badge */
.top-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 6px;
}

.badge {
  font-size: 11px;
  padding: 3px 7px;
  border-radius: 6px;
  background: rgba(0,0,0,.7);
}

.badge.lang {
  background: #1976d2;
}

/* episode */
.episode-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: #e53935;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
}

/* rating */
.rating {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0,0,0,.7);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
}

/* info */
.movie-info {
  padding: 10px;
}

.movie-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  height: 38px;
  overflow: hidden;
}

.movie-sub {
  font-size: 12px;
  opacity: 0.7;
}

/* meta */
.meta-row {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
  display: flex;
  gap: 5px;
}

/* genre */
.genre-list {
  margin-top: 6px;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.genre-item {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255,255,255,0.1);
}
</style>
  
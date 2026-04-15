<template>
  <v-container class="search-page" fluid>
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <h2 class="text-center">
          {{ $t("Kết quả tìm kiếm cho") }} "{{ $route.query.keyword }}"
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
        <v-alert v-if="movies.length === 0" class="text-center">
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
        
        <template v-else-if="movies.length <= 6">
          <router-link
            v-for="movie in movies"
            :key="'list-' + (movie.slug || movie._id)"
            :to="{ name: 'Movies', params: { slug: movie.slug } }"
            class="text-decoration-none"
          >
            <v-card class="mb-5 overflow-hidden movie-list-card" elevation="4" hover>
              <v-row no-gutters>
                <v-col cols="12" sm="4" md="3">
                  <div class="poster-wrapper h-100">
                    <v-img
                      :src="getOptimizedImage(movie.poster_url.includes('upload/vod') ? movie.thumb_url : movie.poster_url)"
                      :lazy-src="getOptimizedImage(movie.poster_url.includes('upload/vod') ? movie.thumb_url : movie.poster_url)"
                      :alt="movie.name"
                      class="movie-image h-100"
                      cover
                      min-height="250"
                    >
                      <template #placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-progress-circular indeterminate />
                        </div>
                      </template>
                    </v-img>
                    <div class="episode-badge">{{ movie.episode_current }}</div>
                    <div class="top-badges">
                      <span class="badge quality">{{ movie.quality || "FHD" }}</span>
                      <span class="badge lang">{{ movie.lang }}</span>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="8" md="9" class="pa-4 d-flex flex-column">
                  <h3 class="text-left text-white mb-1">{{ movie.name }}</h3>
                  <div class="genre-section mb-3">
                    <v-chip
                      v-for="(genre, index) in movie.category"
                      :key="index"
                      class="ma-1"
                      label
                      size="small"
                      color="grey-darken-3"
                      text-color="white"
                    >
                      {{ genre.name }}
                    </v-chip>
                  </div>
                  <div class="meta-info mb-2 d-flex align-center flex-wrap text-grey-lighten-1">
                    <v-icon size="18" class="me-1" color="orange">mdi-star</v-icon>
                    <span class="me-4 text-orange font-weight-bold">{{ Number(movie.tmdb?.vote_average || 0).toFixed(1) }}</span>
                    <v-icon size="18" class="me-1">mdi-calendar</v-icon>
                    <span class="me-4">{{ movie.year }}</span>
                    <v-icon size="18" class="me-1" v-if="movie.time">mdi-clock-outline</v-icon>
                    <span class="me-4" v-if="movie.time">{{ movie.time }}</span>
                  </div>
                  <p class="text-body-2 description-text text-grey-lighten-1 mb-4">
                    {{ $t("Miêu tả") }}: <span v-html="movie.origin_name"></span>
                  </p>
                  
                  <div class="mt-auto action-buttons pt-4">
                    <v-btn variant="flat" color="red-darken-1" class="me-3 text-none" prepend-icon="mdi-play-circle">
                      {{ $t("Xem ngay") }}
                    </v-btn>
                    <v-btn @click.prevent.stop="shareMovie(movie)" variant="outlined" color="grey-lighten-2" class="me-3 text-none" prepend-icon="mdi-share-variant">
                      {{ $t("Chia sẻ") }}
                    </v-btn>
                    <v-btn @click.prevent.stop="handleFavorite(movie)" variant="outlined" color="grey-lighten-2" class="text-none" prepend-icon="mdi-bookmark">
                      {{ $t("Xem sau") }}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </router-link>
        </template>
        <v-row v-else class="movie-grid">
          <v-col
            v-for="movie in movies"
            :key="movie.slug || movie._id"
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
                    :src="
                      getOptimizedImage(
                        movie.poster_url.includes('upload/vod')
                          ? movie.thumb_url
                          : movie.poster_url
                      )
                    "
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

                  <div class="gradient-overlay"></div>

                  <div class="hover-overlay">
                    <v-icon size="50">mdi-play-circle</v-icon>
                  </div>

                  <div class="top-badges">
                    <span class="badge quality">{{
                      movie.quality || "FHD"
                    }}</span>
                    <span class="badge lang">{{ movie.lang }}</span>
                  </div>

                  <div class="episode-badge">
                    {{ movie.episode_current }}
                  </div>

                  <div
                    class="rating"
                    v-if="movie.tmdb && movie.tmdb.vote_average"
                  >
                    ⭐ {{ Number(movie.tmdb.vote_average || 0).toFixed(1) }}
                  </div>
                </div>

                <v-card-text class="movie-info">
                  <div class="movie-title">
                    {{ movie.name }}
                  </div>
                  <div class="movie-sub">
                    {{ movie.origin_name }}
                  </div>
                  <div class="meta-row">
                    <span>{{ movie.year }}</span>
                    <span v-if="movie.time">•</span>
                    <span v-if="movie.time">{{ movie.time }}</span>
                  </div>
                  <div class="genre-list" v-if="movie.category">
                    <span
                      v-for="c in movie.category.slice(0, 2)"
                      :key="c.id || c.name"
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

      <!-- dialog share -->
      <v-dialog v-model="shareDialog" max-width="500">
        <v-card class="pa-4" style="background-color: #1e1e1e; color: white">
          <v-card-title class="text-h6 justify-center">{{
            $t("Chia sẻ")
          }}</v-card-title>

          <v-row class="justify-center mt-4" dense>
            <v-col cols="3" class="text-center">
              <v-btn
                icon
                size="large"
                @click="shareTo('facebook')"
                class="bg-grey-darken-4"
              >
                <v-icon icon="mdi-facebook" />
              </v-btn>
              <div class="mt-1 text-caption">Facebook</div>
            </v-col>

            <v-col cols="3" class="text-center">
              <v-btn
                icon
                size="large"
                @click="shareTo('youtube')"
                class="bg-grey-darken-4"
              >
                <v-icon icon="mdi-youtube" />
              </v-btn>
              <div class="mt-1 text-caption">YouTube</div>
            </v-col>

            <v-col cols="3" class="text-center">
              <v-btn
                icon
                size="large"
                @click="copyLink"
                class="bg-grey-darken-4"
              >
                <v-icon icon="mdi-link-variant" />
              </v-btn>
              <div class="mt-1 text-caption">Copy link</div>
            </v-col>

            <v-col cols="3" class="text-center">
              <v-btn
                icon
                size="large"
                @click="shareTo('twitter')"
                class="bg-grey-darken-4"
              >
                <v-icon icon="mdi-twitter" />
              </v-btn>
              <div class="mt-1 text-caption">Twitter</div>
            </v-col>
            <v-col cols="3" class="text-center">
              <v-btn
                icon
                size="large"
                @click="shareTo('tiktok')"
                class="bg-grey-darken-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="white"
                >
                  <path
                    d="M12.75 2h2.5c.1 1.2.6 2.3 1.5 3.2.9.9 2 1.4 3.2 1.5v2.6c-1.4-.1-2.7-.5-3.9-1.2v5.6c0 3.4-2.7 6.1-6.1 6.1S4 17.1 4 13.7 6.7 7.6 10.1 7.6c.3 0 .6 0 .9.1v2.7c-.3-.1-.6-.2-.9-.2-1.9 0-3.5 1.6-3.5 3.5S8.2 17.2 10.1 17.2s3.5-1.6 3.5-3.5V2z"
                  />
                </svg>
              </v-btn>
              <div class="mt-1 text-caption">TikTok</div>
            </v-col>
          </v-row>

          <v-card
            class="mt-4 px-3 py-2 d-flex align-center"
            style="background-color: #2a2a2a; border-radius: 8px"
          >
            <span class="text-truncate" style="color: #facc15; max-width: 100%">
              {{ shareUrl }}
            </span>
            <v-spacer />
            <v-btn icon @click="copyLink" size="small">
              <v-icon icon="mdi-content-copy" />
            </v-btn>
          </v-card>

          <v-btn
            icon
            class="position-absolute"
            style="top: 8px; right: 8px"
            @click="shareDialog = false"
          >
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>


<script>
import {
  Search,
  Search1,
  urlImage,
  urlImage1,
  PostMoviesFavorite,
} from "@/model/api";
import FilterMovie from "@/pages/FilterMovie.vue";
//import {  toggleFavorite } from "@/utils/favorite";
export default {
  name: "SearchMovie",
  data() {
    return {
      movies: [],
      loading: true,
      urlImage: urlImage,
      urlImage1: urlImage1,
      currentPage: 1,
      moviesPerPage: 20,
      totalMovies: 100,
      valueRate: 5,
      path: "",
      loadingMore: false,
      isLastPage: false,
      observer: null,
      observerInited: false,
      link: "",
      shareDialog: false,
      shareUrl: "",
      movieFavorite: {
        IDAccount:
          this.$store.state.empInfor.ID || localStorage.getItem("name"),
        IDMovies: "",
        slug: "",
        currentPage: "",
        UrlMovies: "",
        origin_name: "",
        name: "",
        year: "",
        lang: "",
      },
      filters: {
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
  watch: {
    "$route.query.keyword": {
      immediate: true,
      async handler(query) {
        document.title = `${this.$t("Kết quả tìm kiếm: ")} ${query}`;
        this.loading = true;
        this.path = query;
        this.currentPage = 1;
        this.observerInited = false;
        await this.SearchMovie1(query);
      },
    },
    movies() {
      if (!this.observerInited) {
        this.$nextTick(() => {
          this.initObserver();
        });
      }
    },
  },
  methods: {
    onFilterChanged(newFilters) {
      this.filters = { ...newFilters };
      this.currentPage = 1;
      this.observerInited = false;
      this.SearchMovie1(this.path);
    },
    SearchMovie(query) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.loading = false;
          alert(this.$t("⏳ Hết thời gian chờ. Vui lòng thử lại!"));
          reject(new Error("Timeout"));
        }, 120000);
        Search(
          { keyword: query },
          (result) => {
            clearTimeout(timer);
            if (result.status == "success" || result.status == true) {
              this.link = "";
              if (result.data.items.length != 0 && result.data.items != null) {
                this.movies = result.data.items.sort((a, b) => {
                  return parseInt(b.year) - parseInt(a.year); // Sắp xếp giảm dần theo năm
                });
                if (result.data.seoOnPage) {
                  this.updateMetaTags(result.data.seoOnPage);
                }
                this.loading = false;
                this.isLastPage = true;
                resolve(true);
              } else {
                this.movies = [];
                this.loading = false;
                this.isLastPage = true;
              }
            } else {
              this.loading = false;
              reject(result);
            }
          },
          (err) => {
            clearTimeout(timer);
            this.loading = false;
            console.log(err);
            reject(err);
          }
        );
      });
    },
    SearchMovie1(query, isLoadMore = false) {
      if (isLoadMore) {
        this.loadingMore = true;
      } else {
        this.loading = true;
        this.movies = [];
        this.isLastPage = false;
      }
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.loading = false;
          this.loadingMore = false;
          alert(this.$t("⏳ Hết thời gian chờ . Vui lòng thử lại!"));
          reject(new Error("Timeout"));
        }, 120000);
        Search1(
          {
            keyword: query,
            page: this.currentPage,
            limit: 20,
            sort_field: this.filters.sortOption,
            sort_lang: this.filters.lang,
            category: this.filters.category,
            country: this.filters.country,
            year: this.filters.year,
          },
          (result) => {
            clearTimeout(timer);
            if (result.status == "success" || result.status == true) {
              if (result.data.items != null && result.data.items.length != 0) {
                this.link = "link1";
                const sortedItems = result.data.items.sort((a, b) => {
                  return parseInt(b.year) - parseInt(a.year);
                });

                if (isLoadMore) {
                  this.movies = [...this.movies, ...sortedItems];
                } else {
                  this.movies = sortedItems;
                }

                if (result.data.items.length < this.moviesPerPage) {
                  this.isLastPage = true;
                }

                if (result.data.seoOnPage) {
                  this.updateMetaTags(result.data.seoOnPage);
                }
                this.loading = false;
                this.loadingMore = false;
                resolve(true);
              } else {
                if (!isLoadMore) {
                  this.loading = true;
                  this.link = "";
                  this.SearchMovie(query).then(resolve).catch(reject);
                } else {
                  this.isLastPage = true;
                  this.loadingMore = false;
                  resolve(true);
                }
              }
            } else {
              if (!isLoadMore) {
                this.link = "";
                this.loading = true;
                this.SearchMovie(query).then(resolve).catch(reject);
              } else {
                this.loadingMore = false;
                reject();
              }
            }
          },
          (err) => {
            console.log(err);
            clearTimeout(timer);
            if (!isLoadMore) {
              this.link = "";
              this.SearchMovie(query).then(resolve).catch(reject);
            } else {
              this.loadingMore = false;
              reject(err);
            }
          }
        );
      });
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
          this.SearchMovie1(this.path, true);
        }
      });

      this.observer.observe(this.$refs.loadMoreTrigger);
    },
    shareMovie(movie) {
      const domain = window.location.origin;
      this.shareUrl = `${domain}/movie/${movie.slug}`;
      this.shareDialog = true;
    },
    shareTo(platform) {
      // const url = encodeURIComponent(shareUrl.value);
      // const text = encodeURIComponent("Xem phim này nè!");
      let shareLink = "";

      switch (platform) {
        case "facebook":
          shareLink = `https://www.facebook.com/sharer/sharer.php`;
          break;
        case "youtube":
          shareLink = `https://www.youtube.com/`;
          break;
        case "twitter":
          shareLink = `https://twitter.com`;
          break;
        case "tiktok":
          shareLink = `https://www.tiktok.com/`;
          break;
      }
      // const shareUrl = window.location.href;

      window.open(shareLink, "_blank");
    },

    handleFavorite(movie) {
      this.movieFavorite.IDMovies = movie._id;
      this.movieFavorite.slug = movie.slug;
      this.movieFavorite.currentPage = movie.episode_current;
      if (this.link == "") {
        this.movieFavorite.UrlMovies =
          "https://img.ophim.live/uploads/movies/" + movie.thumb_url;
      } else {
        this.movieFavorite.UrlMovies =
          "https://phimimg.com/" + movie.poster_url;
      }
      this.movieFavorite.origin_name = movie.origin_name;
      this.movieFavorite.name = movie.name;
      this.movieFavorite.year = movie.year;
      this.movieFavorite.lang = movie.lang;
      PostMoviesFavorite(
        this.movieFavorite,
        (dat) => {
          if (dat.data.status == "success") {
            alert("🎬 " + dat.data.message);
          } else {
            alert(dat.data.message);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },

    toggleFavorite(movie) {
      const index = this.favoriteMovies.findIndex(
        (fav) => fav._id === movie.id
      );
      if (index !== -1) {
        this.favoriteMovies.splice(index, 1); // Bỏ yêu thích
      } else {
        this.favoriteMovies.push(movie); // Thêm yêu thích
      }
    },
    copyLink() {
      navigator.clipboard.writeText(this.shareUrl).then(() => {
        alert(this.$t("Đã sao chép liên kết!"));
      });
    },

    getOptimizedImage(imagePath) {
      if (this.link == "") {
        return `${this.urlImage + encodeURIComponent(imagePath)}`;
      } else {
        return `${
          this.urlImage1 +
          "https://phimimg.com/" +
          encodeURIComponent(imagePath)
        }`;
      }
    },
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
  width: 100%;
  height: auto;
  object-fit: contain;
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
.movie-title {
  font-size: 14px;
}
.favorite-btn {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
}
.favorite-btn {
  /* position: relative; */
  z-index: 4;
}
@media (max-width: 600px) {
  .action-buttons {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding-bottom: 10px;
    scrollbar-width: thin; /* Firefox */
  }

  .action-buttons::-webkit-scrollbar {
    height: 6px;
  }
}
.movie-grid {
  row-gap: 20px;
}

.movie-card {
  border-radius: 18px;
  overflow: hidden;
  background: #14151c;
  transition: all 0.4s ease;
  position: relative;
  text-align: left;
}

.movie-card:hover {
  transform: scale(1.05);
  z-index: 10;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9);
}

/* poster */
.poster-wrapper {
  position: relative;
}

/* gradient */
.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95), transparent 60%);
}

/* hover */
.hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: 0.3s;
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
  background: rgba(0, 0, 0, 0.7);
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
  background: rgba(0, 0, 0, 0.7);
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
  color: white;
}

.movie-sub {
  font-size: 12px;
  opacity: 0.7;
  color: white;
}

/* meta */
.meta-row {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
  display: flex;
  gap: 5px;
  color: white;
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
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
.movie-link {
  text-decoration: none;
}
.load-more-trigger {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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
.movie-title{
  font-size: 14px;
  
}
.favorite-btn {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
}
.favorite-btn {
  /* position: relative; */
  z-index: 4;
}
@media (max-width: 600px) {
  .action-buttons {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding-bottom: 10px;
    scrollbar-width: thin; /* Firefox */
  }

  .action-buttons::-webkit-scrollbar {
    height: 6px;
  }
}
.movie-grid {
  row-gap: 20px;
}

.movie-card {
  border-radius: 18px;
  overflow: hidden;
  background: #14151c;
  transition: all 0.4s ease;
  position: relative;
  text-align: left;
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
  color: white;
}

.movie-sub {
  font-size: 12px;
  opacity: 0.7;
  color: white;
}

/* meta */
.meta-row {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
  display: flex;
  gap: 5px;
  color: white;
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
  color: white;
}
.movie-link {
  text-decoration: none;
}
.load-more-trigger {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.movie-list-card {
  background-color: #14151c !important;
  border-radius: 12px;
  transition: transform 0.25s ease, box-shadow 0.3s ease;
}
.movie-list-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
}
.text-none {
  text-transform: none !important;
}
</style>

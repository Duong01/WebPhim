<template>
  <v-container class="search-page" fluid>
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <h2 class="text-center">
          Tìm Kiếm Phim Hấp Dẫn - {{ $t("Kết quả tìm kiếm cho") }} "{{ $route.query.keyword }}"
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
                        <div class="zc-shimmer fill-height"></div>
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
                      color="grey-darken-5"
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
            cols="12"
            sm="4"
            md="3"
            lg="3"
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
                      <div class="zc-shimmer fill-height"></div>
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
      domain:'',
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
        poster_url:'',
        time: '',
        quality: '',
        vote_average: ''
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
        window.scrollTo({ top: 0, behavior: "smooth" });
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
              this.domain = result.data.APP_DOMAIN_CDN_IMAGE;
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
                this.domain = result.data.APP_DOMAIN_CDN_IMAGE;
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
      this.movieFavorite.poster_url = movie.poster_url
      this.movieFavorite.time = movie.time
      this.movieFavorite.quality = movie.quality
      this.movieFavorite.vote_average = movie.tmdb.vote_average
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
      if (this.domain.includes("img.ophim")) {
        if(imagePath.includes("https")){
          return imagePath;
        }
        return `${this.urlImage + encodeURIComponent(imagePath)}`;
      } else {
        if(imagePath.includes("https")){
          return imagePath;
        }
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
  padding: 3rem 1rem;
  color: var(--zc-text, #f4f5f9);
}

/* ===== LIST CARD (few results) ===== */
.movie-list-card {
  background: linear-gradient(160deg, #191926, #12121c) !important;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.3s ease;
}

.movie-list-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 183, 0, 0.3);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 140, 0, 0.1);
}

.overflow-hidden {
  background: transparent;
  color: #f4f5f9;
}

.movie-image {
  border-radius: 12px 0 0 12px;
  transition: opacity 0.5s ease;
}

.genre-section {
  flex-wrap: wrap;
}

.genre-section .v-chip {
  background-color: rgba(255, 255, 255, 0.07) !important;
  color: #f4f5f9;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.meta-info {
  font-size: 0.95rem;
}

.meta-info .v-icon {
  vertical-align: middle;
}

.description-text {
  font-size: 0.95rem;
  line-height: 1.6;
  -webkit-line-clamp: 4;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1rem;
}

/* ===== GRID CARD ===== */
.movie-grid {
  row-gap: 20px;
}

.movie-card {
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(160deg, #191926, #12121c);
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  text-align: left;
}

.movie-card:hover {
  transform: translateY(-6px) scale(1.02);
  z-index: 10;
  border-color: rgba(255, 183, 0, 0.3);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.7), 0 0 24px rgba(255, 140, 0, 0.12);
}

.poster-wrapper {
  position: relative;
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(7, 7, 12, 0.95), transparent 60%);
}

.hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(7, 7, 12, 0.55);
  opacity: 0;
  transition: 0.3s;
}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

.hover-overlay .v-icon {
  color: #ffb700;
  filter: drop-shadow(0 0 14px rgba(255, 183, 0, 0.55));
}

/* badges */
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
  font-weight: 600;
  background: rgba(10, 10, 18, 0.75);
  backdrop-filter: blur(6px);
}

.badge.quality {
  background: linear-gradient(135deg, #ffb700, #ff5e00);
  color: #0a0a12;
}

.badge.lang {
  background: rgba(10, 10, 18, 0.75);
  color: #ffcc4d;
  border: 1px solid rgba(255, 183, 0, 0.35);
}

.episode-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: linear-gradient(135deg, #ffb700, #ff5e00);
  color: #0a0a12;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
}

.rating {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(10, 10, 18, 0.75);
  backdrop-filter: blur(6px);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  color: #ffcc4d;
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
  color: #f4f5f9;
  transition: color 0.25s ease;
}

.movie-card:hover .movie-title {
  color: #ffb700;
}

.movie-sub {
  font-size: 12px;
  opacity: 0.7;
  color: #c6c9d4;
}

.meta-row {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
  display: flex;
  gap: 5px;
  color: #c6c9d4;
}

.genre-list {
  margin-top: 6px;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.genre-item {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #c6c9d4;
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

/* buttons */
.v-btn {
  font-weight: 600;
  text-transform: none;
  border-radius: 10px;
  transition: all 0.25s ease;
}

.v-btn:hover {
  transform: translateY(-1px);
}

/* share dialog */
.v-dialog .v-card {
  background: linear-gradient(160deg, #191926, #12121c) !important;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px !important;
  color: #f4f5f9;
}

@media (max-width: 600px) {
  .action-buttons {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding-bottom: 10px;
    scrollbar-width: thin;
  }

  .action-buttons::-webkit-scrollbar {
    height: 6px;
  }
}
</style>

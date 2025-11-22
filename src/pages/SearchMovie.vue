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
        <v-row
                no-gutters
                tag="transition-group"
                name="fade-scale"
                class="movie-list"
                v-if="movies.length >=5"
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
                        :src="getOptimizedImage(movie.thumb_url)"
                        :lazy-src="getOptimizedImage(movie.thumb_url)"
                        :alt="movie.name"
                        spect-ratio="16/9"
                        class="movie-image"
                        transition="fade-transition"
                        height="250"
                        width="100%"
                        cover
                      >
                        <template #default>
                          <v-btn
                          icon
                          size="small"
                          variant="flat"
                          class="favorite-btn"
                          @click.stop.prevent="handleFavorite(movie)"
                          :color="isFavoriteMovie(movie) ? 'red' : ''"
                        >
                      
                          <v-icon>
                            {{ isFavoriteMovie(movie)
                                  ? "mdi-heart"
                                  : "mdi-heart-outline" }}
                          </v-icon>
                          
                        </v-btn>

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
                          movie.lang + " - " + movie.episode_current
                        }}
                      </v-card-subtitle>

                      <v-card-title class="movie-title text-body-2 text-wrap">{{
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
        <router-link
          v-else
          v-for="movie in movies"
          :key="movie.id"
          :to="{ name: 'MovieDetail', params: { slug: movie.slug } }"
          class="text-decoration-none"
        >
          <v-card class="mb-5 overflow-hidden movie-car" elevation="4" hover>
            <v-row>
              <v-col cols="12" md="4">
                <v-img
                  :src="getOptimizedImage(movie.thumb_url)"
                  :lazy-src="getOptimizedImage(movie.thumb_url)"
                  :alt="movie.name"
                  spect-ratio="16/9"
                  class="movie-image"
                  width="100%"
                  eight="300"
                  transition="fade-transition"
                  cover
                >
                <template #default>
                  <v-card-subtitle class="text-left" style="margin-top: 5px;color: white;">
                  {{
                    movie.lang + " - " + movie.episode_current
                  }}
                </v-card-subtitle>
                </template>
                </v-img>
              </v-col>
              <v-col cols="12" md="8" class="pa-4">
                
                 <h3 class="text-left">{{ movie.name }} </h3>
                <!--<h5 class="text-left">{{movie.lang + " - " + movie.episode_current}}</h5> -->
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
                  {{ $t("Miêu tả") }}:  
                  <span v-html="movie.origin_name"></span>
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
                    @click.stop.prevent="shareMovie(movie)"
                    variant="outlined"
                    prepend-icon="mdi-share-variant"
                  >
                    {{ $t("Chia sẻ") }}
                  </v-btn>
                  <v-btn
                    @click.stop.prevent="handleFavorite(movie)"
                    variant="outlined"
                    prepend-icon="mdi-bookmark"
                  >
                    {{ $t("Xem sau") }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </router-link>

        <v-pagination
          v-model="currentPage"
          :length="Math.ceil(totalMovies / moviesPerPage)"
          class="my-4 justify-center"
        />
      </v-col>

      <!-- dialog share -->
      <v-dialog v-model="shareDialog" max-width="500">
        <v-card class="pa-4" style="background-color: #1e1e1e; color: white">
          <v-card-title class="text-h6 justify-center">{{$t('Chia sẻ')}}</v-card-title>

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
import { Search, Search1, urlImage, urlImage1 } from "@/model/api";
import {  toggleFavorite,getFavorites } from "@/utils/favorite";
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
      link: "",
      shareDialog: false,
      shareUrl: ""
    };
  },
  watch: {
    "$route.query.keyword": {
      immediate: true,
      async handler(query) {
        document.title = `${this.$t("Kết quả tìm kiếm: ")} ${query}`;
        this.loading = true;
        this.path = query;

        await this.SearchMovie1(query);
      },
    },
    async currentPage(newpage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loading = true;
      this.currentPage = newpage;
      await this.SearchMovie1(this.path);
    },
  },
  methods: {
    SearchMovie(query) {
      return new Promise((resolve,reject) => {
        const timer = setTimeout(() => {
        this.loading = false;
        alert(this.$t("⏳ Hết thời gian chờ. Vui lòng thử lại!"));
        reject(new Error("Timeout"));
      }, 120000);
        Search(
          { keyword: query, page: this.currentPage },
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
                resolve(true)
                
              } else {
                this.movies = [];
              this.loading = false;

                // this.link = "link1";
                // this.SearchMovie1(query)
                // .then(resolve)
                // .catch(reject);
              }
            } 
            // else {
            //   this.link = "link1";
            //   this.SearchMovie1(query)
            //   .then(resolve)
            //   .catch(reject);
            //   resolve(true)
            // }
            reject(result)
          },
          (err) => {
            clearTimeout(timer);
          console.log(err);
            // console.log(err);
            // clearTimeout(timer);
            // this.link = "link1";
            // this.SearchMovie1(query)
            // .then(resolve)
            // .catch(reject);
            
          }
        );
      });
    },
    SearchMovie1(query) {
      return new Promise((resolve, reject) =>{
        const timer = setTimeout(() => {
        this.loading = false;
        alert(this.$t("⏳ Hết thời gian chờ . Vui lòng thử lại!"));
        reject(new Error("Timeout"));
      }, 120000);
          Search1(
        { keyword: query, page: this.currentPage, limit: 20 },
        (result) => {
          
          clearTimeout(timer);
          if (result.status == "success" || result.status == true) {
            if ( result.data.items != null && result.data.items.length != 0) {
              console.log(result)
              this.link = "link1"
                this.movies = result.data.items.sort((a, b) => {
                return parseInt(b.year) - parseInt(a.year); // Sắp xếp giảm dần theo năm
              });
              if (result.data.seoOnPage) {
                this.updateMetaTags(result.data.seoOnPage);
              }
              this.loading = false;
              resolve(true)
              
              
            } else {
              // this.movies = [];
              // this.loading = false;
              this.loading = true
              this.link = "";
              this.SearchMovie(query)
              .then(resolve)
              .catch(reject);
              resolve(true)
            }
          }
          else{
            this.link = "";
            this.loading = true
                this.SearchMovie(query)
                .then(resolve)
                .catch(reject);
          }
          reject()
        },
        (err) => {
          // clearTimeout(timer);
          // console.log(err);
          console.log(err);
            clearTimeout(timer);
            this.link = "";
            this.SearchMovie(query)
            .then(resolve)
            .catch(reject);
        }
      );
      })
      
    },

    shareMovie(movie) {
      const domain = window.location.origin;
      this.shareUrl = `${domain}/movie/${movie.slug}` 
      this.shareDialog = true;
    },

    handleFavorite(movie){
      console.log(movie)
      // this.movie.thumb_url = movie.thumb_url
      toggleFavorite(movie);
      // this.liked = !this.liked;
    },

    isFavoriteMovie(movie) {
      const favorites = getFavorites();
      return favorites.some(f => f._id === movie._id || f._id === movie.idMovie);
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
        return `${this.urlImage + encodeURIComponent(imagePath)}&w=384&q=100`;
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
</style>

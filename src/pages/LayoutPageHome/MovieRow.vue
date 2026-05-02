<template>
  <div class="movie-row">
    <div class="row-wrapper">
      <!-- LEFT -->
      <v-btn
        v-show="showLeft"
        icon
        class="arrow arrow-left"
        @click="scrollLeft"
      >
        <v-icon size="28">mdi-chevron-left</v-icon>
      </v-btn>
      <!-- SLIDER -->
      <div class="movie-scroll" ref="scroll" @scroll="checkScroll">
        <!-- SKELETON -->
        <template v-if="loading">
          <div
            v-for="i in skeletonCount"
            :key="i"
            class="movie-card"
          >
            <div class="skeleton"></div>
          </div>
        </template>
        <template v-else-if="movies.length === 0">
          <div
            v-for="i in skeletonCount"
            :key="i"
            class="movie-card"
          >
            <v-img
              class="mx-auto"
              :src="imageError"
            ></v-img>
          </div>
        </template>

        <template v-else>

          <div v-for="(movie, key) in movies" :key="key" class="movie-card">
            <div class="card-inner">
              <router-link
                :to="{ name: 'Movies', params: { slug: movie.slug } }"
                class="movie-link"
              >
                <v-img
                  :src="movie.thumb_url"
                  height="200"
                  aspect-ratio="2/3"
                  cover
                  class="poster"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate />
                    </div>
                  </template>

                  <!-- BADGES -->
                  <div class="badges">
                    <span class="badge quality">
                      {{ movie.quality || "HD" }}
                    </span>

                    <span class="badge lang">
                      {{ movie.lang || "Vietsub" }}
                    </span>
                  </div>

                  <!-- EPISODE -->
                  <div class="episode">
                    <v-icon size="14">mdi-play-circle</v-icon>
                    {{ movie.episode_current || "Full" }}
                  </div>
                </v-img>
                <!-- TITLE BELOW IMAGE -->
                <div class="movie-title">
                  {{ movie.name }}
                </div>

                <div class="movie-meta">
                  ⭐ {{ movie.rating || 8.5 }} • {{ movie.year }}
                </div>

                <!-- HOVER INFO -->
                <div class="hover-overlay">
                  <div class="info">
                    <div class="actions">
                      <v-btn icon size="small">
                        <v-icon>mdi-play</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        @click.stop.prevent="handleFavorite(movie)"
                      >
                        <v-icon :color="indexClick % 2 === 0 ? 'red' : 'white'">
                          {{
                            indexClick % 2 === 0
                              ? "mdi-heart"
                              : "mdi-heart-outline"
                          }}
                        </v-icon>
                      </v-btn>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </template>
        
      </div>

      <!-- RIGHT -->
      <v-btn
        v-show="showRight"
        icon
        class="arrow arrow-right"
        @click="scrollRight"
      >
        <v-icon size="28">mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { urlImage1, CheckSession, PostMoviesFavorite } from "@/model/api";
import imageError from "@/assets/imgLoading.gif";
export default {
  props: ["movies", "loading"],

  data() {
    return {
      imageError: imageError,
      urlImage1,
      indexClick: 1,
      showLeft: false,
      showRight: true,
      skeletonCount: 8,
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
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.checkScroll();
      window.addEventListener("resize", this.checkScroll);
    });
  },

  methods: {
    getImage(path){

      if(!path) return ""

      if(path.includes("http"))
        return path

      return this.urlImage1 +
        "https://phimimg.com/" +
        path

    },

    scrollLeft() {
      const el = this.$refs.scroll;

      el.scrollBy({
        left: -el.clientWidth * 0.9,
        behavior: "smooth",
      });
    },

    scrollRight() {
      const el = this.$refs.scroll;

      el.scrollBy({
        left: el.clientWidth * 0.9,
        behavior: "smooth",
      });
    },

    checkScroll() {
      const el = this.$refs.scroll;
      if (!el) return;

      this.showLeft = el.scrollLeft > 5;

      this.showRight = el.scrollWidth > el.clientWidth + el.scrollLeft + 5;
    },
    handleFavorite(movie) {
      this.indexClick++;
      this.movieFavorite.IDMovies = movie._id;
      this.movieFavorite.slug = movie.slug;
      this.movieFavorite.currentPage = movie.page;
      if (movie.thumb_url.includes("img.ophim.live")) {
        this.movieFavorite.UrlMovies = movie.thumb_url;
      } else {
        if (movie.thumb_url.includes("https://phimimg.com/upload")) {
          this.movieFavorite.UrlMovies = this.urlImage1 + movie.thumb_url;
        } else {
          this.movieFavorite.UrlMovies =
            this.urlImage1 + "https://phimimg.com/" + movie.thumb_url;
        }
      }
      this.movieFavorite.origin_name = movie.origin_name;
      this.movieFavorite.name = movie.name;
      this.movieFavorite.year = movie.year;
      this.movieFavorite.lang = movie.lang;
      this.movieFavorite.poster_url = movie.poster_url
      this.movieFavorite.time = movie.time
      this.movieFavorite.quality = movie.quality
      this.movieFavorite.vote_average = movie.tmdb.vote_average
      const token = localStorage.getItem("token");
      if (token) {
        CheckSession(
          (dat) => {
            if (dat.data.status == "success") {
              this.$store.commit("setEmpInfor", dat.data.data);
              this.$store.commit("setAvatar", dat.data.data.Avatar);
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
                },
              );
            } else {
              alert(dat.data.message);
              // this.$router.push({
              //   path: "/login",
              //   query: { redirect: this.$route.fullPath },
              // });
            }
          },
          (err) => {
            alert(err);
          },
        );
      } else {
        alert(this.$t("Vui lòng đăng nhập để sử dụng chức năng này"));
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
      }
    },
  },
};
</script>

<style scoped>
.movie-row {
  position: relative;
}

/* WRAPPER */

.row-wrapper {
  position: relative;

  overflow: visible;
}

/* SCROLL */

.movie-scroll {
  display: flex;

  gap: 18px;

  overflow-x: auto;

  padding: 10px 20px;

  scroll-behavior: smooth;

  scrollbar-width: none;
}

.movie-scroll::-webkit-scrollbar {
  display: none;
}

/* CARD */

.movie-card {
  flex: 0 0 auto;

  width: 260px;
  position: relative;
}

.card-inner {
  position: relative;
  border-radius: 12px;

  overflow: visible;

  transition: 0.35s;
}

.movie-card:hover {
  z-index: 20;
}

.movie-card:hover .card-inner {
  transform: scale(1.15) translateY(-10px);
}

/* POSTER */

.poster {
  border-radius: 12px;

  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
}

/* HOVER */

.hover-overlay {
  position: absolute;

  inset: 0;

  display: flex;

  align-items: flex-end;

  padding: 12px;

  border-radius: 12px;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95),
    rgba(0, 0, 0, 0.5),
    transparent
  );

  opacity: 0;

  transition: 0.3s;
}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

/* TEXT */

.title {
  font-size: 15px;

  font-weight: 600;
}

.meta {
  font-size: 12px;

  opacity: 0.8;
}

.genres {
  font-size: 11px;

  opacity: 0.7;
}

/* ACTION */

.actions {
  display: flex;

  gap: 6px;

  margin-top: 6px;
}

.actions button {
  width: 32px;
  height: 32px;

  background: rgba(0, 0, 0, 0.6);

  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* BADGES */

.badges {
  position: absolute;

  top: 8px;
  left: 8px;

  display: flex;

  gap: 6px;
}

.badge {
  font-size: 11px;

  padding: 3px 6px;

  border-radius: 6px;
}

.quality {
  background: #ff3d00;
  color: white;
}

.lang {
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

/* EPISODE */

.episode {
  position: absolute;

  bottom: 8px;
  right: 8px;

  font-size: 12px;

  background: rgba(0, 0, 0, 0.6);

  padding: 4px 8px;

  border-radius: 6px;

  display: flex;
  align-items: center;
  gap: 4px;
}

/* ARROWS */

.arrow {
  position: absolute;

  top: 40%;

  width: 50px;
  height: 50px;

  background: rgba(0, 0, 0, 0.75);

  color: white;

  border-radius: 50%;

  z-index: 30;
}

.arrow-left {
  left: 0;
}

.arrow-right {
  right: 0;
}

/* MOBILE */

@media (max-width: 600px) {
  .movie-card {
    width: 150px;
  }

  .arrow {
    display: none;
  }
}
.movie-title {
  font-size: 14px;

  font-weight: 600;

  margin-top: 6px;

  line-height: 1.3;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;
}

.movie-meta {
  font-size: 12px;

  opacity: 0.75;

  margin-top: 2px;
}
@media (max-width: 768px) {
  .hover-overlay {
    display: none;
  }
}
.movie-link {
  text-decoration: none;
  color: inherit;
}
</style>

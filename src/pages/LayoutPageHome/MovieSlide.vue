<template>
  <div class="hero">
    <div v-if="!imageLoaded" class="hero-skeleton"></div>

    <!-- IMAGE -->
    <transition name="fade" mode="out-in">
      <img
        v-show="imageLoaded"
        :src="currentImage"
        class="hero-bg"
        @load="imageLoaded = true"
      />
    </transition>
    <!-- CONTENT -->
    <div class="hero-content">
      <div class="left">
        <h1 class="title">{{ currentMovie.name }}</h1>

        <div class="meta">
          <span class="badge">{{ currentMovie.year }}</span>
          <span class="badge">HD Vietsub</span>
        </div>

        <p class="desc">{{ currentMovie.content?.slice(0, 150) }}...</p>

        <div class="actions" v-if="currentMovie">
          <v-btn class="btn-play" @click="goDetail(currentMovie)">
            ▶ {{$t('Xem Ngay')}}
          </v-btn>

          <div class="icon-group">
            <button class="btn-icon" @click="handleFavorite(currentMovie)">
              <v-icon :color="indexClick % 2 === 0 ? 'red' : 'white'">
                {{ indexClick % 2 === 0 ? "mdi-heart" : "mdi-heart-outline" }}
              </v-icon>
            </button>

            <button class="btn-icon" @click="shareMovie()">
              <v-icon>mdi-share-variant</v-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- THUMBNAILS -->
      <div class="thumbs">
        <div
          v-for="(movie, index) in movies"
          :key="movie.slug"
          class="thumb"
          :class="{ active: index === activeIndex }"
          @click="setMovie(index)"
        >
          <img :src="movie.thumb_url" />
        </div>
      </div>
    </div>

    <!-- Dialog share -->
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
            <v-btn icon size="large" @click="copyLink" class="bg-grey-darken-4">
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
  </div>
</template>
<script>
import { urlImage1, CheckSession, PostMoviesFavorite } from "@/model/api";

export default {
  props: ["movies", "loading"],

  data() {
    return {
      urlImage1,
      activeIndex: 0,
      imageLoaded: false,
      slider: null,
      shareDialog: false,
      indexClick: 1,
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
    this.startSlider();
  },

  beforeUnmount() {
    clearInterval(this.slider);
  },
  watch: {
    activeIndex() {
      this.imageLoaded = false;
    },
  },

  computed: {
    currentMovie() {
      return this.movies?.[this.activeIndex] || {};
    },

    currentImage() {
      if (!this.currentMovie.thumb_url) return "";

      if (this.currentMovie.thumb_url.includes("http"))
        return this.currentMovie.thumb_url;

      return (
        this.urlImage1 + "https://phimimg.com/" + this.currentMovie.thumb_url
      );
    },
  },

  methods: {
    getImage(path) {
      if (path?.includes("http")) return path;
      return this.urlImage1 + "https://phimimg.com/" + path;
    },
    startSlider() {
      this.slider = setInterval(() => {
        if (!this.movies?.length) return;

        this.activeIndex++;

        if (this.activeIndex >= this.movies.length) {
          this.activeIndex = 0;
        }
      }, 5000);
    },
    goDetail(movie) {
      this.$router.push({
        name: "Movies",
        params: { slug: movie.slug },
      });
    },
    setMovie(index) {
      this.activeIndex = index;
      clearInterval(this.slider);
      this.startSlider();
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
                }
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
          }
        );
      } else {
        alert(this.$t("Vui lòng đăng nhập để sử dụng chức năng này"));
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
      }
    },
    shareMovie() {
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
  },
};
</script>
<style scoped>
.hero {
  position: relative;
  height: 520px;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--zc-shadow-lg);
}

/* BACKGROUND */

.hero-bg {
  position: absolute;
  inset: 0;

  background-size: cover;
  background-position: center;

  filter: brightness(0.72);

  width: 100%;
  height: 100%;

  object-fit: cover;
}

/* GRADIENT */

.hero::before {
  content: "";
  position: absolute;
  inset: 0;

  background: linear-gradient(
    90deg,
    rgba(7, 7, 12, 0.96) 0%,
    rgba(7, 7, 12, 0.82) 30%,
    rgba(7, 7, 12, 0.25) 60%,
    transparent 100%
  );
}

/* CONTENT */

.hero-content {
  position: relative;

  display: flex;
  flex-direction: column;

  justify-content: center;

  height: 100%;

  padding: 60px;

  z-index: 2;
}

/* LEFT */

.left {
  max-width: 500px;
}

.title {
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  font-family: "Montserrat", sans-serif;
  color: white;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.7);
  line-height: 1.2;
}

.meta {
  margin: 12px 0;
}

.badge {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(8px);
  padding: 6px 12px;
  border-radius: 8px;
  margin-right: 6px;
  font-size: 13px;
  font-weight: 600;
}

.desc {
  color: #c9cbd4;
  margin-top: 10px;
  line-height: 1.55;
}

/* BUTTONS */

.actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
}

.btn-play {
  background: var(--zc-grad);
  color: #0a0a12;

  border: none;

  border-radius: 999px;

  font-weight: 800;

  cursor: pointer;

  padding: 12px 34px;

  box-shadow: 0 8px 26px rgba(255, 140, 0, 0.4);

  transition: transform 0.3s var(--zc-ease), box-shadow 0.3s ease;
}

.btn-play:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 34px rgba(255, 140, 0, 0.55);
}

.icon-group {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-icon {
  width: 42px;
  height: 42px;

  border-radius: 50%;

  border: 1px solid rgba(255, 255, 255, 0.3);

  background: rgba(0, 0, 0, 0.45);

  backdrop-filter: blur(8px);

  color: white;

  cursor: pointer;

  transition: all 0.3s var(--zc-ease);
}

.btn-icon:hover {
  background: rgba(255, 183, 0, 0.2);
  border-color: rgba(255, 183, 0, 0.6);
  transform: translateY(-2px) scale(1.05);
}

/* THUMBNAILS */

.thumbs {
  position: absolute;

  bottom: 20px;
  right: 30px;

  display: flex;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;

  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.thumbs::-webkit-scrollbar {
  display: none;
}
.thumbs {
  scrollbar-width: none;
}
.thumb {
  flex: 0 0 auto;
  width: 60px;
  height: 90px;

  border-radius: 10px;

  overflow: hidden;

  cursor: pointer;

  opacity: 0.6;
  scroll-snap-align: start;
  transition: all 0.3s var(--zc-ease);
  border: 2px solid transparent;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb:hover {
  opacity: 0.9;
}

.thumb.active {
  border: 2px solid #ffb700;
  opacity: 1;
  transform: scale(1.1);
  box-shadow: 0 0 16px rgba(255, 183, 0, 0.5);
}

.hero-skeleton {
  position: absolute;
  inset: 0;

  background: linear-gradient(110deg, #16161f 25%, #23232f 37%, #16161f 63%);

  background-size: 400% 100%;

  animation: skeleton 1.2s infinite;
}

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.hero-bg {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  filter: brightness(0.72);

  transition: opacity 0.8s ease;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* MOBILE */
@media (max-width: 600px) {
  .hero {
    height: 420px;
    border-radius: 16px;
  }

  .hero-content {
    padding: 24px;
  }

  .thumbs {
    right: 12px;
    bottom: 12px;
  }
}
</style>

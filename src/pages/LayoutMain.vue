<template>
  <v-container class="search-page" fluid>
    <v-row v-if="$vuetify.display.mdAndDown" class="movie-list">
      <v-col
        v-for="movie in movies"
        :key="movie.slug"
        cols="12"
        sm="6"
        md="6"
        lg="6"
        xl="6"
      >
        <v-card class="movie-item" flat>
          <v-row no-gutters>
            <!-- POSTER LEFT -->
            <v-col cols="4" class="poster-col">
              <div class="poster-wrapper">
                <v-img
                  :src="getOptimizedImage(movie.poster_url)"
                  height="170"
                  cover
                  hover
                  class="poster-img"
                  @click="gomovie(movie)"
                />

                <!-- TAG -->
                <!-- <div class="tag-new" v-if="getNextEpisode(movie).includes('Tập')">
              Sắp ra
            </div>-->
            <div class="tag-new-comp">
              {{movie.quality}}
            </div> 
              </div>
            </v-col>

            <!-- CONTENT RIGHT -->
            <v-col cols="8" class="content-col">
              <!-- TITLE -->
              <div class="movie-title">
                {{ movie.name }}
              </div>

              <!-- EPISODE -->
              <div class="episode-text">{{movie.origin_name}}</div>

              <!-- NEXT EPISODE -->
              <div class="next-ep">
                Tập hiện tại:
                <span class="highlight">{{movie.episode_current}} </span>
              </div>

              <!-- STATUS -->
              <div class="status">
                <span class="time">📅 {{ movie.time }}</span>

                <div class="notify-wrap">
                  
                  <span class="notify-label">{{movie.lang}}</span>
                </div>
              </div>

              <!-- ACTION BUTTONS -->
              <div class="actions">
                <v-btn
                  size="small"
                  color="red"
                  class="btn-watch"
                  @click="gomovie(movie)"
                  prepend-icon="mdi-play-circle"
                >
                  {{ $t('Xem ngay') }}
                </v-btn>
                <v-btn
                  size="small"
                  variant="tonal"
                  color="grey-darken-6"
                  class="btn-outline"
                  prepend-icon="mdi-heart-outline"
                  @click="handleFavorite(movie)"
                >
                  {{$t('Yêu thích')}}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else class="movie-grid">
      <v-col
        v-for="movie in movies"
        :key="movie.slug"
        cols="12"
        sm="6"
        md="4"
        lg="3"
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
  </v-container>
</template>

<script>
import { urlImage1,PostMoviesFavorite,CheckSession } from "@/model/api";
export default {
  name: "PhimBo",
  props: ["movies", "loadingMore"],
  data() {
    return {
      urlImage: urlImage1,
      movieFavorite: {
        IDAccount: this.$store.state.empInfor.ID || localStorage.getItem("name"),
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
  methods: {
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
};
</script>

<style scoped>
.search-page {
  min-height: 100vh;
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
  /* aspect-ratio: 2 / 3; */
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
/* ===== LIST BACKGROUND ===== */
.movie-list {
  background: #0f0f0f;
}

/* ===== CARD ITEM ===== */
.movie-item {
  background: #1a1a1a;
  border-radius: 14px;
  overflow: hidden;
  padding: 10px;
  transition: 0.25s;
}

.movie-item:hover {
  transform: scale(1.01);
  background: #202020;
}

/* ===== POSTER ===== */
.poster-wrapper {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.poster-img {
  border-radius: 10px;
  cursor: pointer;
}

/* TAG "TẬP MỚI" */
.tag-new-comp {
  position: absolute;
  top: 6px;
  left: 6px;
  background: #ff3d00;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}
.tag-new {
  position: absolute;
  top: 6px;
  left: 6px;
  background: #ce9e1b;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}

/* ===== CONTENT ===== */
.content-col {
  padding-left: 10px;
}

/* TITLE */
.movie-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
}

/* EPISODE */
.episode-text {
  font-size: 12px;
  color: #aaa;
}

/* PROGRESS */
.progress-bar {
  margin: 6px 0;
}

/* NEXT EP */
.next-ep {
  font-size: 12px;
  color: #ccc;
}

.highlight {
  color: #ff5252;
  font-weight: 600;
}

/* STATUS ROW */
.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.time {
  font-size: 11px;
  color: #888;
}

/* SWITCH */
.notify {
  transform: scale(0.8);
}

/* ACTIONS */
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 35px;
  gap: 8px;
}

.btn-outline {
  flex: 1;
  font-size: 11px;
}

.btn-watch {
    background: linear-gradient(45deg,#ffd76b,#ffb700) !important;
  color: black !important;
  flex: 1;
  font-size: 11px;
}
.notify-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* TEXT */
.notify-label {
  font-size: 12px;
  color: #ccc;
}

/* SWITCH */
.notify-switch {
  margin: 0;
  transform: scale(0.8);
}
.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

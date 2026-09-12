<template>
  <v-container class="search-page" fluid>
    <v-row v-if="movies.length <= 0" class="movie-list">
      <v-col v-for="n in 12" :key="n" cols="6" sm="6" md="3" lg="3">
        <v-skeleton-loader type="image" class="rounded-lg" />
      </v-col>
    </v-row>
    <v-row v-else-if="$vuetify.display.mdAndDown" class="movie-list">
      <template v-for="(movie, index) in movies" :key="movie.slug">
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
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
                    {{ movie.quality }}
                  </div>
                </div>
              </v-col>

              <!-- CONTENT RIGHT -->
              <v-col cols="8" class="content-col" style="padding: 10px">
                <!-- TITLE -->
                <div class="movie-title">
                  {{ movie.name }}
                </div>

                <!-- EPISODE -->
                <div class="episode-text">{{ movie.origin_name }}</div>

                <!-- NEXT EPISODE -->
                <div class="next-ep right">
                  Tập hiện tại:
                  <span class="highlight">{{ movie.episode_current }} </span>
                </div>

                <!-- STATUS -->
                <div class="status">
                  <span class="time">📅 {{ movie.time }}</span>

                  <div class="notify-wrap">
                    <span class="notify-label">{{ movie.lang }}</span>
                  </div>
                </div>
                <div
                  class="genre-list"
                  v-if="movie.category && movie.category.length"
                >
                  <span
                    v-for="c in movie.category.slice(0, 2) || []"
                    :key="c.id"
                    class="genre-item"
                  >
                    {{ c.name }}
                  </span>
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
                    {{ $t("Xem ngay") }}
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="tonal"
                    color="grey-darken-6"
                    class="btn-outline"
                    prepend-icon="mdi-heart-outline"
                    @click="handleFavorite(movie)"
                  >
                    {{ $t("Yêu thích") }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <div v-if="(index + 1) % 4 === 0" class="home-ad-slot">
          <LazyAd :min-height="90">
            <AdsterraResponsiveBanner />
          </LazyAd>
        </div>
      </template>
    </v-row>

    <v-row v-else class="movie-grid">
      <template v-for="(movie, index) in movies" :key="movie.slug">
        <v-col cols="12" sm="6" md="4" lg="3">
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
                    <div class="zc-shimmer fill-height"></div>
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
                <div class="next-ep right">
                  Tập hiện tại:
                  <span class="highlight">{{ movie.episode_current }} </span>
                </div>

                <!-- META -->
                <div class="status">
                  <span class="time">📅 {{ movie.time }}</span>

                  <div class="notify-wrap">
                    <span class="notify-label">{{ movie.year }}</span>
                  </div>
                </div>

                <!-- GENRE -->

                <div
                  class="genre-list"
                  v-if="movie.category && movie.category.length"
                >
                  <span
                    v-for="c in movie.category.slice(0, 2) || []"
                    :key="c.id"
                    class="genre-item"
                  >
                    {{ c.name }}
                  </span>
                </div>
              </v-card-text>
              <div class="actions">
                <v-btn
                  color="red"
                  class="btn-watch"
                  prepend-icon="mdi-play-circle"
                >
                  {{ $t("Xem ngay") }}
                </v-btn>
                <v-btn
                  variant="tonal"
                  color="grey-darken-6"
                  class="btn-outline"
                  prepend-icon="mdi-heart-outline"
                  @click.prevent.stop="handleFavorite(movie)"
                >
                  {{ $t("Yêu thích") }}
                </v-btn>
              </div>
            </v-card>
          </router-link>
        </v-col>
        <!-- QUẢNG CÁO -->
        
        <div v-if="(index + 1) % 4 === 0" class="home-ad-slot">
        <LazyAd :min-height="90">
          <AdsterraResponsiveBanner />
        </LazyAd>
      </div>
      </template>
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
import { urlImage1, PostMoviesFavorite, CheckSession } from "@/model/api";
import AdsterraResponsiveBanner from "@/components/ads/AdsterraResponsiveBanner.vue";
import LazyAd from "@/components/ads/LazyAd.vue";

export default {
  name: "PhimBo",
  props: ["movies", "loadingMore"],
  data() {
    return {
      urlImage: urlImage1,
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
        poster_url: "",
        time: "",
        quality: "",
        vote_average: "",
      },
    };
  },
  components: {
    AdsterraResponsiveBanner,
    LazyAd,
  },
  methods: {
    gomovie(movie) {
      this.$router.push({
        name: "Movies",
        params: { slug: movie.slug },
      });
    },
    handleFavorite(movie) {
      this.movieFavorite.IDMovies = movie._id;
      this.movieFavorite.slug = movie.slug;
      this.movieFavorite.currentPage = movie.page;
      if (movie.thumb_url.includes("img.ophim.live")) {
        this.movieFavorite.UrlMovies = movie.thumb_url;
      } else {
        if (movie.thumb_url.includes("https://phimimg.com/upload")) {
          this.movieFavorite.UrlMovies = this.urlImage + movie.thumb_url;
        } else {
          this.movieFavorite.UrlMovies =
            this.urlImage + "https://phimimg.com/" + movie.thumb_url;
        }
      }
      this.movieFavorite.origin_name = movie.origin_name;
      this.movieFavorite.name = movie.name;
      this.movieFavorite.year = movie.year;
      this.movieFavorite.lang = movie.lang;
      this.movieFavorite.poster_url = movie.poster_url;
      this.movieFavorite.time = movie.time;
      this.movieFavorite.quality = movie.quality;
      this.movieFavorite.vote_average = movie.tmdb.vote_average;
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
    getOptimizedImage(imagePath) {
      console.log(imagePath);
      if (imagePath.includes("https://phimimg.com")) {
        return imagePath;
      } else if (imagePath.includes("upload")) {
        return "https://phimimg.com/" + imagePath;
      }
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
  color: var(--zc-text);
}
.v-container {
  width: 100%;
  padding: 6px;
  margin-right: auto;
  margin-left: auto;
}
.page-title {
  font-size: 1.8rem;
  font-weight: 700;
}

.stats-bar {
  font-size: 1rem;
  color: var(--zc-text-dim);
}

.movie-link {
  text-decoration: none;
  color: inherit;
}

.movie-grid {
  row-gap: 24px;
}

.movie-card {
  border-radius: var(--zc-radius);
  overflow: hidden;
  background: linear-gradient(160deg, var(--zc-surface), var(--zc-bg-2));
  border: 1px solid var(--zc-border);
  transition: transform 0.35s var(--zc-ease), box-shadow 0.35s ease, border-color 0.35s ease;
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
  transform: translateY(-6px) scale(1.02);
  z-index: 2;
  border-color: rgba(255, 183, 0, 0.35);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.7), 0 0 24px rgba(255, 140, 0, 0.12);
}

.poster-wrapper {
  position: relative;
  overflow: hidden;
  background-color: var(--zc-bg-2);
}

/* Smooth image zoom on hover */
:deep(.v-img__img) {
  transition: transform 0.55s var(--zc-ease);
}
.movie-card:hover :deep(.v-img__img) {
  transform: scale(1.08);
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 10, 16, 0.9) 0%,
    rgba(10, 10, 16, 0.15) 50%,
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
  background: rgba(5, 5, 10, 0.55);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

.hover-overlay .v-icon {
  transform: scale(0.8);
  transition: transform 0.3s var(--zc-ease);
  color: #fff;
  filter: drop-shadow(0 0 12px rgba(255, 183, 0, 0.6));
}

.movie-card:hover .hover-overlay .v-icon {
  transform: scale(1);
  color: #ffb700;
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
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.badge.quality {
  color: #ffb700;
  border: 1px solid rgba(255, 183, 0, 0.35);
}

.badge.lang {
  color: #8ec5ff;
  border: 1px solid rgba(100, 181, 246, 0.3);
}

.episode-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, #ffb700, #ff5e00);
  color: #0a0a12;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  z-index: 3;
  box-shadow: 0 2px 10px rgba(255, 140, 0, 0.45);
}

.rating {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: #ffcc4d;
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
  color: var(--zc-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.25s ease;
}

.movie-card:hover .movie-title {
  color: #ffb700;
}

.movie-sub {
  font-size: 12px;
  color: var(--zc-text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 6px;
}

.meta-row {
  font-size: 12px;
  color: var(--zc-text-dim);
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
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--zc-text-dim);
  transition: background 0.2s, color 0.2s;
}

.genre-item:hover {
  background: rgba(255, 183, 0, 0.15);
  color: #ffb700;
}

.load-more-trigger {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;
}

/* Mobile */
@media (max-width: 600px) {
  .movie-grid {
    row-gap: 16px;
  }
  .movie-title {
    font-size: 13px;
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
/* ===== LIST VARIANT (mobile) ===== */
.movie-list {
  background: transparent;
}

.movie-item {
  background: linear-gradient(160deg, var(--zc-surface), var(--zc-bg-2));
  border: 1px solid var(--zc-border);
  border-radius: var(--zc-radius);
  overflow: hidden;
  padding: 10px;
  transition: transform 0.3s var(--zc-ease), background 0.3s ease, border-color 0.3s ease;
}

.movie-item:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 183, 0, 0.3);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.55);
}

.poster-wrapper {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.poster-img {
  border-radius: 10px;
  cursor: pointer;
}

/* TAG quality */
.tag-new-comp {
  position: absolute;
  top: 6px;
  left: 6px;
  background: linear-gradient(135deg, #ffb700, #ff5e00);
  color: #0a0a12;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}
.tag-new {
  position: absolute;
  top: 6px;
  left: 6px;
  background: rgba(255, 183, 0, 0.85);
  color: #0a0a12;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}

.content-col {
  padding: 10px;
}

.movie-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--zc-text);
}

.episode-text {
  font-size: 12px;
  color: var(--zc-text-dim);
}

.progress-bar {
  margin: 6px 0;
}

.next-ep {
  font-size: 12px;
  color: var(--zc-text-dim);
}

.highlight {
  color: #ffb700;
  font-weight: 600;
}

.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.time {
  font-size: 11px;
  color: var(--zc-text-faint);
}

.notify {
  transform: scale(0.8);
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  gap: 8px;
}

.btn-outline {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
}

.btn-watch {
  background: var(--zc-grad) !important;
  color: #0a0a12 !important;
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  transition: transform 0.25s var(--zc-ease), box-shadow 0.25s ease;
}
.btn-watch:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 140, 0, 0.4);
}
.notify-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.notify-label {
  font-size: 12px;
  color: var(--zc-text-dim);
}

.notify-switch {
  margin: 0;
  transform: scale(0.8);
}
.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}
.native-ad-col {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 10px 0 20px;
}

.native-ad-wrapper {
  width: 100%;
  max-width: 100%;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.home-ad-slot {
  width: 100%;
  max-width: 100%;

  min-height: 60px;

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 18px auto;

  overflow: hidden;
}
@media (max-width: 600px) {
  .home-ad-slot {
    width: 100%;
    max-width: 100vw;

    min-height: 50px;

    margin: 12px 0;

    padding: 0 4px;

    box-sizing: border-box;
  }
}
</style>

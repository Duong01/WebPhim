<template>
  <v-container class="favorite-page" fluid>
    <!-- HEADER + TOOLBAR -->
    <!-- HEADER -->
    <div class="header-bar">
      <div class="header-left" v-show="$vuetify.display.smAndUp">
        <h2>🎬 Danh sách yêu thích</h2>
        <span class="sub">{{ filteredMovies.length }} phim</span>
      </div>

      <div class="header-right">
        <v-text-field
          v-model="search"
          placeholder="Tìm phim..."
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          density="compact"
          hide-details
          width="200"
        />
        <v-select
          v-model="filters.sortOption"
          :items="sortItems"
          item-title="title"
          item-value="value"
          label="Sắp xếp"
          variant="solo-filled"
          density="compact"
          hide-details
          clearable
          max-width="150"
          hint="Pick your favorite states"
        />
        
        
      </div>
    </div>

    <!-- STATS -->
    <v-row class="mb-2">
      <v-col cols="12">
        <div class="stats-bar">
          <span>🎬 {{ filteredMovies.length }} phim</span>
          <span>📄 Trang {{ currentPage }}</span>
        </div>
      </v-col>
    </v-row>

    <!-- ================= LOADING ================= -->

    <v-row v-if="loading">
      <v-col v-for="n in 12" :key="n" cols="6" sm="6" md="3" lg="3">
        <v-skeleton-loader type="image" class="rounded-lg" />
      </v-col>
    </v-row>

    <!-- ================= EMPTY ================= -->

    <div v-else-if="movies.length === 0" class="empty-state">
      <v-icon size="80"> mdi-movie-off </v-icon>

      <h3 class="mt-4">Bạn chưa lưu phim nào</h3>

      <p>Hãy khám phá và thêm phim vào danh sách yêu thích</p>

      <v-btn color="red" class="mt-4" to="/home"> Khám phá phim </v-btn>
    </div>

    <!-- ================= MOVIE GRID ================= -->

    <v-row v-else tag="transition-group" name="fade-scale" class="movie-grid">
      <v-col
        v-for="(movie, index) in filteredMovies"
        :key="movie.IDMovies || movie.id"
        cols="6"
        sm="4"
        md="3"
        lg="3"
      >
        <router-link
          :to="{ name: 'Movies', params: { slug: movie.slug } }"
          class="movie-link"
        >
          <v-card
            class="movie-card"
            :style="{ animationDelay: `${(index % 20) * 0.05}s` }"
          >
            <div class="poster-wrapper">
              <v-img
                :src="getOptimizedImage(movie.poster_url || movie.UrlMovies)"
                aspect-ratio="2/3"
                cover
                class="poster-img"
              >
                <template #placeholder>
                  <div
                    class="d-flex align-center justify-center fill-height"
                  >
                    <v-progress-circular indeterminate color="primary" />
                  </div>
                </template>
              </v-img>
              <div class="gradient-overlay"></div>
              <div class="hover-overlay">
                <v-icon size="50">mdi-play-circle</v-icon>
              </div>
              <v-btn
                icon
                size="small"
                variant="flat"
                class="remove-btn"
                @click.stop.prevent="handleFavorite(movie)"
              >
                <v-icon>mdi-heart-off</v-icon>
              </v-btn>
              <div class="top-badges">
                <span class="badge quality">{{ movie.quality || "FHD" }}</span>
                <span class="badge lang">{{ movie.lang }}</span>
              </div>
              <div class="episode-badge">
                {{ movie.currentPage || movie.episode_current }}
              </div>
              <div
                class="rating"
                v-if="movie.vote_average && movie.vote_average !== '0'"
              >
                ⭐ {{ Number(movie.vote_average || 0).toFixed(1) }}
              </div>
            </div>
            <v-card-text class="movie-info">
              <div class="movie-title">{{ movie.name }}</div>
              <div class="movie-sub">{{ movie.origin_name }}</div>
              <div class="meta-row">
                <span>{{ movie.year }}</span>
                <span v-if="movie.time">•</span>
                <span v-if="movie.time" class="text-truncate">{{
                  movie.time
                }}</span>
              </div>
              <div class="meta-row added-date">
                <span>Đã thêm: {{ formatDate(movie.Daycreate) }}</span>
              </div>
            </v-card-text>
          </v-card>
        </router-link>
      </v-col>
    </v-row>

    <!-- LOAD MORE TRIGGER -->
    <div ref="loadMoreTrigger" v-show="movies.length" class="load-more-trigger">
      <v-progress-circular v-if="loadingMore" indeterminate color="red" />
    </div>
  </v-container>
</template>

<script>
import { urlImage1, PostMoviesFavorite } from "@/model/api";
// import FilterMovie from "@/pages/FilterMovie.vue"
import { getFavorites } from "@/utils/favorite";

export default {
  name: "FavoritePage",
  data() {
    return {
      loading: true,
      currentPage: 1,
      indexClick: 1,
      moviesPerPage: 20,
      totalMovies: 100,
      movies: [],
      path: "favorite",
      urlImage: urlImage1,
      titlePage: "",
      MessageErr: "",
      sortItems: [
        { title: "Mới nhất", value: "new" },
        { title: "A-Z", value: "name" },
        { title: "Năm", value: "year" }
      ],

      loadingMore: false,
      isLastPage: false,
      // Bộ lọc
      search: "",
      snackbar: false,
      snackbarText: "",

      filters: {
        year: "",
        lang: "",
        category: "",
        country: "",
        sortOption: "year",
      },

      movieFavorite: {
        IDAccount: "",
        IDMovies: "",
        slug: "",
        currentPage: 1,
        UrlMovies: "",
        origin_name: "",
        name: "",
        year: "",
        lang: "",
      },
    };
  },
  mounted() {
    try {
      this.ListMovie();
      this.$store.dispatch("loading/stopLoading");
    } catch (err) {
      console.log(err);
    } finally {
      this.$store.dispatch("loading/stopLoading");
    }
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    formatDate(date) {
  if (!date) return "NA";
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return "NA";
  }
},
    handleFavorite(movie) {
      const payload = {
        IDAccount: this.idAccount,
        IDMovies: movie.IDMovies,
        slug: movie.slug,
        currentPage: movie.currentPage,
        UrlMovies: movie.UrlMovies,
        origin_name: movie.origin_name,
        name: movie.name,
        year: movie.year,
        lang: movie.lang,
      };

      PostMoviesFavorite(
        payload,
        (dat) => {
          if (dat.data.status == "success") {
            alert("🎬 " + dat.data.message);
            const index = this.movies.findIndex(m => m.IDMovies === movie.IDMovies);
            if (index > -1) {
                this.movies.splice(index, 1);
            }
          } else {
            alert(dat.data.message);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },

    // ListMovie() {

    //   this.loading = true;
    //   this.movies = [];
    //   var movie = {
    //     idAccount: this.idAccount,
    //     page: this.currentPage,
    //   };
    //   getFavorites(
    //     movie,
    //     (dat) => {
    //       if (dat.data.status === "success") {
    //         this.movies = dat.data.data;
    //         this.movies = dat.data.data.map((m) => ({
    //           ...m,
    //           isFavorite: true, // vì đang ở trang favorite
    //         }));
    //       } else {
    //         this.MessageErr = dat.data.message;
    //       }
    //       this.loading = false;
    //     },
    //     (err) => {
    //       console.log(err);
    //       this.loading = false;
    //     },
    //   );
    // },
    ListMovie(isLoadMore = false) {
      if (isLoadMore) {
        this.loadingMore = true;
      } else {
        this.loading = true;
        this.movies = [];
      }

      const params = {
        idAccount: this.idAccount,
        page: this.currentPage,
      };

      getFavorites(
        params,
        (dat) => {
          if (dat.data.status === "success") {
            const newMovies = dat.data.data.map((m) => ({
              ...m,
              isFavorite: true,
            }));

            if (isLoadMore) {
              this.movies = [...this.movies, ...newMovies];
            } else {
              this.movies = newMovies;
            }

            // check hết data chưa
            if (newMovies.length < this.moviesPerPage) {
              this.isLastPage = true;
            }
          }

          this.loading = false;
          this.loadingMore = false;
        },
        () => {
          this.loading = false;
          this.loadingMore = false;
        }
      );
    },
    initObserver() {
      if (!this.$refs.loadMoreTrigger) {
        return;
      }

      if (this.observer) {
        this.observer.disconnect();
      }

      this.observer = new IntersectionObserver((entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !this.loadingMore && !this.isLastPage) {

          this.currentPage++;
          this.ListMovie(true);
        }
      });

      this.observer.observe(this.$refs.loadMoreTrigger);
    },
    getOptimizedImage(imagePath) {
      if (imagePath.includes("img.ophim.live")) {
        return imagePath;
      }
      return `${
        imagePath.includes("https://phimimg.com/upload")
          ? this.urlImage + imagePath
          : this.urlImage + "https://phimimg.com/" + imagePath
      }`;
    },

    applyFilters() {
      this.currentPage = 1;
      this.ListMovie();
      this.showFilter = false;
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
  computed: {
    idAccount() {
      return this.$store.state.empInfor.ID || localStorage.getItem("name");
    },
    filteredMovies() {
      let list = [...this.movies];

      // search
      if (this.search) {
        list = list.filter((m) =>
          m.name.toLowerCase().includes(this.search.toLowerCase())
        );
      }

      // sort
      if (this.filters.sortOption === "year") {
        list.sort((a, b) => b.year - a.year);
      }

      if (this.filters.sortOption === "name") {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }

      return list;
    },
  },
  watch: {
    movies() {
      this.$nextTick(() => {
        this.initObserver();
      });
    },
  },
};
</script>

<style scoped>
.favorite-page {
  min-height: 100vh;
  padding: 40px 10px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #aaa;
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  color: #aaa;
  font-size: 14px;
}
/* HEADER */
.header-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
  background: rgba(15, 15, 15, 0.8);

  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 10px 0;
  margin-bottom: 20px;
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
}

.header-left .sub {
  font-size: 13px;
  color: #aaa;
}

.header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}
@media (max-width: 768px) {
  .header-bar {
    flex-direction: column;
  }
  .header-left {
    text-align: center;
  }
  .header-right {
    justify-content: center;
  }
  .hover-overlay {
    display: none;
  }
  .remove-btn {
    background-color: rgba(229, 57, 53, 0.7);
  }
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
  background-color: #111;
}
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
.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 4;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  transition: all 0.2s ease;
}
.remove-btn:hover {
  background-color: #e53935;
  transform: scale(1.1);
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
  bottom: 8px;
  left: 8px;
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
  background: #1a1c23;
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
  min-height: 42px; /* 15px * 1.4 * 2 lines */
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
.added-date {
  font-size: 11px;
  color: #888;
  margin-top: auto;
  padding-top: 6px;
}
.load-more-trigger {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;
}
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
</style>
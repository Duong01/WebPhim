<template>
  <v-container class="favorite-page" fluid>
    <!-- HEADER + TOOLBAR -->
    <v-row class="mb-12" align="center">
      <v-col cols="12" md="12">
        <h2 class="page-title">🎬 {{ $t("Danh sách phim của bạn") }}</h2>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          placeholder="Tìm phim..."
          prepend-inner-icon="mdi-magnify"
          clearable
          dense
          variant="solo"
        />
      </v-col>

      <v-col cols="12" md="6" class="text-md-right">
        <v-select
          v-model="filters.sortOption"
          :items="sortItems"
          dense
          variant="solo"
          hide-details
        />
      </v-col>
    </v-row>

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
    v-for="movie in filteredMovies"
    :key="movie.IDMovies"
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

        <!-- POSTER -->
        <div class="poster-wrapper">
          <v-img
            :src="getOptimizedImage(movie.UrlMovies)"
            class="movie-poster"
            cover
          />

          <!-- overlay -->
          <div class="hover-overlay">
            <v-btn icon class="btn-play">
              <v-icon size="40">mdi-play</v-icon>
            </v-btn>

            <v-btn icon @click.stop.prevent="handleFavorite(movie)">
              <v-icon color="red">mdi-heart</v-icon>
            </v-btn>
          </div>

          <!-- badge -->
          <div class="top-badges">
            <span class="badge quality">HD</span>
            <span class="badge lang">{{ movie.lang }}</span>
            <span class="badge hot" v-if="movie.year >= 2025">🔥 NEW</span>
          </div>

          <!-- episode -->
          <div class="episode-badge">
            {{ movie.episode_current || "Full" }}
          </div>

          <!-- rating -->
          <div class="rating">
            ⭐ {{ (Math.random()*3+7).toFixed(1) }}
          </div>
        </div>

        <!-- INFO -->
        <v-card-text class="movie-info">

          <div class="movie-title">
            {{ movie.name }}
          </div>

          <div class="movie-sub">
            {{ movie.origin_name }}
          </div>

          <!-- meta -->
          <div class="meta-row">
            <span>{{ movie.year }}</span>
            <span>•</span>
            <span>23m</span>
            <span>•</span>
            <span>CN</span>
          </div>

          <!-- genre -->
          <div class="genre-list">
            <span class="genre-item">Action</span>
            <span class="genre-item">Drama</span>
          </div>

          <!-- progress -->
          <div class="progress-bar">
            <div class="progress"></div>
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
    <!-- ================= PAGINATION ================= -->

    <v-pagination
      v-if="!loading && movies.length"
      v-model="currentPage"
      :length="Math.ceil(totalMovies / moviesPerPage)"
      class="mt-6 justify-center"
    />
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
      moviesPerPage: 20,
      totalMovies: 100,
      movies: [],
      path: "favorite",
      urlImage: urlImage1,
      titlePage: "",
      MessageErr: "",

      loadingMore: false,
      isLastPage: false,
      // Bộ lọc
      search: "",
      snackbar: false,
      snackbarText: "",

      sortItems: [
        { title: "Mới nhất", value: "new" },
        { title: "Năm", value: "year" },
        { title: "Tên", value: "name" },
      ],

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
    handleFavorite(movie) {
      console.log(movie);
      this.movieFavorite.IDAccount = this.idAccount;
      this.movieFavorite.IDMovies = movie.IDMovies;
      this.movieFavorite.slug = movie.slug;
      this.movieFavorite.currentPage = movie.currentPage;
      this.movieFavorite.UrlMovies = movie.UrlMovies;
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
        console.log("❌ chưa có trigger");
        return;
      }

      if (this.observer) {
        this.observer.disconnect();
      }

      this.observer = new IntersectionObserver((entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !this.loadingMore && !this.isLastPage) {
          console.log("👉 LOAD PAGE", this.currentPage + 1);

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
    currentPage() {
      this.loading = true;
      this.ListMovie();
    },
  },
};
</script>

<style scoped>
.favorite-page {
  min-height: 100vh;
  padding: 40px 12px;
  background: radial-gradient(circle at top, #1b1d2b, #0f111a);
  color: #fff;
}

/* CARD */
.movie-card {
  border-radius: 18px;
  overflow: hidden;
  background: #181a24;
  transition: all 0.4s ease;
  position: relative;
}

.movie-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 25px 60px rgba(0,0,0,0.9);
}

/* POSTER */
.poster-wrapper {
  position: relative;
}

.movie-poster {
  aspect-ratio: 2/3;
}

.movie-poster img {
  transition: transform 0.5s;
}

.movie-card:hover .movie-poster img {
  transform: scale(1.12);
}

/* gradient */
.poster-wrapper::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.95), transparent 60%);
}

/* overlay */
.hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,.6);
  opacity: 0;
  transition: 0.3s;
}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

/* play button */
.btn-play {
  background: red;
  color: white;
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
}

.badge.quality {
  background: #ff3d00;
}

.badge.lang {
  background: #1976d2;
}

.badge.hot {
  background: #e53935;
}

/* episode */
.episode-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: #e53935;
  font-size: 12px;
  padding: 3px 7px;
  border-radius: 6px;
}

/* rating */
.rating {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0,0,0,.7);
  padding: 3px 7px;
  border-radius: 6px;
  font-size: 12px;
}

/* info */
.movie-info {
  padding: 12px;
}

.movie-title {
  font-size: 14px;
  font-weight: 600;
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
  color: #aaa;
  display: flex;
  gap: 5px;
  margin-top: 4px;
}

/* genre */
.genre-list {
  margin-top: 6px;
  display: flex;
  gap: 5px;
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
}

.progress {
  width: 40%;
  height: 100%;
  background: red;
}

/* animation */
.fade-scale-enter-active {
  transition: all 0.4s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>

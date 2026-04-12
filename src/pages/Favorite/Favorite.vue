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
        v-for="movie in filteredMovies"
        :key="movie.id"
        cols="6"
        sm="6"
        md="3"
        lg="3"
      >
        <router-link
          :to="{ name: 'MovieDetail', params: { slug: movie.slug } }"
          class="movie-link"
        >
          <v-card class="movie-card" elevation="0">
  <div class="poster-wrapper">
    <v-img
      :src="getOptimizedImage(movie.poster_url || movie.UrlMovies)"
      class="movie-poster"
      cover
      height="270"
    />

    <!-- overlay -->
    <div class="hover-overlay">
      <v-btn icon>
        <v-icon size="40">mdi-play</v-icon>
      </v-btn>

      <v-btn icon @click.stop.prevent="handleFavorite(movie)">
        <v-icon :color="indexClick % 1 === 0 ? 'red' : 'white'">
                          {{
                            indexClick % 1 === 0
                              ? "mdi-heart"
                              : "mdi-heart-outline"
                          }}
                        </v-icon>
      </v-btn>
    </div>

    <!-- TOP BADGE -->
    <div class="top-badges">
      <span class="badge quality">{{ movie.quality || "NA" }}</span>
      <span class="badge lang">{{ movie.lang || "NA" }}</span>
    </div>

    <!-- EPISODE -->
    <div class="episode">
      {{ movie.currentPage || "NA" }}
    </div>

    <!-- BOTTOM INFO -->
    <div class="bottom-info">
      ⭐ {{ movie.vote_average && movie.vote_average !== "0" ? movie.vote_average : "NA" }}
      <span>{{ movie.year || "NA" }}</span>
    </div>
  </div>

  <!-- INFO -->
  <v-card-text class="movie-info">
    <div class="movie-title">
      {{ movie.name || "NA" }}
    </div>

    <div class="movie-sub">
      <span>{{ movie.origin_name || "NA" }}</span>
    </div>

    <!-- EXTRA INFO -->
    <div class="movie-extra">
      <span>⏱ {{ movie.time || "NA" }}</span>
      <span>📅 {{ formatDate(movie.Daycreate) }}</span>
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
      this.indexClick++;
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
  padding: 40px 10px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
}

/* grid */

.movie-grid {
  row-gap: 20px;
}

/* card */
.movie-card {
  border-radius: 14px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.movie-poster {
  aspect-ratio: 2/3;
  width: 100%;
}

.movie-info {
  padding: 10px;
  min-height: 70px;
}

.movie-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
}

/* gradient */

.poster-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85),
    rgba(0, 0, 0, 0.2),
    transparent
  );
  opacity: 0.8;
}

/* play */

.movie-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  opacity: 0;
  color: white;
  transition: 0.25s;
}

.movie-card:hover .movie-play {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

/* favorite */

.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
}

/* badges */

.movie-badges {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 6px;
}

.badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.badge.quality {
  background: #ff3d00;
  color: white;
}

.badge.lang {
  background: #2196f3;
  color: white;
}

.movie-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-sub {
  font-size: 12px;
  color: #aaa;
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}

.movie-link {
  text-decoration: none;
}

/* empty */

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #aaa;
}

/* animation */

.fade-scale-enter-active {
  transition: all 0.35s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.movie-grid .v-col {
  display: flex;
}
.fade-scale-enter-active {
  transition: all 0.45s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}

.fade-scale-leave-active {
  transition: all 0.25s ease;
  position: absolute;
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.movie-poster img {
  transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.movie-card:hover .movie-poster img {
  transform: scale(1.08);
}
.movie-card {
  border-radius: 16px;
  overflow: hidden;
  background: #111;
  transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.movie-card:hover {
  transform: translateY(-8px) scale(1.03);

  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}
.poster-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95),
    rgba(0, 0, 0, 0.4),
    transparent
  );
  transition: opacity 0.35s ease;
}

.movie-card:hover .poster-gradient {
  opacity: 0.6;
}
.movie-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  opacity: 0;
  color: white;
  transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 0.35s ease;
}

.movie-card:hover .movie-play {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;

  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);

  border-radius: 50%;

  transition: transform 0.25s ease;
}

.favorite-btn:hover {
  transform: scale(1.15);
}
.badge {
  font-size: 11px;
  padding: 3px 7px;
  border-radius: 6px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.badge.quality {
  background: #ff3d00;
}

.badge.lang {
  background: #2196f3;
}
.movie-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  transition: color 0.25s ease;
}

.movie-card:hover .movie-title {
  color: #ff9800;
}
.stats-bar {
  display: flex;
  justify-content: space-between;
  color: #aaa;
  font-size: 14px;
}

/* overlay */
.hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: 0.3s;
}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

/* card đẹp hơn */
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

/* image zoom */
.movie-poster img {
  transition: 0.5s;
}

.movie-card:hover .movie-poster img {
  transform: scale(1.1);
}
.load-more-trigger {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.poster-wrapper {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
}
.movie-poster {
  aspect-ratio: 2/3;
  transition: transform 0.5s ease;
}
.movie-card:hover .movie-poster {
  transform: scale(1.12);
}
.hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  opacity: 0;
  transition: 0.3s;
}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

/* mobile vẫn click được */
@media (hover: none) {
  .hover-overlay {
    opacity: 1;
    background: rgba(0,0,0,0.3);
  }
}

/* badges */
.top-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 5px;
}

.badge {
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 6px;
  font-weight: 600;
  backdrop-filter: blur(6px);
}

.quality {
  background: #ff3d00;
}

.lang {
  background: #2196f3;
}

/* episode */
.episode {
  position: absolute;
  bottom: 35px;
  left: 8px;
  background: rgba(0,0,0,0.7);
  padding: 3px 6px;
  font-size: 12px;
  border-radius: 4px;
}

/* bottom info */
.bottom-info {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;

  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

/* info */
.movie-info {
  padding: 10px;
}

.movie-title {
  font-weight: 600;
  font-size: 14px;
  color: white;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.movie-sub {
  font-size: 12px;
  color: #aaa;
}

/* extra */
.movie-extra {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

/* hover card */
.movie-card {
  border-radius: 16px;
  background: #111;
  transition: all 0.35s ease;
}

.movie-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 35px rgba(0,0,0,0.7);
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
  .hover-overlay {
    display: none;
  }
}
</style>
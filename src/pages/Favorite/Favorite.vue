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
        :key="movie.id"
        cols="6"
        sm="6"
        md="3"
        lg="3"
      >
        <router-link
          :to="{ name: 'Movies', params: { slug: movie.slug } }"
          class="movie-link"
        >
          <v-card class="movie-card">
  <v-img
    :src="getOptimizedImage(movie.poster_url || movie.UrlMovies)"
    class="movie-poster"
    cover
  >
    <!-- gradient -->
    <div class="poster-gradient"></div>

    <!-- top badges -->
    <div class="top-badges">
      <span class="badge quality">{{ movie.quality || "HD" }}</span>
      <span class="badge episode">{{ movie.episode_current }}</span>
    </div>

    <!-- rating -->
    <div class="rating">
      ⭐ {{ Number(movie.tmdb?.vote_average || 0).toFixed(1) }}
    </div>

    <!-- overlay -->
    <div class="hover-overlay">
      <v-btn icon>
        <v-icon size="40">mdi-play-circle</v-icon>
      </v-btn>

      <v-btn icon @click.stop.prevent="handleFavorite(movie)">
        <v-icon color="red">mdi-heart</v-icon>
      </v-btn>
    </div>
  </v-img>

  <v-card-text class="movie-info">
    <div class="movie-title">
      {{ movie.name }}
    </div>

    <div class="movie-sub">
      <span>{{ movie.origin_name }}</span>
      <span>{{ movie.year }}</span>
    </div>

    <!-- extra info -->
    <div class="movie-meta">
      <span>⏱ {{ movie.time }}</span>
      <span>🌍 {{ movie.country?.[0]?.name }}</span>
    </div>

    <!-- category -->
    <div class="movie-category">
      <v-chip
        v-for="c in movie.category"
        :key="c.id"
        size="x-small"
        class="mr-1"
      >
        {{ c.name }}
      </v-chip>
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
import { urlImage1, PostMoviesFavorite,MoveInfor  } from "@/model/api";
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
      movieCache: {},

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
      const cache = localStorage.getItem("movieCache");
      if (cache) {
        this.movieCache = JSON.parse(cache);
      }
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
    // ListMovie(isLoadMore = false) {
    //   if (isLoadMore) {
    //     this.loadingMore = true;
    //   } else {
    //     this.loading = true;
    //     this.movies = [];
    //   }

    //   const params = {
    //     idAccount: this.idAccount,
    //     page: this.currentPage,
    //   };

    //   getFavorites(
    //     params,
    //     (dat) => {
    //       if (dat.data.status === "success") {
    //         const newMovies = dat.data.data.map((m) => ({
    //           ...m,
    //           isFavorite: true,
    //         }));

    //         if (isLoadMore) {
    //           this.movies = [...this.movies, ...newMovies];
    //         } else {
    //           this.movies = newMovies;
    //         }

    //         // check hết data chưa
    //         if (newMovies.length < this.moviesPerPage) {
    //           this.isLastPage = true;
    //         }
    //       }

    //       this.loading = false;
    //       this.loadingMore = false;
    //     },
    //     () => {
    //       this.loading = false;
    //       this.loadingMore = false;
    //     }
    //   );
    // },
    async ListMovie(isLoadMore = false) {
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
      async (res) => {
        if (res.data.status === "success") {
          const list = res.data.data;

          // 🔥 CALL API DETAIL SONG SONG
          const detailPromises = list.map(
  (m) =>
    new Promise((resolve) => {
      // ✅ nếu đã có cache thì dùng luôn
      if (this.movieCache[m.slug]) {
        return resolve({
          ...m,
          ...this.movieCache[m.slug],
          isFavorite: true,
        });
      }

      // ❌ chưa có thì gọi API
      MoveInfor(
        m.slug,
        (detail) => {
          if (detail.status === "success" || detail.status === true) {
            const item = detail.data.item;

            // ✅ lưu cache
            this.movieCache[m.slug] = item;

      // ✅ lưu cache LOCAL (THÊM DÒNG NÀY NGAY DƯỚI)
      localStorage.setItem(
        "movieCache",
        JSON.stringify(this.movieCache)
      );
            resolve({
              ...m,
              ...item,
              isFavorite: true,
            });
          } else {
            resolve(m);
          }
        },
        () => resolve(m)
      );
    })
);
          const fullMovies = await Promise.all(detailPromises);

          if (isLoadMore) {
            this.movies = [...this.movies, ...fullMovies];
          } else {
            this.movies = fullMovies;
          }

          if (fullMovies.length < this.moviesPerPage) {
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
  padding: 40px 16px;
  background: linear-gradient(to right, #0f0c29, #302b63, #24243e);
  color: #fff;
}

/* GRID */
.movie-grid {
  row-gap: 24px;
}

/* CARD */
.movie-card {
  border-radius: 18px;
  overflow: hidden;
  background: #111;
  transition: all 0.35s ease;
  position: relative;
}

.movie-card:hover {
  transform: translateY(-10px) scale(1.04);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
}

/* POSTER */
.movie-poster {
  aspect-ratio: 2/3;
}

/* GRADIENT */
.poster-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
}

/* OVERLAY */
.hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);
  opacity: 0;
  transition: 0.3s;
}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

/* BADGES */
.top-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 6px;
}

.badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.badge.quality {
  background: #ff3d00;
}

.badge.episode {
  background: #673ab7;
}

/* RATING */
.rating {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.7);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
}

/* INFO */
.movie-info {
  padding: 12px;
}

.movie-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.movie-sub {
  font-size: 12px;
  color: #aaa;
  display: flex;
  justify-content: space-between;
}

/* EXTRA INFO */
.movie-meta {
  font-size: 12px;
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  color: #bbb;
}

/* CATEGORY */
.movie-category {
  margin-top: 6px;
}

/* CHIP */
.v-chip {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

/* EMPTY */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  color: #aaa;
}

/* LOADER */
.load-more-trigger {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <v-container class="favorite-page" fluid>
    <!-- HEADER + TOOLBAR -->
    <!-- HEADER -->
    <div class="header-bar">
      <div class="header-left" v-show="$vuetify.display.smAndUp">
        <h2>🎬 {{$t('Danh sách yêu thích')}}</h2>
        <span class="sub">{{ filteredMovies.length }} phim</span>
      </div>

      <div class="header-right">
        <v-text-field
          v-model="search"
          :placeholder="$t('Tìm phim...')"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          density="compact"
          hide-details
          clearable
          class="search-field"
        />
        <v-select
          v-model="filters.sortOption"
          :items="sortItems"
          item-title="title"
          item-value="value"
          :label="$t('Sắp xếp')"
          variant="solo-filled"
          density="compact"
          hide-details
          clearable
          hint="Pick your favorite states"
          class="sort-select"
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

      <h3 class="mt-4">{{$t('Bạn chưa lưu phim nào')}}</h3>

      <p>{{$t('Hãy khám phá và thêm phim vào danh sách yêu thích')}}</p>

      <v-btn color="red" class="mt-4" to="/home"> {{$t('Khám phá phim')}} </v-btn>
    </div>

    <!-- ================= MOVIE GRID ================= -->

    <!-- ================= MOVIE LIST (MOBILE STYLE LIKE IMAGE) ================= -->
<v-row v-else-if="$vuetify.display.mdAndDown" class="movie-list">

  <v-col
    v-for="movie in filteredMovies"
    :key="movie.id"
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
              :src="getOptimizedImage(movie.poster_url || movie.UrlMovies)"
              height="160"
              cover
              hover
              class="poster-img"
              @click="gomovie(movie)"
            />

            <!-- TAG -->
            <div class="tag-new" v-if="getNextEpisode(movie).includes('Tập')">
              Sắp ra
            </div>
            <div class="tag-new-comp" v-else>
              Hoàn tất
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
          <div class="episode-text">
            Tập đang xem : {{ movie.currentPage.includes("Tập") ? movie.currentPage +"/" + movie.totalPage || "?" : movie.currentPage}} 
          </div>

          <!-- PROGRESS -->
          <div class="progress-wrapper">
            <v-progress-linear
              :model-value="getProgress(movie)"
              height="6"
              color="red"
              rounded
              class="progress-bar"
            />

            <span class="progress-text">
              {{ getProgress(movie).toFixed(1) }}%
            </span>
          </div>

          <!-- NEXT EPISODE -->
          <div class="next-ep">
            Tập tiếp theo:
            <span class="highlight">
              {{ getNextEpisode(movie) }}
            </span>
          </div>

          <!-- STATUS -->
          <div class="status">
            <span class="time">📅 {{ formatDate(movie.Daycreate) }}</span>

            <div class="notify-wrap">
              <v-icon size="14" class="bell-icon">
                mdi-bell-outline
              </v-icon>
              <span class="notify-label">Nhắc tôi</span>

              <v-switch
                v-model="movie.notification"
                color="red"
                density="compact"
                hide-details
                inset
                class="notify-switch"
                @update:model-value="val => UpdateNotifi(movie, val)"
              />
            </div>
          </div>

          <!-- ACTION BUTTONS -->
          <div class="actions">

            <v-btn
              size="small"
              color="red"
              class="btn-watch"
              @click="gomovie(movie)"
            >
              Xem ngay
            </v-btn>
            <v-btn
              size="small"
              variant="tonal"
              color="grey-darken-2"
              class="btn-outline"
              @click="handleFavorite(movie)"
            >
              Bỏ theo dõi
            </v-btn>

          </div>

        </v-col>

      </v-row>

    </v-card>

  </v-col>

</v-row>
<v-row v-else class="movie-grid-vertical">

  <v-col
    v-for="movie in filteredMovies"
    :key="movie.id"
    cols="12"
    sm="6"
    md="4"
    lg="3"
  >

    <v-card class="movie-card-vertical" flat>

      <!-- POSTER -->
      <div class="poster-wrapper">

        <v-img
          :src="getOptimizedImage(movie.poster_url || movie.UrlMovies)"
          height="260"
          cover
          class="poster-img"
          @click="gomovie(movie)"
        />

        <!-- TAG -->
        <div class="tag-new" v-if="getNextEpisode(movie).includes('Tập')">
          Sắp ra
        </div>
        <div class="tag-new-comp" v-else>
          Hoàn tất
        </div>

      </div>

      <!-- CONTENT -->
      <div class="card-content">

        <!-- TITLE -->
        <div class="movie-title">
          {{ movie.name }}
        </div>

        <!-- EPISODE -->
        <div class="episode-text">
          {{ movie.currentPage }} / {{ movie.totalPage || "?" }}
        </div>

        <!-- PROGRESS -->
        <div class="progress-wrapper">
          <v-progress-linear
            :model-value="getProgress(movie)"
            height="6"
            color="red"
            rounded
          />
          <span class="progress-text">
            {{ getProgress(movie).toFixed(1) }}%
          </span>
        </div>

        <!-- NEXT -->
        <div class="next-ep">
         Tập tiếp theo: {{ getNextEpisode(movie) }}
        </div>

        <!-- STATUS -->
        <div class="status">
          <span class="time">📅 {{ formatDate(movie.Daycreate) }}</span>

          <v-switch
            v-model="movie.notification"
            density="compact"
            hide-details
            inset
            color="red"
            @update:model-value="val => UpdateNotifi(movie, val)"
          />
        </div>

        <!-- ACTION -->
        <div class="actions">
          <v-btn  color="red" @click="gomovie(movie)">
            Xem ngay
          </v-btn>

          <v-btn
            variant="tonal"
            @click="handleFavorite(movie)"
          >
            Bỏ theo dõi
          </v-btn>
        </div>

      </div>

    </v-card>

  </v-col>

</v-row>

<!-- <v-row v-else tag="transition-group" name="fade-scale" class="movie-grid">
      <v-col
        v-for="movie in filteredMovies"
        :key="movie.id"
        cols="6"
        sm="6"
        md="3"
        lg="3"
      >
        <router-link
          :to="{ name: 'MovieDetail', params: { slug: movie.slug }, query: { page: movie.currentPage } }"
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

              <div class="hover-overlay">
                <v-btn icon>
                  <v-icon size="40">mdi-play</v-icon>
                </v-btn>

                <v-btn icon @click.stop.prevent="handleFavorite(movie)">
                  <v-icon :color="indexClick % 1 === 0 ? 'red' : 'white'">
                    {{
                      indexClick % 1 === 0 ? "mdi-heart" : "mdi-heart-outline"
                    }}
                  </v-icon>
                </v-btn>
              </div>

              <div class="top-badges">
                <span class="badge quality">{{ movie.quality || "NA" }}</span>
                <span class="badge lang">{{ movie.lang || "NA" }}</span>
              </div>

              <div class="episode">
                {{ movie.currentPage || "NA" }}
              </div>

              <div class="bottom-info">
                ⭐
                {{
                  movie.vote_average && movie.vote_average !== "0"
                    ? movie.vote_average
                    : "NA"
                }}
                <span>{{ movie.year || "NA" }}</span>
              </div>
            </div>

            <v-card-text class="movie-info">
              <div class="movie-title">
                {{ movie.name || "NA" }}
              </div>

              <div class="movie-sub">
                <span>{{ movie.origin_name || "NA" }}</span>
              </div>

              <div class="movie-extra">
                <span>⏱ {{ movie.time || "NA" }}</span>
                <span>📅 {{ formatDate(movie.Daycreate) }}</span>
              </div>
            </v-card-text>
          </v-card>
        </router-link>
      </v-col>
    </v-row> -->


    <!-- LOAD MORE TRIGGER -->
    <div ref="loadMoreTrigger" v-show="movies.length > 0 && !isLastPage" class="load-more-trigger">
      <v-progress-circular v-if="loadingMore" indeterminate color="red" />
    </div>
  </v-container>
</template>

<script>
import { urlImage1, PostMoviesFavorite,UpdateMoviesFavorite } from "@/model/api";
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
        { title: "Năm", value: "year" },
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
        sortOption: "new",
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
        poster_url:'',
        time: '',
        quality: '',
        vote_average: '',
        notification: "",
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
    getNextEpisode(movie) {
    let raw = movie.currentPage
    if (!raw) return "?"
    raw = raw.toString().toLowerCase()

    if (raw.includes("full") || raw.includes("hoàn")) {
      return "Đã hoàn thành"
    }

    const match = raw.match(/\d+/)
    if (match) {
      return "Tập " + (parseInt(match[0]) + 1)
    }

    return "?"
  },
    getProgress(movie) {
    if (!movie.totalPage) return 0

    let current = 0
    let raw = movie.currentPage

    if (!raw) return 0

    raw = raw.toString().toLowerCase()
    console.log("Current raw:", raw)
    // full / hoàn thành
    if (raw.includes("full") || raw.includes("hoàn")) {
      return 100
    }

    // lấy số từ "Tập 6"
    const match = raw.match(/\d+/)
    if (match) {
      current = parseInt(match[0])
    }

    return (current / movie.totalPage) * 100
  },
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
      this.movieFavorite.poster_url = movie.poster_url
      this.movieFavorite.time = movie.time
      this.movieFavorite.quality = movie.quality
      this.movieFavorite.vote_average = movie.vote_average
      this.movieFavorite.totalPage = movie.totalPage
      this.movieFavorite.notification = movie.notification
      

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
    },
    UpdateNotifi(movie, val) {
      this.movieFavorite.IDAccount = this.idAccount;
      this.movieFavorite.IDMovies = movie.IDMovies;
      this.movieFavorite.notification = val;
      UpdateMoviesFavorite(this.movieFavorite, (dat) => {
        console.log(dat);

      },(err) =>{
        console.log(err);
      })
      
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
    gomovie(movie) {
      this.$router.push({
        name : 'MovieDetail',
        params: { slug: movie.slug }, 
        query: { page: movie.currentPage }
      })
    },
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
              notification: m.notification === true || m.notification === "true"
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
        },
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
      else if(imagePath.includes("https://phimapi.com/image.php?")){
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
          m.name.toLowerCase().includes(this.search.toLowerCase()),
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
    background: rgba(0, 0, 0, 0.3);
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
  background: rgba(0, 0, 0, 0.7);
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
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.7);
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
  align-items: center;
  gap: 8px;
}
.search-field {
  flex: 1 1 0%;
  min-width: 250px; /* cực quan trọng */
}


@media (max-width: 768px) {
  .hover-overlay {
    display: none;
  }

  .header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
  /* 🔥 search tự giãn full */
.search-field {
  flex: 1 1 0%;
  min-width: 0; /* cực quan trọng */
}

/* 🔥 select co giãn nhưng nhỏ hơn */
.sort-select {
  flex: 0 1 180px; /* max khoảng này */
  min-width: 150px;
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
.tag-new{
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
  margin-top: 2px;
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
  margin-top: 8px;
  gap: 8px;
}

.btn-outline {
  flex: 1;
  font-size: 11px;
}

.btn-watch {
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

.progress-bar {
  flex: 1;
}

.progress-text {
  min-width: 45px;
  text-align: right;
  font-weight: 600;
  font-size: 12px;
}


/* GRID */
.movie-grid-vertical {
  row-gap: 20px;
}

/* CARD */
.movie-card-vertical {
  background: #1a1a1a;
  border-radius: 16px;
  overflow: hidden;
  transition: 0.3s;
}

.movie-card-vertical:hover {
  transform: translateY(-6px);
  background: #222;
  box-shadow: 0 12px 30px rgba(0,0,0,0.6);
}

/* POSTER */
.poster-wrapper {
  position: relative;
}

.poster-img {
  width: 100%;
  transition: 0.4s;
}

.movie-card-vertical:hover .poster-img {
  transform: scale(1.05);
}

/* TAG */
.tag-new,
.tag-new-comp {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 5px;
  color: #fff;
}

.tag-new {
  background: #ff9800;
}

.tag-new-comp {
  background: #ff3d00;
}

/* CONTENT */
.card-content {
  padding: 12px;
}

/* TITLE */
.movie-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* TEXT */
.episode-text,
.next-ep {
  font-size: 13px;
  color: #aaa;
  margin-top: 4px;
}

/* PROGRESS */
.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.progress-text {
  font-size: 12px;
  min-width: 40px;
}

/* STATUS */
.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.time {
  font-size: 11px;
  color: #888;
}

/* ACTION */
.actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
</style>

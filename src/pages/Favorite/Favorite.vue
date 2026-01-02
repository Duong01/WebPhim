<template>
  <v-container class="search-page" fluid>
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <h2 class="text-center">
          {{$t('Danh sách phim của bạn')}}
        </h2>
        <v-divider class="my-4" />
      </v-col>
    </v-row>

    <!-- <FilterMovie @filter-changed="onFilterChanged" /> -->



    <v-row justify="center">
      <v-col cols="12" class="text-center" v-if="loading">
        <v-progress-circular indeterminate color="primary" size="50" />
      </v-col>

      <v-col cols="12" v-else>
        <v-alert v-if="movies.length === 0" class="text-center">
          <strong>{{$t('Bạn không có phim nào đã được lưu')}} {{ MessageErr }}</strong>
          <br />
          <router-link to="/home">
            <v-btn variant="outlined" class="mt-2">{{$t('Về trang chủ')}}</v-btn>
          </router-link>
        </v-alert>


        <v-row
                no-gutters
                tag="transition-group"
                name="fade-scale"
                class="movie-list"
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
                    :to="{ name: 'Movies', params: { slug: movie.slug } }"
                    class="text-decoration-none"
                  >
                    <v-card
                      class="mx-auto bg-dark movie-card"
                      width="auto"
                    >
                      <v-img
                        :src="movie.UrlMovies.includes('https://phimimg.com/upload') ?  `https://phimapi.com/image.php?url=` + movie.UrlMovies : `https://phimapi.com/image.php?url=` + 'https://phimimg.com/'+ movie.UrlMovies"
                        :lazy-src="movie.UrlMovies.includes('https://phimimg.com/upload') ?  `https://phimapi.com/image.php?url=` + movie.UrlMovies : `https://phimapi.com/image.php?url=` + 'https://phimimg.com/'+ movie.UrlMovies"
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
                          :color="movie.isFavorite ? 'red' : ''"
                        >
                      
                          <v-icon>
                            {{ movie.isFavorite 
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
                          movie.slug === "Tập 0"
                            ? `Full - ${movie.lang}`
                            : `${movie.slug} - ${movie.lang}`
                        }}
                      </v-card-subtitle>

                      <v-card-title class="movie-title">{{
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

        <v-pagination
          v-model="currentPage"
          :length="Math.ceil(totalMovies / moviesPerPage)"
          class="my-4 justify-center"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
  
  <script>
import { urlImage1 } from "@/model/api";
// import FilterMovie from "@/pages/FilterMovie.vue"
import { getFavorites,toggleFavorite } from "@/utils/favorite";

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
      MessageErr: '',
      
      // Bộ lọc
      
      filters: {
        year: "",
        lang: "",
        category: "",
        country: "",
        sortOption: "year"
      },

      movieFavorite:{
        IDAccount :'',
        IDMovies: '',
        slug: '',
        currentPage: 1,
        UrlMovies: '',
        origin_name: '',
        name: '',
        year: '',
        lang:''
      }

      
    };
  },
  mounted() {
    this.ListMovie();
  },
  methods: {
    handleFavorite(movie){
      this.movieFavorite.IDAccount = this.idAccount
      this.movieFavorite.IDMovies = movie.IDMovies
      this.movieFavorite.slug = movie.slug
      this.movieFavorite.currentPage = movie.currentPage
      this.movieFavorite.UrlMovies = movie.UrlMovies
      this.movieFavorite.origin_name = movie.origin_name
      this.movieFavorite.name = movie.name
      this.movieFavorite.year = movie.year
      this.movieFavorite.lang = movie.lang
      toggleFavorite(this.movieFavorite, (dat) =>{
        if(dat.data.status == "success"){
          this.movies = dat.data.data
          movie.isFavorite = !movie.isFavorite;
          
        }
      }, (err) =>{
        console.log(err)
      })
      // console.log(movie)
      // toggleFavorite(movie);
      // this.$forceUpdate();
    },
    
    // toggleFavorite(movie) {
    //   const index = this.favoriteMovies.findIndex(
    //     (fav) => fav._id === movie.id
    //   );
    //   if (index !== -1) {
    //     this.favoriteMovies.splice(index, 1); // Bỏ yêu thích
    //   } else {
    //     this.favoriteMovies.push(movie); // Thêm yêu thích
    //   }
    // },
    // onFilterChanged(newFilters) {
    //   this.filters = { ...newFilters };
    //   this.currentPage = 1;
    //   this.ListMovie();
    // },

    ListMovie() {
      this.loading = true;
      this.movies = [];
      var movie ={
        idAccount: this.idAccount, 
        page: this.currentPage
      }
      getFavorites(
        movie,
        (dat) => {
          console.log(dat)
          if (dat.data.status === "success") {
            this.movies = dat.data.data;
            this.movies = dat.data.data.map(m => ({
            ...m,
            isFavorite: true // vì đang ở trang favorite
          }));
          } else {
            this.MessageErr = dat.data.message;
          }
          this.loading = false;
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
      // const favorites = getFavorites();

      //   if (favorites && favorites.length > 0) {
      //     this.movies = favorites
      //     this.loading = false;
          
      //   } else {
      //     this.MessageErr = this.$t("Bạn không có dữ liệu nào được lưu");
      //     this.loading = false;
      //   }

    },
    getOptimizedImage(imagePath) {
      return `${ this.urlImage +  encodeURIComponent(imagePath) }`;
    },


    applyFilters() {
      this.currentPage = 1;
      this.ListMovie();
      this.showFilter= false
      
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
    idAccount(){
      return (
        this.$store.state.empInfor.ID || localStorage.getItem("name")

      )

    }
  },
  watch: {
    currentPage() {
      this.loading = true;
      this.ListMovie();
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
.title:hover {
  color: orange;
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
.filter-bar {
  background: #1f1f2a;
  color: #fff;
  border-radius: 12px;
}
.v-select,
.v-text-field {
  color: white;
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
</style>
  
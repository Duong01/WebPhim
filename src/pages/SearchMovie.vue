<template>
  <div class="search-page container mt-4">
    <h2 class="text-center text-light mb-4">Kết quả tìm kiếm cho "{{ $route.query.keyword }}"</h2>
    <hr/>
    <b-spinner v-if="loading" label="Loading..."></b-spinner>
    <b-row v-else>
      <b-col v-for="movie in movies" :key="movie.id" md="12" class="mb-4">
        <router-link :to="{ name: 'MovieDetail', params: { slug: movie.slug } }" class="text-decoration-none">
          <b-card no-body class="movie-card d-flex flex-row">
            <div class="position-relative">
              <b-card-img
                :src="`${urlImage}${movie.poster_url}`"
                alt="Movie Image"
                class="movie-image"
                loading="lazy"
              ></b-card-img>
              <div class="rating-badge bg-warning text-dark">
                {{ movie.quality }}
              </div>
            </div>
            
            <b-card-body class="d-flex flex-column justify-content-between">
              <div>
                <h3 class="text-light mb-3">{{ movie.name }}</h3>
                
                <div class="genre-section mb-2">
                  <div v-for="(genre, index) in movie.category" :key="index" class="text-light genre-item">
                    {{ genre.name }}
                  </div>
                </div>

                <div class="meta-info mb-3">
                  <el-rate class="text-light" v-model="valueRate" disabled />
                  <span class="text-light me-3">{{ movie.year }}</span>
                  <!-- <span class="text-light">{{ movie.episode_current }} tập</span> -->
                </div>

                <p class="text-muted description-text">{{ movie.description }}</p>
              </div>

              <div class="action-buttons mt-3">
                <b-button variant="outline-light" class="me-2">
                  <i class="fas fa-play me-2"></i>Xem
                </b-button>
                <b-button variant="outline-light">
                  <i class="fas fa-share me-2"></i>Chia sẻ
                </b-button>
              </div>
            </b-card-body>
          </b-card>
        </router-link>
      </b-col>

      <!-- Phân trang -->
      <b-pagination
        v-model="currentPage"
        :total-rows="totalMovies"
        :per-page="moviesPerPage"
        class="justify-content-center mt-3"
        @change="fetchMovies"
      />
    </b-row>

    <b-alert v-if="movies.length < 0" variant="warning" show class="text-center text-dark">
      Không tìm thấy phim nào khớp với từ khóa "<strong>{{ $route.query.keyword }}</strong>".
    </b-alert>
  </div>
</template>

<script>
import {Search,urlImage} from '@/model/api'
export default {
  name: 'SearchMovie',
  data(){
    return{
        movies: [],
        loading: true,
        urlImage: urlImage,
        currentPage:1,
        moviesPerPage:20,
        totalMovies:100,
        valueRate: 5,
        path: ''
    }
  },
  watch: {
    "$route.query.keyword": {
      immediate: true,
      handler(query) {
        this.loading = true
        this.path = query
        this.SearchMovie(query);
      },

    },
    currentPage(newpage){
        this.loading = true
        this.currentPage = newpage
        this.SearchMovie(this.path);
      },
  },
  methods:{
    SearchMovie(query){
        Search({keyword: query+`?page=${this.currentPage}`}, (result) =>{
          if(result.status == 'success'){
            this.movies = result.data.items
            this.loading = false
          }
        console.log(result)
      },(err) =>{
        console.log(err)
      })
    }
  },
}
</script>

<style scoped>
.search-page {
  background-color: #1a1a1a;
  min-height: 100vh;
  padding: 2rem 0;
}

.movie-card {
  background-color: #2d2d2d;
  border: none;
  border-radius: 8px;
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: translateY(-3px);
}

.movie-image {
  width: 440px;
  height: 250px;
  object-fit: cover;
  border-radius: 8px 0 0 8px;
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
  background-color: #837676;
  border-radius: 5px;
  font-size: 0.9rem;
  opacity: 0.8;
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
</style>
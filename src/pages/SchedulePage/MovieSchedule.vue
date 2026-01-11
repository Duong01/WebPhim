<template>
  <v-container fluid class="schedule-page">

    <!-- HEADER -->
    <div class="schedule-header">
      <v-icon color="cyan">mdi-filmstrip</v-icon>
      <span>LỊCH CHIẾU PHIM</span>
    </div>

    <!-- TAB NGÀY -->
    <div class="day-tabs">
      <v-btn
        v-for="d in days"
        :key="d.value"
        :class="['day-btn', { active: daily === d.value }]"
        @click="changeDay(d.value)"
        rounded
      >
        {{ d.label }}
      </v-btn>
    </div>

    <!-- PHIM CHIẾU SỚM -->
    <v-card class="schedule-box">
      <div class="section-title">
        ⭐ PHIM CHIẾU SỚM
      </div>

      <v-row v-if="earlyMovies.length" dense>
        <v-col
          v-for="(movie, index) in earlyMovies"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="mx-auto movie-item simple-hover" flat @click="goMovie(movie.slug)">
            <div class="card-poster">
              <v-img
                :src="'https://hoathinh3d.vn'+movie.thumbnail"
                aspect-ratio="2/3"
                cover
                
                loading="lazy"
                class="movie-thumb"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="grey-lighten-4"
                      indeterminate
                    ></v-progress-circular>
                  </div>
                </template>
              </v-img>

            </div>

            <!-- Giờ chiếu -->
            <div class="early-time">
              {{ movie.broadcast_time }}
            </div>

            <!-- Thông tin -->
            <div class="movie-info">
              <div class="movie-name">
                {{ movie.title }}
              </div>
              <div class="movie-ep">
                📺 Tập {{ movie.current_episode }}
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <div v-else class="empty-text">Không có phim chiếu sớm</div>
    </v-card>

    <!-- PHIM THƯỜNG -->
    <!-- <v-card class="schedule-box" >
      <v-row v-if="regularMovies.length">
        <v-col
          v-for="(movie, index) in regularMovies"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card v-if="movie" class="mx-auto movie-item simple-hover" flat @click="goMovie(movie.permalink)">
            <v-img
              :src="movie.thumbnail"
              aspect-ratio="2/3"
              cover
              class="movie-thumb"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    color="grey-lighten-4"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </template>
            </v-img>

            <div class="movie-info">
              <div class="movie-name">{{ movie.title }}</div>
              <div class="movie-ep">📺 Tập {{ movie.latest_episode }}</div>
            </div>
          </v-card>

          <v-skeleton-loader
            v-else
            type="image, text"
            height="120"
          />
        </v-col>
      </v-row>
      <div v-else class="empty-text">Không có phim chiếu sớm</div>
    </v-card> -->

  </v-container>
</template>

<script>
import { CategorisDetail } from "@/model/api";
export default {
  name: "MovieSchedule",
  data() {
    return {
      daily: "",
      earlyMovies: [],
      regularMovies: [],
      days: [
        { label: "Chủ Nhật", value: "0" },
        { label: "Thứ Hai", value: "1" },
        { label: "Thứ Ba", value: "2" },
        { label: "Thứ Tư", value: "3" },
        { label: "Thứ Năm", value: "4" },
        { label: "Thứ Sáu", value: "5" },
        { label: "Thứ Bảy", value: "6" },
      ],
    };
  },
  mounted() {
    
    const todayIndex = new Date().getDay();
    this.daily = this.days[todayIndex].value;
    console.log(this.daily)
    this.ListMovie();
  },
  
  methods: {
    changeDay(day) {
      this.daily = day;
      this.ListMovie();
    },
    ListMovie() {
      CategorisDetail(`?action=getSchedule&day=${this.daily}`,(dat)=>{
        if(dat.success == true){
            this.earlyMovies = dat.movies
            // this.regularMovies = dat.movies
        }
        console.log(dat)
      },(err)=>{
        console.log(err)

      })
      
    },
    goMovie(url) {
      var slug = url.split('/').pop()
      this.$router.push({
        name : 'Movies',
        params: {slug}
      })
    }
    
    
  },
  
};
</script>

<style scoped>
.schedule-page {
  background: #1c1c1c;
  color: #fff;
}
.card-poster {
    width: 100px;
    height: 140px;
    flex-shrink: 0;
    position: relative;
}
.schedule-header {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin: 20px 0;
  color: #00e5ff;
}

.day-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.day-btn {
    min-width: unset; 
  white-space: nowrap;
  background: #2a2a2a;
  color: #ccc;
}

.day-btn.active {
  border: 1px solid #00e5ff;
  color: #00e5ff;
}

.schedule-box {
  background: #262626;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.section-title {
  text-align: center;
  color: #ffcc00;
  margin-bottom: 16px;
  font-weight: bold;
}

.early-card {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  overflow: visible; 
}

.early-time {
  position: absolute;
  top: -3px;
  left: -5px;
  background: #ffb300;
  color: #000;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: bold;
}

.movie-item {
  display: flex;
    background: #252525;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    border: 1px solid #333;
}

.movie-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;

  display: -webkit-box;
  -webkit-line-clamp: 2;     /* số dòng */
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.movie-ep {
  font-size: 14px;
  color: #b7dff7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-text {
  text-align: center;
  color: #777;
}

.movie-thumb {
  border-radius: 10px;
}
.movie-item .v-img {
  min-width: 100px;
  height: 250px;
  object-fit: cover;
}

.movie-info {
  padding: 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}
.early-thumb {
  width: 80px;
  height: 150px;
  object-fit: cover;
}
.simple-hover {
  cursor: pointer;
  border-radius: 12px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.simple-hover:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
}
</style>


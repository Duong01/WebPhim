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

      <v-row v-if="earlyMovies.length">
        <v-col
            v-for="(movie, index) in earlyMovies"
            :key="index"
            cols="12"
            sm="6"
            md="4"
        >
          <v-card class="early-card" flat>
            

            <v-img
              :src="movie.thumbnail"
              aspect-ratio="2/3"
              cover
              class="early-thumb"
            >
              <template #placeholder>
                <v-progress-circular indeterminate />
              </template>
              
            </v-img>
            <div class="early-time">
              {{ movie.early_screening_time }}
            </div>
            <div>
              <div class="movie-name">{{ movie.title }}</div>
              <div class="movie-ep">📺 Tập {{ movie.latest_episode }}</div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <div v-else class="empty-text">Không có phim chiếu sớm</div>
    </v-card>

    <!-- PHIM THƯỜNG -->
    <v-card class="schedule-box" >
      <v-row v-if="regularMovies.length">
        <v-col
          v-for="(movie, index) in regularMovies"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <!-- Có dữ liệu -->
          <v-card v-if="movie" class="movie-item" flat>
            <v-img
              :src="movie.thumbnail"
              aspect-ratio="2/3"
              cover
              class="movie-thumb"
            >
              <template #placeholder>
                <v-progress-circular indeterminate />
              </template>
            </v-img>

            <div class="movie-info">
              <div class="movie-name">{{ movie.title }}</div>
              <div class="movie-ep">📺 Tập {{ movie.latest_episode }}</div>
            </div>
          </v-card>

          <!-- Skeleton -->
          <v-skeleton-loader
            v-else
            type="image, text"
            height="120"
          />
        </v-col>
      </v-row>
      <div v-else class="empty-text">Không có phim chiếu sớm</div>
    </v-card>

  </v-container>
</template>

<script>
import { CategorisDetail } from "@/model/api";
export default {
  name: "MovieSchedule",
  data() {
    return {
      url: "v1/daily",
      daily: "",
      earlyMovies: [],
      regularMovies: [],
      days: [
        { label: "Chủ Nhật", value: "chu-nhat" },
        { label: "Thứ Hai", value: "thu-hai" },
        { label: "Thứ Ba", value: "thu-ba" },
        { label: "Thứ Tư", value: "thu-tu" },
        { label: "Thứ Năm", value: "thu-nam" },
        { label: "Thứ Sáu", value: "thu-sau" },
        { label: "Thứ Bảy", value: "thu-bay" },
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
      CategorisDetail(`${this.url}?day=${this.daily}`,(dat)=>{
        if(dat.success == true){
            this.earlyMovies = dat.early_movies
            this.regularMovies = dat.regular_movies
        }
        console.log(dat)
      },(err)=>{
        console.log(err)

      })
      
    },
    
    
  },
  
};
</script>

<style scoped>
.schedule-page {
  background: #1c1c1c;
  color: #fff;
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
  flex-direction: column;
  width: 100%;
  position: relative;
  overflow: visible; 
}

.early-time {
  position: absolute;
  top: -10px;
  left: -10px;
  background: #ffb300;
  color: #000;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: bold;
}

.movie-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #2b2b2b;
  border-radius: 10px;
}

.movie-name {
  font-weight: 600;
}

.movie-ep {
  color: #00e5ff;
  font-size: 13px;
}

.empty-text {
  text-align: center;
  color: #777;
}

.movie-thumb {
  max-height: 260px;
  border-radius: 8px;
}
.movie-item {
  display: flex;
  flex-direction: column;
}
.movie-item .v-img {
  height: 260px;
  object-fit: cover;
}
.early-card {
  display: flex;
  gap: 12px;
}

.early-thumb {
  width: 120px;
  height: 180px;
  flex-shrink: 0;
  border-radius: 6px;
}

</style>


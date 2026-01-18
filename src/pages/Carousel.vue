<template>
  <v-container fluid class="pa-0">
    <div v-if="isLoading || !videoList.length" class="default-placeholder">
      <v-skeleton-loader
        type="image, article"
        height="550"
        class="rounded-lg"
      />
      
    </div>
    <v-carousel
      v-else
      height="550"
      hide-delimiters="false"
      delimiter-icon="mdi-circle"
      delimiter-size="10"
      delimiter-color="rgba(255, 255, 255, 0.6)"
      show-arrows="hover"
      cycle
      interval="9000"
      class="custom-carousel responsive-carousel"
    >
      <v-carousel-item
        v-for="(item) in videoList"
        :key="item._id"
      >
        <div class="carousel-wrapper">
          <v-img
            :src="pathImage + item.thumb_url"
            :lazy-src="pathImage + item.thumb_url"
            cover
            height="100%"
            class="carousel-image"
          >
            <div class="carousel-overlay"></div>
          </v-img>
          
          <!-- Content Info -->
          <div class="carousel-content">
            <div class="carousel-text-wrapper">
              <h2 class="carousel-title">{{ item.name }}</h2>
              <p class="carousel-origin">{{ item.origin_name || $t('Không có mô tả.') }}</p>
              
              <div class="carousel-meta">
                <span class="meta-item">
                  <v-icon size="16">mdi-calendar</v-icon>
                  {{ item.year }}
                </span>
                <span class="meta-separator">•</span>
                <span class="meta-item">
                  <v-icon size="16">mdi-star</v-icon>
                  {{ item.rating || 'N/A' }}
                </span>
                <span class="meta-separator">•</span>
                <span class="meta-item">
                  <v-icon size="16">mdi-clock</v-icon>
                  {{ item.time || 'N/A' }}
                </span>
              </div>
              
              <div class="carousel-genres">
                <span v-for="(cat, idx) in item.category.slice(0, 3)" :key="idx" class="genre-tag">
                  {{ cat.name }}
                </span>
              </div>
            </div>
            
            <v-btn
              color="#ffc107"
              variant="flat"
              size="large"
              class="carousel-btn"
              @click="goToDetail(item.slug)"
            >
              <v-icon left>mdi-play</v-icon>
              {{$t('Xem ngay')}}
            </v-btn>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
import { ListMovieByCate,urlImage1 } from "@/model/api";

export default {
  name: "CarouselPage",
  data() {
    return {
      pathImage: urlImage1 + "https://phimimg.com/",
      videoList: [],
      path: "hoat-hinh",
    };
  },
  async created() {
    await this.ListMovie();
  },
  methods: {
    ListMovie() {
      ListMovieByCate(`${this.path}?page=1&sort_field=modified.time&sort_type=desc&country=trung-quoc&limit=6`, (result) => {
        if (result.status === "success" || result.status == true) {
          // Giả sử dữ liệu có rating, duration, short_description
          this.videoList = result.data.items.slice(0, 5).map(item => ({
            ...item,
            rating: item.rating || null,
            duration: item.duration || null,
            short_description: item.short_description || null,
          }));
        }
      }, (err) => {
        console.error(err);
      });
    },
    goToDetail(slug) {
      this.$router.push({ name: "Movies", params: { slug } });
    },
  },
};
</script>

<style scoped>
.custom-carousel {
  position: relative;
  background-color: #111;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.carousel-image {
  position: absolute;
  inset: 0;
  filter: brightness(0.75);
  transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.carousel-wrapper:hover .carousel-image {
  filter: brightness(0.95);
}

.carousel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  z-index: 2;
}

.carousel-content {
  position: relative;
  z-index: 3;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 20px;
  min-height: 220px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 40%,
    transparent 100%
  );
  animation: slideUpContent 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUpContent {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.carousel-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: fadeInUp 0.6s ease-out 0.1s backwards;
  width: 100%;
  max-width: 600px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.carousel-title {
  font-size: clamp(20px, 5vw, 48px);
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: left;
  word-break: break-word;
}

.carousel-origin {
  font-size: clamp(12px, 2vw, 16px);
  color: #e0e0e0;
  margin: 0;
  opacity: 0.9;
  line-height: 1.4;
  font-weight: 500;
  text-align: left;
}

.carousel-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: clamp(11px, 1.5vw, 14px);
  color: #b0b0b0;
  justify-content: flex-start;
  width: 100%;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.meta-item:hover {
  background: rgba(255, 23, 68, 0.2);
  color: #ffb3ba;
}

.meta-separator {
  opacity: 0.3;
}

.carousel-genres {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
}

.genre-tag {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(255, 23, 68, 0.15);
  border: 1px solid rgba(255, 23, 68, 0.3);
  color: #ffb3ba;
  border-radius: 20px;
  font-size: clamp(10px, 1.2vw, 12px);
  font-weight: 600;
  transition: all 0.3s ease;
}

.genre-tag:hover {
  background: rgba(255, 23, 68, 0.3);
  border-color: rgba(255, 23, 68, 0.6);
  transform: translateY(-2px);
}

.carousel-btn {
  align-self: flex-start;
  padding: 12px 32px !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  border-radius: 30px !important;
  box-shadow: 0 6px 20px rgba(255, 23, 68, 0.4) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  animation: fadeInUp 0.6s ease-out 0.2s backwards;
}

.carousel-btn:hover {
  background-color: #ff5252 !important;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(255, 23, 68, 0.6) !important;
}

.carousel-btn:active {
  transform: scale(0.95);
}

.v-carousel__controls__item {
  background-color: rgba(255, 255, 255, 0.3) !important;
  transition: all 0.3s ease !important;
  border-radius: 50% !important;
}

.v-carousel__controls__item.v-carousel__controls__item--active {
  background-color: #ff1744 !important;
  box-shadow: 0 0 12px rgba(255, 23, 68, 0.6);
}

.custom-carousel .v-carousel__controls__prev,
.custom-carousel .v-carousel__controls__next {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.custom-carousel:hover .v-carousel__controls__prev,
.custom-carousel:hover .v-carousel__controls__next {
  opacity: 1;
}

/* RESPONSIVE DESIGN */
@media (max-width: 1200px) {
  .carousel-content {
    padding: 24px;
    min-height: 180px;
  }
  
  .carousel-title {
    font-size: 32px;
  }
  
  .carousel-origin {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .custom-carousel {
    border-radius: 8px;
  }
  
  .responsive-carousel {
    height: 400px !important;
  }
  
  .carousel-content {
    padding: 20px;
    min-height: 140px;
    gap: 16px;
  }
  
  .carousel-title {
    font-size: 24px;
  }
  
  .carousel-origin {
    font-size: 12px;
  }
  
  .carousel-meta {
    font-size: 12px;
    gap: 6px;
  }
  
  .meta-item {
    padding: 3px 6px;
  }
  
  .carousel-genres {
    gap: 6px;
  }
  
  .genre-tag {
    padding: 4px 10px;
    font-size: 10px;
  }
  
  .carousel-btn {
    padding: 10px 24px !important;
    font-size: 12px !important;
  }
}

@media (max-width: 480px) {
  .custom-carousel {
    border-radius: 6px;
  }
  
  .responsive-carousel {
    height: 320px !important;
  }
  
  .carousel-content {
    padding: 16px;
    min-height: 120px;
    gap: 12px;
  }
  
  .carousel-title {
    font-size: 18px;
    letter-spacing: 0.5px;
  }
  
  .carousel-origin {
    font-size: 11px;
    max-height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .carousel-meta {
    font-size: 11px;
    gap: 4px;
  }
  
  .meta-item {
    padding: 2px 4px;
  }
  
  .carousel-genres {
    gap: 4px;
  }
  
  .genre-tag {
    padding: 3px 8px;
    font-size: 9px;
  }
  
  .carousel-btn {
    padding: 8px 20px !important;
    font-size: 11px !important;
  }
  
  .v-carousel__controls {
    bottom: 10px !important;
  }
}

</style>

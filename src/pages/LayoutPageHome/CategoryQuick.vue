<template>

<div style="margin-top: 10px;">
      <v-row no-gutters class="align-center mb-2">
        <v-col cols="12">
          <h1 class="category-title d-flex align-center">
            <v-icon size="20" class="mr-2"
              >mdi-filmstrip</v-icon
            >
            {{$t('Bạn muốn xem gì?')}}
          </h1>
        </v-col>
      </v-row>

      <div class="ad-banner-container">
        <router-link
          v-for="(item, index) in items"
          :key="index"
          :to="item.link"
          class="ad-banner-card"
          :class="`ad-banner-${index}`"
        >
          <div class="ad-banner-content">
            <v-icon class="ad-banner-icon">{{ getIconForCategory(item.title) }}</v-icon>
            <div class="ad-banner-text">
              <h3 class="ad-banner-title">{{ item.title }}</h3>
              <p class="ad-banner-subtitle">{{$t('Khám phá ngay')}}</p>
            </div>
            <v-icon class="ad-banner-arrow">mdi-arrow-right</v-icon>
          </div>
          <div class="ad-banner-bg"></div>
        </router-link>
      </div>
    </div>

</template>

<script>
export default{
props:["items"],
methods:{
    getIconForCategory(title) {
      const iconMap = {
        'PHIM MỚI': 'mdi-star-outline',
        'PHIM BỘ': 'mdi-play-circle-outline',
        'PHIM TRUNG QUỐC': 'mdi-flag-outline',
        'PHIM LẺ': 'mdi-movie-outline',
        'PHIM TÌNH CẢM': 'mdi-heart-outline'
      };
      return iconMap[title] || 'mdi-filmstrip';
    },
}
}
</script>

<style scoped>

/* AD BANNER STYLES */
.ad-banner-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: clamp(10px, 1.5vw, 16px);
  padding: 12px 4px;
  margin: 10px 0 20px 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  -webkit-overflow-scrolling: touch;
}

.ad-banner-container::-webkit-scrollbar {
  height: 4px;
}
.ad-banner-container::-webkit-scrollbar-track {
  background: transparent;
}
.ad-banner-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.ad-banner-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(12px, 2vw, 20px) clamp(14px, 2.5vw, 24px);
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  min-height: clamp(80px, 10vw, 110px);
  min-width: clamp(150px, 22vw, 240px); /* Tự động nhỏ lại trên mobile */
  flex: 1 0 auto; /* Không cho rớt dòng */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  background: rgba(255,255,255,.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,.08);
  transition:
    transform .4s cubic-bezier(.22,1,.36,1),
    box-shadow .4s ease;
}

.ad-banner-card:hover {
   transform: translateY(-8px);
  box-shadow:
    0 20px 40px rgba(0,0,0,.6);
}

.ad-banner-card:active {
  transform: scale(0.98);
}

.ad-banner-bg {
  position: absolute;
  inset: 0;
  background-size: 300% 300%;
  animation: gradientShift 8s ease infinite;
  z-index: 0;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.ad-banner-0 .ad-banner-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
}

.ad-banner-1 .ad-banner-bg {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f093fb 100%);
}

.ad-banner-2 .ad-banner-bg {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #4facfe 100%);
}

.ad-banner-3 .ad-banner-bg {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 50%, #fa709a 100%);
}

.ad-banner-4 .ad-banner-bg {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 50%, #30cfd0 100%);
}

.ad-banner-content {
  color: #fff;
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.5vw, 16px);
  position: relative;
  z-index: 1;
  width: 100%;
  white-space: normal;
}

.ad-banner-icon {
  flex-shrink: 0;
  font-size: clamp(28px, 4vw, 40px) !important;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.ad-banner-text {
  color: #fff;
  flex: 1;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.ad-banner-title {
  font-size: clamp(13px, 2vw, 18px);
  font-weight: 800;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  line-height: 1.2;
}

.ad-banner-subtitle {
  font-size: clamp(11px, 1.5vw, 12px);
  margin: 0;
  opacity: 0.95;
  font-weight: 500;
}

.ad-banner-arrow {
  flex-shrink: 0;
  font-size: clamp(20px, 3vw, 28px) !important;
  opacity: 0.8;
  transition: transform 0.3s ease;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.ad-banner-card:hover .ad-banner-arrow {
  transform: translateX(6px);
  opacity: 1;
}

/* Ẩn mũi tên trên mobile nếu không đủ chỗ */
@media (max-width: 600px) {
  .ad-banner-arrow {
    display: none;
  }
}
.trending-track,
.ad-banner-container {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* iOS mượt hơn */
}
.movie-card,
.trending-card,
.ad-banner-card {
  will-change: transform;
  transform: translateZ(0);
}
.page-enter {
  min-height: 100vh;
  background:
    radial-gradient(circle at 15% 10%, rgba(255,255,255,0.05), transparent 40%),
    radial-gradient(circle at 85% 0%, rgba(255,255,255,0.04), transparent 40%),
    linear-gradient(to bottom, #111 0%, #0a0a0a 40%, #000 100%);
}
.movie-list:hover .movie-card {
  /* opacity: .45; */
  transform: scale(.96);
}

.movie-list .movie-card:hover {
  opacity: 1 !important;
  transform: translateY(-12px) scale(1.1);
}
@keyframes fadeUpModern {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
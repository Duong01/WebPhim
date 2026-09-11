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
  border-radius: 18px;
  overflow: hidden;
  text-decoration: none;
  cursor: pointer;
  min-height: clamp(80px, 10vw, 110px);
  min-width: clamp(150px, 22vw, 240px);
  flex: 1 0 auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition:
    transform 0.4s var(--zc-ease),
    box-shadow 0.4s ease,
    border-color 0.4s ease;
}

.ad-banner-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 183, 0, 0.35);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.6), 0 0 26px rgba(255, 140, 0, 0.14);
}

.ad-banner-card:active {
  transform: scale(0.98);
}

.ad-banner-bg {
  position: absolute;
  inset: 0;
  background-size: 300% 300%;
  animation: gradientShift 8s ease infinite;
  opacity: 0.85;
  z-index: 0;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Amber/orange family gradients to match the cinema theme */
.ad-banner-0 .ad-banner-bg {
  background: linear-gradient(135deg, #ffb700 0%, #ff7a18 50%, #ff4d00 100%);
}

.ad-banner-1 .ad-banner-bg {
  background: linear-gradient(135deg, #ff512f 0%, #dd2476 50%, #ff512f 100%);
}

.ad-banner-2 .ad-banner-bg {
  background: linear-gradient(135deg, #f7971e 0%, #ffd200 50%, #f7971e 100%);
}

.ad-banner-3 .ad-banner-bg {
  background: linear-gradient(135deg, #e65c00 0%, #f9d423 50%, #e65c00 100%);
}

.ad-banner-4 .ad-banner-bg {
  background: linear-gradient(135deg, #b44d12 0%, #f2681f 50%, #b44d12 100%);
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
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.ad-banner-text {
  color: #fff;
  flex: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
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
  opacity: 0.85;
  transition: transform 0.3s var(--zc-ease);
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.ad-banner-card:hover .ad-banner-arrow {
  transform: translateX(6px);
  opacity: 1;
}

/* Hide arrow on mobile */
@media (max-width: 600px) {
  .ad-banner-arrow {
    display: none;
  }
}

.trending-track,
.ad-banner-container {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.movie-card,
.trending-card,
.ad-banner-card {
  will-change: transform;
  transform: translateZ(0);
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

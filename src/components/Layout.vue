<template>
  <div>
    <!-- Header (Thanh điều hướng) -->
    <header class="fixed-header">
      <header-component />
    </header>
    <transition name="progress-fade">
      <v-progress-linear
        v-if="$store.getters['loading/isLoading']"
        color="blue-darken-3"
        indeterminate
        height="3"
        class="global-progress"
      />
    </transition>

    <div class="main">
      <div class="content">
        
        <router-view v-slot="{ Component, route }">
          <transition name="page-fade" mode="out-in">
            <keep-alive :max="10" exclude="MoviesPage,FavoritePage">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
    <hr/>
    <!-- Footer (Chân trang) -->
    <footer>
      <footer-component />
    </footer>
    <el-backtop :right="18" :bottom="120" />
  </div>
</template>

<script>
import imgloading from "@/assets/biu.jpg";
import HeaderComponent from '../components/Header.vue'
import FooterComponent from '../components/Footer.vue'
export default {
  name: "LayoutPage",
  data() {
    return {
      imgloading: imgloading,
      isLoading1: true,
    };
  },
  components:{
    HeaderComponent,
    FooterComponent
  }
};
</script>

<style scoped>
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: rgb(2, 2, 2);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
}

.main {
  display: flex;
  justify-content: center;
}

.content {
  width: 90%;
}

/* mobile */
@media (max-width: 768px) {
  .content {
    width: 100%;
  }
}

/* Ghim thanh loading ngay dưới Header */
.global-progress {
  position: fixed;
  top: 64px;
  left: 0;
  z-index: 1001;
  width: 100%;
}

/* Hiệu ứng chuyển trang tối ưu: chỉ dùng Opacity để nhẹ cho thiết bị yếu */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: 
    opacity 0.25s ease,
    transform 0.25s ease,
    filter 0.25s ease;
  will-change: opacity, transform;
}

/* Trang mới xuất hiện */
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.995);
  filter: blur(2px);
}

/* Trang cũ biến mất */
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.995);
  filter: blur(2px);
}

.progress-fade-enter-active,
.progress-fade-leave-active {
  transition: opacity 0.3s ease;
}
.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
}
</style>
<template>
  <div>
    <!-- Header (Thanh điều hướng) -->
    <header class="fixed-header">
      <header-component />
    </header>
    <v-progress-linear
      v-if="$store.getters['loading/isLoading']"
      color="blue-darken-3"
      indeterminate
      height="3"
      class="global-progress"
    />

    <div class="main">
      <div class="content">
        
        <router-view v-slot="{ Component, route }">
          <transition name="fade-slide" mode="out-in">
            <keep-alive :max="15" exclude="MoviesPage,MovieDetail">
              <component :is="Component" :key="route.name === 'MovieDetail' ? route.path : route.fullPath" />
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

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
}
</style>
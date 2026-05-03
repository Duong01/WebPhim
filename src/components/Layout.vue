<template>
  <div>
    <!-- Header (Thanh điều hướng) -->
    <header class="fixed-header">
      <header-component />
    </header>
    <!-- <transition name="progress-fade">
      <v-progress-linear
        v-if="$store.getters['loading/isLoading']"
        color="blue-darken-3"
        indeterminate
        height="3"
        class="global-progress"
      />
    </transition> -->

    <div class="main">
      <div class="content">
        
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in" @after-enter="handleAfterEnter">
          <keep-alive :max="10" exclude="FavoritePage">
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
  },
  methods: {
    handleAfterEnter() {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0)
      })
    }
  },
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


.progress-fade-enter-active,
.progress-fade-leave-active {
  transition: opacity 0.3s ease;
}
.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
}
/* ===== PAGE TRANSITION (PRO LEVEL) ===== */

.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform, filter;
}

/* Trang mới vào */
.page-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
  filter: blur(8px);
}

/* Trang hiện tại rời đi */
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(1.02);
  filter: blur(6px);
}

/* Trạng thái bình thường */
.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}
.page-enter-active,
.page-leave-active {
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>
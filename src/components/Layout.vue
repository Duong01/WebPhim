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
          <transition name="page" mode="out-in" >
          <keep-alive :max="10" :include="cachedViews">
            <component :is="Component" :key="route.name" />
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
  computed: {
  cachedViews() {

    return this.$router.getRoutes()
      .filter(r => r.meta?.keepAlive)
      .map(r => r.name)
  }
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
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

</style>
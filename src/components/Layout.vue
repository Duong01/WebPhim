<template>
  <div>
    <!-- Header (Thanh điều hướng) -->
    <header class="fixed-header">
      <header-component />
    </header>

    <div class="main">
  <div class="content">

    <router-view v-slot="{ Component, route }">

      <transition
        name="fade-page"
        mode="out-in"
      >
        <keep-alive :include="cachedViews" :max="10">
          <component
            :is="Component"
            :key="route.fullPath"
            class="page-component"
          />
        </keep-alive>
      </transition>

    </router-view>

  </div>
</div>
    <!-- Footer (Chân trang) -->
    <footer>
      <footer-component />
    </footer>
    <el-backtop :right="18" :bottom="120" />
  </div>
</template>

<script>
import HeaderComponent from '../components/Header.vue'
import FooterComponent from '../components/Footer.vue'
export default {
  name: "LayoutPage",
  data() {
    return {
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
  background: transparent;
}

.main {
  display: flex;
  justify-content: center;
}

.content {
 width: 92%;
 max-width: 1560px;
 overflow-x: hidden;
}

/* mobile */
@media (max-width: 768px) {
  .content {
    width: 100%;
  }
}

.page-component {
  will-change: opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>

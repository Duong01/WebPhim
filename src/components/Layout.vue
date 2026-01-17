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
    />

    <div class="main">
      <div class="content">
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component
              v-if="route.meta.keepAlive"
              :is="Component"
            />
          </keep-alive>

          <component
            v-if="!route.meta.keepAlive"
            :is="Component"
          />
        </router-view>
      </div>
    </div>
    <hr/>
    <!-- Footer (Chân trang) -->
    <footer>
      <footer-component />
    </footer>
    <el-backtop :right="10" :bottom="70" />
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
  padding: 0 15px 0 15px;
  display: flex;
  justify-content: center;
}

.content {
  width: 80%;
}

/* mobile */
@media (max-width: 768px) {
  .content {
    width: 100%;
  }
}

</style>
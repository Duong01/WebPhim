<template>
  <v-theme-provider :theme="theme" with-background>
    <v-app id="app" :style="{ color: theme === 'dark' ? 'white' : 'black' }">
      <v-main>
        <router-view v-slot="{ Component, route }">
          <!-- Component cần cache -->
          <keep-alive>
            <component
              v-if="route.meta.keepAlive"
              :is="Component"
            />
          </keep-alive>

          <!-- Component không cache -->
          <component
            v-if="!route.meta.keepAlive"
            :is="Component"
          />
        </router-view>
        
        <v-snackbar v-model="showError" color="red" timeout="3000">
        {{ errorMessage }}
      </v-snackbar>
      </v-main>
    </v-app>
  </v-theme-provider>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: 'App',
  data(){
    return{
      theme: localStorage.getItem('theme') || 'dark',
      showError: false,
      errorMessage: ''
    }
  },
  computed: {
    ...mapState("loading", ["isLoading"]),
  },
  
   provide() {
    return {
      currentTheme: () => this.theme,
      setTheme: this.setTheme
    }
  },
  watch: {
      theme(newVal) {
        localStorage.setItem('theme', newVal)
      }
    },
  mounted(){
    const loginTime = localStorage.getItem("loginTimestamp");
    if (loginTime) {
    // const now = Date.now();
    // const diff = now - Number(loginTime);
    // const oneDay = 24 * 60 * 60 * 1000;

    // if (diff > oneDay) {
    //   localStorage.removeItem("name");
    //   localStorage.removeItem("loginTimestamp");
    //   // Nếu cần, xóa luôn thông tin trong Vuex store:
    //   this.$store.commit("setEmpInfor", null);
    // }
  }
  
  this.$bus.$on("show-error", (msg) => {
      this.errorMessage = msg;
      this.showError = true;
    });
    
  },
  
  created() {
  // const expireAt = localStorage.getItem("expireAt");
  // const now = new Date().getTime();

  // if (expireAt && now > parseInt(expireAt)) {
  //   // Đã hết hạn → xóa dữ liệu
  //   localStorage.removeItem("name");
  //   localStorage.removeItem("expireAt");
  //   this.$store.commit("setEmpInfor", null);

  // }
},
  methods: {
    setTheme(newTheme) {
      this.theme = newTheme
    }
    
  }
}
</script>

<style>
#app {
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
 
}
.v-btn {
  text-transform: none !important;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 9999;
}
.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #42b983;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

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
      

      <!-- Chatbot Component -->
      <Chatbot />
    </v-app>
  </v-theme-provider>
</template>

<script>
import { mapState } from "vuex";
import Chatbot from "@/components/Chatbot.vue";

export default {
  name: 'App',
  components: { Chatbot },
  data(){
    return{
      theme: localStorage.getItem('theme') || 'dark',
      showError: false,
      errorMessage: '',
      
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
  mounted() {
    // kiem tra khi ma het session thi tu dong load lai trang
  document.addEventListener("visibilitychange", this.handleVisibility)
  window.addEventListener("pageshow", this.handlePageShow)
  
},
beforeUnmount() {
  
  document.removeEventListener("visibilitychange", this.handleVisibility)
  window.removeEventListener("pageshow", this.handlePageShow)
  
},
  methods: {
    setTheme(newTheme) {
      this.theme = newTheme
    },
    handleVisibility() {
    if (document.visibilityState === "visible") {
      this.$store.dispatch("checkResume")
    }
  },

  handlePageShow(e) {
    if (e.persisted) {
      this.$store.dispatch("checkResume")
    }
  },

  
    
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

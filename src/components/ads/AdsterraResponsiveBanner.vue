<template>
  <div class="responsive-banner">
    <AdsterraBanner320x50 v-if="bannerType === '320x50'" />

    <AdsterraBanner468x60 v-else-if="bannerType === '468x60'" />

    <AdsterraBanner728x90 v-else-if="bannerType === '728x90'" />
  </div>
</template>

<script>

import AdsterraBanner320x50 from "./AdsterraBanner320x50.vue";
import AdsterraBanner468x60 from "./AdsterraBanner468x60.vue";
import AdsterraBanner728x90 from "./AdsterraBanner728x90.vue";
export default {
  name: "AdsterraResponsiveBanner",

  components: {
    AdsterraBanner320x50,
    AdsterraBanner468x60,
    AdsterraBanner728x90,
  },

  data() {
    return {
      width: window.innerWidth,
    };
  },

  computed: {
    bannerType() {
      if (this.width < 768) {
        return "320x50";
      }

      if (this.width < 1200) {
        return "468x60";
      }

      return "728x90";
    },
  },

  mounted() {
    window.addEventListener("resize", this.onResize);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },

  methods: {
    onResize() {
      this.width = window.innerWidth;
    },
  },
};
</script>

<style scoped>
.responsive-banner {
  width: 100%;
  max-width: 100%;
  min-width: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
}
</style>

<template>
  <div ref="adWrapper" class="adsterra-native">
    <!-- Cố định ID theo đúng mã của Adsterra cung cấp -->
    <div id="container-21e935a6f94addc9f4495622483c0e7b"></div>
  </div>
</template>

<script>
export default {
  name: "AdsterraNative",

  mounted() {
    this.$nextTick(() => {
      this.loadAd();
    });
  },

  methods: {
    loadAd() {
      if (!this.$refs.adWrapper) return;

      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      // Dùng URL hỗ trợ cả HTTP/HTTPS
      script.src =
        "//pl31163701.profitableratecpmnetwork.com/21e935a6f94addc9f4495622483c0e7b/invoke.js";

      // Chèn script trực tiếp vào wrapper của component hiện tại
      this.$refs.adWrapper.appendChild(script);
    },
  },
};
</script>

<style scoped>
.adsterra-native {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.native-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.native-container :deep(*) {
  max-width: 100% !important;
  box-sizing: border-box;
}

.native-container :deep(img),
.native-container :deep(iframe) {
  max-width: 100% !important;
}

</style>
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
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
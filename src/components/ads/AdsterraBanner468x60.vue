<template>
  <div ref="adWrapper" class="adsterra-banner-468"></div>
</template>

<script>
export default {
  name: "AdsterraBanner468",

  mounted() {
    this.$nextTick(() => {
      this.loadAd();
    });
  },

  methods: {
    loadAd() {
      if (!this.$refs.adWrapper) return;

      // 1. Tạo script chứa cấu hình atOptions
      const scriptOptions = document.createElement("script");
      scriptOptions.type = "text/javascript";
      scriptOptions.text = `
        atOptions = {
          'key': '16366a6ccdd24c6ad446bf1d8bc0cc8f',
          'format': 'iframe',
          'height': 60,
          'width': 468,
          'params': {}
        };
      `;

      // 2. Tạo script gọi file invoke.js
      const scriptInvoke = document.createElement("script");
      scriptInvoke.type = "text/javascript";
      scriptInvoke.src =
        "//www.highrevenueformat.com/16366a6ccdd24c6ad446bf1d8bc0cc8f/invoke.js";

      // 3. Chèn cả 2 script vào wrapper của component
      this.$refs.adWrapper.appendChild(scriptOptions);
      this.$refs.adWrapper.appendChild(scriptInvoke);
    },
  },
};
</script>

<style scoped>
.adsterra-banner-468 {
  width: 468px;
  max-width: 100%;
  min-height: 60px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
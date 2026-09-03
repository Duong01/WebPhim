<template>
  <div
    ref="adContainer"
    class="adsterra-native"
  >
    <div :id="containerId"></div>
  </div>
</template>

<script>
let adInstance = 0;

export default {
  name: "AdsterraNative",

  data() {
    return {
      containerId: "",
      scriptSrc:
        "https://pl31163701.profitableratecpmnetwork.com/21e935a6f94addc9f4495622483c0e7b/invoke.js",
    };
  },

  created() {
    adInstance++;

    this.containerId =
      "adsterra-native-" + Date.now() + "-" + adInstance;
  },

  mounted() {
    this.$nextTick(() => {
      this.loadAd();
    });
  },

  methods: {
    loadAd() {
      const script = document.createElement("script");

      script.async = true;
      script.setAttribute("data-cfasync", "false");

      script.src = this.scriptSrc;

      this.$refs.adContainer.appendChild(script);
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
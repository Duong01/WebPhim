<template>
  <AdsterraAd
    :code="adCode"
    container-class="adsterra-banner-728"
  />
</template>

<script>
import AdsterraAd from "./AdsterraAd.vue";
export default {
  name: "AdsterraBanner300x250",

  components: {
    AdsterraAd,
  },

  data() {
    const scriptEnd = "<" + "/script>";

    return {
      adCode: `
        <script>
  atOptions = {
    'key' : '04fa69f27d07ff80834374e9b9d8d90b',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
${scriptEnd}
<script src="https://www.highrevenueformat.com/04fa69f27d07ff80834374e9b9d8d90b/invoke.js">${scriptEnd}
      `,
    };
  },
};
</script>

<style scoped>
.adsterra-banner-728 {
  width: 100%;
  max-width: 728px;
  min-height: 90px;
  margin: 20px auto;
}
</style>
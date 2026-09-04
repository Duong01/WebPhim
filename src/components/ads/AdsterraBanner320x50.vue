<template>
  <AdsterraAd
    :code="adCode"
    container-class="adsterra-banner-320"
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
    'key' : 'a3bf70c1f0be3658066fc86669b8cf0b',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
${scriptEnd}
<script src="https://www.highrevenueformat.com/a3bf70c1f0be3658066fc86669b8cf0b/invoke.js">${scriptEnd}
      `,
    };
  },
};
</script>

<style scoped>
.adsterra-banner-320 {
  width: 100%;
  min-height: 50px;
  max-width: 320px;
  margin: 15px auto;
}
</style>
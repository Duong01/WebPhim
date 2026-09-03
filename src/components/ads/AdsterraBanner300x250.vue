<template>
  <AdsterraAd :code="adCode" container-class="adsterra-banner-300" />
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
    'key' : 'dd6f29ea8c79c97216e8dba997e88398',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
${scriptEnd}
<script src="https://www.highrevenueformat.com/dd6f29ea8c79c97216e8dba997e88398/invoke.js">${scriptEnd}
      `,
    };
  },
};
</script>

<style scoped>
.adsterra-banner-300 {
  width: 100%;
  max-width: 300px;
  min-height: 250px;
  margin: 20px auto;
}
</style>
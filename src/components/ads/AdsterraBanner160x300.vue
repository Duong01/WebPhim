<template>
  <AdsterraAd
    :code="adCode"
    container-class="adsterra-banner-160x300"
  />
</template>

<script>
import AdsterraAd
  from './AdsterraAd.vue'

export default {

  name: 'AdsterraBanner468',

  components: {
    AdsterraAd
  },

  data() {

    return {

      adCode: `
        <script>
  atOptions = {
    'key' : '15a60e3ce2367fc679a0f7db56817e9c',
    'format' : 'iframe',
    'height' : 300,
    'width' : 160,
    'params' : {}
  };
<\/script>
<script src="https://www.highrevenueformat.com/15a60e3ce2367fc679a0f7db56817e9c/invoke.js"><\/script>
      `
    }
  }
}
</script>

<style scoped>
.adsterra-banner-160x300 {
  width: 160px;
  min-height: 300px;
  margin: 15px auto;
}
</style>
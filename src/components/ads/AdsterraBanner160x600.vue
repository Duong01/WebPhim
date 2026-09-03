<template>
  <AdsterraAd
    :code="adCode"
    container-class="adsterra-banner-160x600"
  />
</template>

<script setup>
import AdsterraAd from './AdsterraAd.vue'

const adCode = `
  <script>
  atOptions = {
    'key' : 'd7a8b4f0c6ddb1c0256ed3d6a90c9d68',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
<\/script>
<script src="https://www.highrevenueformat.com/d7a8b4f0c6ddb1c0256ed3d6a90c9d68/invoke.js"><\/script>
`
</script>

<style scoped>
.adsterra-banner-160x600 {
  width: 160px;
  min-height: 600px;
  margin: 15px auto;
}
</style>
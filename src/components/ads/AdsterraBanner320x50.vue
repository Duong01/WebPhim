<template>
  <AdsterraAd
    :code="adCode"
    container-class="adsterra-banner-320"
  />
</template>

<script setup>
import AdsterraAd from './AdsterraAd.vue'

const adCode = `
  <script>
  atOptions = {
    'key' : 'a3bf70c1f0be3658066fc86669b8cf0b',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
<\/script>
<script src="https://www.highrevenueformat.com/a3bf70c1f0be3658066fc86669b8cf0b/invoke.js"><\/script>
`
</script>

<style scoped>
.adsterra-banner-320 {
  width: 100%;
  min-height: 50px;
  max-width: 320px;
  margin: 15px auto;
}
</style>
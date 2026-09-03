<template>
  <AdsterraAd
    :code="adCode"
    container-class="adsterra-banner-468"
  />
</template>

<script>
import AdsterraAd from './AdsterraAd.vue'

export default {
  name: 'AdsterraBanner468',

  components: {
    AdsterraAd
  },

  data() {
    const scriptEnd = '<' + '/script>'

    return {
      adCode: `
        <script>
          atOptions = {
            'key': '16366a6ccdd24c6ad446bf1d8bc0cc8f',
            'format': 'iframe',
            'height': 60,
            'width': 468,
            'params': {}
          };
        ${scriptEnd}

        <script
          src="https://www.highrevenueformat.com/16366a6ccdd24c6ad446bf1d8bc0cc8f/invoke.js">
        ${scriptEnd}
      `
    }
  }
}
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

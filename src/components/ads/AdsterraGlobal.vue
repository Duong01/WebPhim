<template>
  <div
    id="adsterra-global"
    class="adsterra-global"
  ></div>
</template>

<script>
export default {
  name: 'AdsterraGlobal',

  data() {
    return {
      popunderScript: null,
      socialBarScript: null
    }
  },

  mounted() {
    this.loadPopunder()
    this.loadSocialBar()
  },

  methods: {
    loadPopunder() {
      // Không load lại nếu đã tồn tại
      if (
        document.getElementById(
          'adsterra-popunder-script'
        )
      ) {
        return
      }

      const script =
        document.createElement('script')

      script.id =
        'adsterra-popunder-script'

      script.src =
        'https://pl31163700.profitableratecpmnetwork.com/e7/05/87/e705877c40d9c18c75cadb831fee40ba.js'

      script.async = true

      document.body.appendChild(script)

      this.popunderScript = script
    },

    loadSocialBar() {
      // Không load lại nếu đã tồn tại
      if (
        document.getElementById(
          'adsterra-socialbar-script'
        )
      ) {
        return
      }

      const script =
        document.createElement('script')

      script.id =
        'adsterra-socialbar-script'

      script.src =
        'https://pl31163702.profitableratecpmnetwork.com/20/35/bc/2035bc7272c698d211164710ae5ab80a.js'

      script.async = true

      document.body.appendChild(script)

      this.socialBarScript = script
    }
  }
}
</script>

<style scoped>
.adsterra-global {
  display: contents;
}
</style>

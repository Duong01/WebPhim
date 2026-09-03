<template>
  <div
    class="adsterra-native"
  >
    <div
      :id="containerId"
      class="native-container"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'AdsterraNative',

  data() {
    return {
      containerId:
        'container-21e935a6f94addc9f4495622483c0e7b',

      scriptId:
        'adsterra-native-script'
    }
  },

  props: {
    enabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      containerId:
        'container-21e935a6f94addc9f4495622483c0e7b',

      scriptId:
        'adsterra-native-script',

      unwatchStore: null
    }
  },

  mounted() {
    const globalFlag = this.$store && this.$store.state && this.$store.state.showAds

    if (this.enabled || globalFlag) {
      this.loadNativeAd()
      return
    }

    this.unwatchStore = this.$watch(
      () => this.$store?.state?.showAds,
      (val) => {
        if (val) this.loadNativeAd()
      }
    )

    this.$watch('enabled', (val) => {
      if (val) this.loadNativeAd()
    })
  },

  beforeUnmount() {
    const container =
      document.getElementById(
        this.containerId
      )

    if (container) {
      container.innerHTML = ''
    }
    if (this.unwatchStore) {
      try { this.unwatchStore() } catch (e) { /* ignore */ }
      this.unwatchStore = null
    }
  },

  methods: {
    loadNativeAd() {
      // Nếu component đã có script thì không tạo lại
      if (
        document.getElementById(
          this.scriptId
        )
      ) {
        return
      }

      const script =
        document.createElement('script')

      script.id =
        this.scriptId

      script.async = true

      script.setAttribute(
        'data-cfasync',
        'false'
      )

      script.src =
        'https://pl31163701.profitableratecpmnetwork.com/21e935a6f94addc9f4495622483c0e7b/invoke.js'

      const container =
        document.getElementById(
          this.containerId
        )

      if (!container) {
        return
      }

      container.appendChild(script)
    }
  }
}
</script>

<style scoped>
.adsterra-native {
  width: 100%;
  max-width: 100%;
  margin: 20px auto;
  overflow: hidden;
}

.native-container {
  width: 100%;
}
</style>

<template>
  <div
    ref="adWrapper"
    class="lazy-ad-wrapper"
  >
    <slot v-if="visible" />
  </div>
</template>

<script>
export default {
  name: 'LazyAd',

  data() {
    return {
      visible: false,
      observer: null
    }
  },

  mounted() {
    this.initObserver()
  },

  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  },

  methods: {
    initObserver() {
      if (!this.$refs.adWrapper) {
        return
      }

      this.observer =
        new IntersectionObserver(
          (entries) => {
            const entry = entries[0]

            if (!entry.isIntersecting) {
              return
            }

            this.visible = true

            this.observer.disconnect()
            this.observer = null
          },
          {
            root: null,

            // Load ad trước khi user tới
            rootMargin: '400px 0px',

            threshold: 0.01
          }
        )

      this.observer.observe(
        this.$refs.adWrapper
      )
    }
  }
}
</script>

<style scoped>
.lazy-ad-wrapper {
  width: 100%;
  min-height: 60px;
}
</style>

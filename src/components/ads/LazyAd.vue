<template>
  <div
    ref="adWrapper"
    class="lazy-ad-wrapper"
    :style="{ minHeight: `${minHeight}px` }"
  >
    <slot v-if="visible" />
  </div>
</template>

<script>
export default {
  name: "LazyAd",

  props: {
    minHeight: {
      type: Number,
      default: 100,
    },
  },

  data() {
    return {
      visible: false,
      observer: null,
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.initObserver();
    });
  },

  beforeUnmount() {
    this.destroyObserver();
  },

  methods: {
    initObserver() {
      const wrapper = this.$refs.adWrapper;

      if (!wrapper) {
        console.warn("[LazyAd] wrapper not found");
        return;
      }

      // Browser không hỗ trợ IntersectionObserver
      if (!window.IntersectionObserver) {
        console.log("[LazyAd] IntersectionObserver not supported");
        this.visible = true;
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (!entry) return;

          console.log("[LazyAd]", {
            isIntersecting: entry.isIntersecting,
            ratio: entry.intersectionRatio,
          });

          if (!entry.isIntersecting) return;

          this.visible = true;
          this.destroyObserver();
        },
        {
          root: null,
          rootMargin: "1200px 0px",
          threshold: 0,
        }
      );

      this.observer.observe(wrapper);
    },

    destroyObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    },
  },
};
</script>

<style scoped>
.lazy-ad-wrapper {
  width: 100%;
  min-height: 100px;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
}
</style>

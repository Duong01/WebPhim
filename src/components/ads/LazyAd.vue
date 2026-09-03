<template>
  <div
    ref="adWrapper"
    class="lazy-ad-wrapper"
    :style="{ minHeight: `${minHeight}px` }"
  >
    <slot v-if="visible"></slot>
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
    this.initObserver();
  },

  beforeUnmount() {
    this.destroyObserver();
  },

  methods: {
    initObserver() {
      const wrapper = this.$refs.adWrapper;

      if (!wrapper) return;

      if (!("IntersectionObserver" in window)) {
        this.visible = true;
        return;
      }

      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;

          this.visible = true;
          this.destroyObserver();
        },
        {
          root: null,

          // Load trước khi người dùng scroll tới quảng cáo
          rootMargin: "1200px 0px",

          threshold: 0,
        }
      );

      this.observer.observe(wrapper);
    },

    destroyObserver() {
      if (!this.observer) return;

      this.observer.disconnect();
      this.observer = null;
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
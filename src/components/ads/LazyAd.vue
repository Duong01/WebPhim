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

      if (!wrapper) {
        return;
      }

      // Browser không hỗ trợ IntersectionObserver
      if (!("IntersectionObserver" in window)) {
        this.visible = true;
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (!entry?.isIntersecting) {
            return;
          }

          console.log("[LazyAd] Mounting ad");

          this.visible = true;

          this.destroyObserver();
        },
        {
          root: null,
          rootMargin: "400px 0px",
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

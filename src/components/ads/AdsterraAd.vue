<template>
  <div
    ref="adContainer"
    :class="containerClass"
  ></div>
</template>

<script>
export default {
  name: "AdsterraAd",

  props: {
    code: {
      type: String,
      required: true,
    },

    containerClass: {
      type: String,
      default: "",
    },
  },

  mounted() {
    this.renderAd();
  },

  beforeUnmount() {
    if (this.$refs.adContainer) {
      this.$refs.adContainer.innerHTML = "";
    }
  },

  methods: {
    renderAd() {
      const container = this.$refs.adContainer;

      if (!container) return;

      // Xóa nội dung cũ
      container.innerHTML = "";

      // Parse HTML
      const temp = document.createElement("div");
      temp.innerHTML = this.code;

      const scripts = temp.querySelectorAll("script");

      scripts.forEach((oldScript) => {
        const script = document.createElement("script");

        // Copy attributes
        Array.from(oldScript.attributes).forEach((attr) => {
          script.setAttribute(attr.name, attr.value);
        });

        // Copy inline JS
        if (oldScript.textContent) {
          script.textContent = oldScript.textContent;
        }

        container.appendChild(script);
      });
    },
  },
};
</script>

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
    if (this.isAdsBlocked()) return;

    try {
      localStorage.setItem("webphim_ads_blocked", "true");
    } catch (err) {
      // Ignore storage issues in private mode / restricted browsers.
    }

    this.renderAd();
  },

  beforeUnmount() {
    if (this.$refs.adContainer) {
      this.$refs.adContainer.innerHTML = "";
    }
  },

  methods: {
    isAdsBlocked() {
      try {
        return localStorage.getItem("webphim_ads_blocked") === "true";
      } catch (err) {
        return true;
      }
    },

    renderAd() {
      const container = this.$refs.adContainer;

      if (!container || this.isAdsBlocked()) return;

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

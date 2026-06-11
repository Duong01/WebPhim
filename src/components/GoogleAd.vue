<template>
  <div class="ad-container my-2 text-center">
    <ins class="adsbygoogle"
         :style="adStyle"
         :data-ad-client="adClient"
         :data-ad-slot="adSlot"
         :data-ad-format="adFormat"
         :data-full-width-responsive="fullWidthResponsive"></ins>
  </div>
</template>

<script>
export default {
  name: 'GoogleAd',
  props: {
    adClient: {
      type: String,
      default: 'ca-pub-5101049500206214' // Client ID có sẵn từ file index.html của bạn
    },
    adSlot: {
      type: String,
      required: true // Truyền ID Slot tạo từ trang quản trị AdSense vào
    },
    adFormat: {
      type: String,
      default: 'auto'
    },
    fullWidthResponsive: {
      type: String,
      default: 'true'
    },
    adStyle: {
      type: Object,
      default: () => ({ display: 'block' })
    }
  },
  mounted() {
    this.$nextTick(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    });
  }
}
</script>

<style scoped>
.ad-container {
  overflow: hidden;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03); /* Placeholder mờ nhẹ báo hiệu vùng quảng cáo */
  min-height: 90px;
}
</style>

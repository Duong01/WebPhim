<template>
  <a
    :href="smartlink"
    target="_blank"
    rel="nofollow sponsored noopener"
    class="adsterra-smartlink"
  >
    <slot>
      Xem thêm
    </slot>
  </a>
</template>

<script>
export default {
  name: 'AdsterraSmartlink',

  data() {
    return {
      smartlink:
        'https://www.profitableratecpmnetwork.com/r7eg9k7dw?key=7759f605a7e3094e9317109de5ae1590'
    }
  }
}
</script>

<style scoped>
.adsterra-smartlink {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  padding: 10px 18px;

  border-radius: 8px;

  text-decoration: none;

  cursor: pointer;
}
</style>

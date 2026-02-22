<template>
  <div class="chatbot-fullscreen">
    <iframe
      src="https://udify.app/chatbot/RQOr94OHdTRHpgce"
      allow="microphone"
      referrerpolicy="no-referrer"
      class="chatbot-frame"
    />
  </div>
</template>

<script>
export default {
  name: "ChatbotFull",
  mounted(){
    document.body.style.overflow = 'hidden'
  },
  beforeUnmount(){
    document.body.style.overflow = 'auto'
  }
}
</script>

<style scoped>
.chatbot-fullscreen{
  position: fixed;
  inset: 0;
  background: #fff;
}

.chatbot-frame{
  width: 100%;
  height: 100%;
  border: none;
}
</style>
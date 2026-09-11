<template>
  <div class="error-page">
    <div class="error-glow"></div>
    <v-empty-state
      class="error-state"
      action-text="Go Home"
      image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/connection.svg"
      text="There might be a problem with your connection or our servers. Please check your internet connection or try again later. We appreciate your patience."
      title="Something Went Wrong"
      @click:action="onClickAction"
    ></v-empty-state>
  </div>
</template>
<script>
export default{
    name: 'ErrorPage',
    data(){

    },
    methods:{
        onClickAction(){
            this.$router.push('/home')
        }
    }
}
</script>

<style scoped>
.error-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 20%, rgba(255, 183, 0, 0.06), transparent 50%),
    linear-gradient(180deg, #0a0a12 0%, #07070c 100%);
  overflow: hidden;
}

.error-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  width: 420px;
  height: 420px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 140, 0, 0.12), transparent 65%);
  filter: blur(40px);
  pointer-events: none;
  animation: errorPulse 4s ease-in-out infinite;
}

@keyframes errorPulse {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
}

.error-state {
  position: relative;
  z-index: 1;
  color: #f4f5f9;
}

.error-state :deep(.v-empty-state__title) {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  color: #f4f5f9;
}

.error-state :deep(.v-empty-state__text) {
  color: #a4a7b4;
  max-width: 480px;
}

.error-state :deep(.v-empty-state__action-btn) {
  background: linear-gradient(135deg, #ffb700, #ff5e00) !important;
  color: #0a0a12 !important;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(255, 140, 0, 0.35);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;
}

.error-state :deep(.v-empty-state__action-btn:hover) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 140, 0, 0.5);
}
</style>

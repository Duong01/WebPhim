<template>
  <!-- Empty; this component injects the chatbot scripts/styles into the document -->
  <div style="display:none"></div>
</template>

<script>
export default {
  name: 'ChatbotWidget',
  mounted() {
    // set CSS viewport height variable for mobile (used in CSS below)
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }
    setVh()
    window.addEventListener('resize', setVh)

    // do not inject twice
    if (document.getElementById('RQOr94OHdTRHpgce')) return

    // ensure a global object for optional user info
    window.difyUser = window.difyUser || {}

    // create config script
    const cfg = document.createElement('script')
    cfg.type = 'text/javascript'
    cfg.innerHTML = `window.difyChatbotConfig = {
      token: 'RQOr94OHdTRHpgce',
      inputs: {},
      systemVariables: {},
      userVariables: {
        avatar_url: window.difyUser?.avatar_url,
        name: window.difyUser?.name
      }
    }`
    document.head.appendChild(cfg)

    // inject external script
    const s = document.createElement('script')
    s.src = 'https://udify.app/embed.min.js'
    s.id = 'RQOr94OHdTRHpgce'
    s.defer = true
    document.head.appendChild(s)

    // inject styles to keep widget fixed and responsive
    const style = document.createElement('style')
    style.innerHTML = `
    /* Make chatbot button fixed on the right bottom and keep chat window fixed when open */
    #dify-chatbot-bubble-button {
      background-color: #1C64F2 !important;
      position: fixed !important;
      right: 1.25rem !important;
      bottom: 3.25rem !important;
      z-index: 99999 !important;
      margin: 0 !important;
      transform: none !important;
      box-shadow: 0 6px 18px rgba(0,0,0,0.12) !important;
    }
    #dify-chatbot-bubble-window {
      position: fixed !important;
      right: 1.25rem !important;
      bottom: 5.75rem !important; /* sits above the button */
      z-index: 99999 !important;
      width: 24rem !important;
      height: 40rem !important;
      margin: 0 !important;
      transform: none !important;
      box-shadow: 0 12px 32px rgba(0,0,0,0.18) !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
    }

    /* Responsive adjustments for small screens */
    @media (max-width: 640px) {
      html, body { overflow-x: hidden !important; }
      #dify-chatbot-bubble-button {
        right: 0.75rem !important;
        bottom: 3.75rem !important;
        max-width: calc(100vw - 1rem) !important;
      }
      #dify-chatbot-bubble-window {
        left: 50% !important;
        right: auto !important;
        top: 50% !important;
        bottom: auto !important;
        transform: translate(-50%, -50%) !important;
        width: calc(90vw - 1rem) !important;
        height: calc(var(--vh, 1vh) * 70) !important;
        max-height: calc(var(--vh, 1vh) * 90) !important;
        border-radius: 12px !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
      }
    }
    `
    document.head.appendChild(style)

    // cleanup when component unmounts
    this._removeChatbotListeners = () => {
      window.removeEventListener('resize', setVh)
    }
  },
  beforeUnmount() {
    if (this._removeChatbotListeners) this._removeChatbotListeners()
  }
}
</script>

<style scoped>
/* nothing visual inside Vue component */
</style>

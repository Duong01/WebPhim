<template>
  <!-- Empty; this component injects the chatbot scripts/styles into the document -->
  <div></div>
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

    // handle virtual keyboard on mobile: track visualViewport changes
    const initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight
    const THRESHOLD = 100 // px; heuristic for keyboard presence
    const onViewportChange = () => {
      const current = window.visualViewport ? window.visualViewport.height : window.innerHeight
      const keyboardHeight = Math.max(0, initialViewportHeight - current)
      document.documentElement.style.setProperty('--chatbot-keyboard-height', `${keyboardHeight}px`)
      if (keyboardHeight > THRESHOLD) {
        document.body.classList.add('chatbot-keyboard-open')
      } else {
        document.body.classList.remove('chatbot-keyboard-open')
      }
    }

    // focus detection inside the chatbot to trigger adjustments faster
    const onFocusIn = (e) => {
      const win = document.getElementById('dify-chatbot-bubble-window')
      if (!win) return
      if (win.contains(e.target)) {
        // run once to update keyboard height
        onViewportChange()
      }
    }
    const onFocusOut = () => {
      // small delay to allow visualViewport to update
      setTimeout(onViewportChange, 50)
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onViewportChange)
    } else {
      window.addEventListener('resize', onViewportChange)
    }
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)

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
      display: block !important;
      opacity: 1 !important;
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
      display: block !important;
      opacity: 1 !important;
      transition: none !important;
    }

    /* When keyboard is detected, shift widget above keyboard using the CSS var set by JS */
    body.chatbot-keyboard-open #dify-chatbot-bubble-button {
      bottom: calc(var(--chatbot-keyboard-height, 0px) + 0.75rem) !important;
    }
    body.chatbot-keyboard-open #dify-chatbot-bubble-window {
      bottom: calc(var(--chatbot-keyboard-height, 0px) + 3.25rem) !important;
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

      /* If keyboard opens on mobile, anchor chat window above keyboard and make it full-width-ish */
      body.chatbot-keyboard-open #dify-chatbot-bubble-window {
        left: auto !important;
        right: 0.5rem !important;
        top: auto !important;
        bottom: calc(var(--chatbot-keyboard-height, 0px) + 1.25rem) !important;
        transform: none !important;
        width: calc(100% - 1rem) !important;
        max-height: calc(var(--vh, 1vh) * 50) !important;
        border-radius: 12px !important;
      }

      body.chatbot-keyboard-open #dify-chatbot-bubble-button {
        right: 0.75rem !important;
        bottom: calc(var(--chatbot-keyboard-height, 0px) + 0.75rem) !important;
      }
    }
    `
    document.head.appendChild(style)

    // cleanup when component unmounts
    this._removeChatbotListeners = () => {
      window.removeEventListener('resize', setVh)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onViewportChange)
      } else {
        window.removeEventListener('resize', onViewportChange)
      }
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      // remove keyboard class and var
      document.body.classList.remove('chatbot-keyboard-open')
      document.documentElement.style.removeProperty('--chatbot-keyboard-height')
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

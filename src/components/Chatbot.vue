<template>
  <div class="chatbot-container">
    <!-- Chatbot Icon Button -->
    <button class="chatbot-icon-btn" @click="openChatbot">
      <img src="@/assets/IT AI.gif" class="chatbot-icon" />
    </button>
    <!-- Chatbot Modal/Dialog -->
    <!-- <transition name="fade">
      <div v-if="isChatbotOpen" class="chatbot-overlay" @click="closeChatbot">
        <div class="chatbot-modal" @click.stop>
          <div class="chatbot-header">
            <h4>{{ $t('common.assistant', 'MOVIES AI') }}</h4>
            <button class="close-btn" @click="closeChatbot">✕</button>
          </div>

          <div class="chatbot-content">
            <iframe
              src="https://udify.app/chatbot/RQOr94OHdTRHpgce"
              allow="microphone"
              referrerpolicy="no-referrer"
              loading="lazy"
              class="chatbot-iframe"
            />
          </div>
        </div>
      </div>
    </transition> -->
  </div>
</template>

<script>
export default {
  name: 'ChatBot',
  data() {
    return {
      avartar: this.$store.state.empInfor?.Avatar || this.$store.state.Avatar || '',
      name: this.$store?.state?.EmpName || 'Guest',
    }
  },
  methods: {
    openChatbot() {
       const win = document.getElementById('dify-chatbot-bubble-window')
        if (win) { 
          const isHidden = win.style.display === 'none' 
          win.style.display = isHidden ? 'block' : 'none' } 
          this.loadChatbot()
          },
    
    
  },
  mounted() { 
      window.difyChatbotConfig = 
      { 
        token: 'RQOr94OHdTRHpgce', 
        inputs: {},
        userVariables: {
          name: this.name,
          //avatar_url: this.$store.state.empInfor?.Avatar || this.$store.state.Avatar || '',
          avatar_url:this.avartar
        },
        } 
      const script = document.createElement('script')
       script.src = 'https://udify.app/embed.min.js' 
       script.defer = true 
       script.id = 'RQOr94OHdTRHpgce' 
       document.body.appendChild(script) 
       }

}


</script>

<style>
#dify-chatbot-bubble-button {
  display: none !important;
}
#dify-chatbot-bubble-window {
  position: fixed !important;
  width: 380px !important;
  height: 600px !important;
  bottom: 90px !important;
  right: 20px !important;
  border-radius: 14px !important;

}
@media (max-width: 480px) {
  #dify-chatbot-bubble-window {
    position: fixed;
    width: 95vw !important;
    height: 90vh !important;
    right: 2.5vw !important;
  }
}
.chatbot-container {
  position: fixed;
  bottom: 50px;
  right: 15px;
  z-index: 1000;
}
body {
  overflow: hidden;
}
/* Chatbot Icon Button - Responsive */
.chatbot-icon-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  padding: 0;
}

.chatbot-icon-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.chatbot-icon-btn:active {
  transform: scale(0.95);
}

.chatbot-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

/* Bubble bình thường */
#dify-chatbot-bubble-window {
  position: fixed !important;
  width: 380px !important;
  height: 600px !important;
  bottom: 90px !important;
  right: 20px !important;
  border-radius: 14px !important;
  z-index: 9999 !important;
}

/* ===== FULLSCREEN ===== */
#dify-chatbot-bubble-window.fullscreen {
  inset: 0 !important;
  width: 100vw !important;
  height: 100dvh !important;
  border-radius: 0 !important;
}

</style>

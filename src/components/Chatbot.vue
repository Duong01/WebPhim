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
      isLoaded: false
    }
  },

  computed: {
    avatar() {
      return this.$store.state.empInfor?.Avatar || this.$store.state.Avatar || ''
    },
    name() {
      return this.$store.state.EmpName || 'Guest'
    }
  },

  watch: {
    name(newVal) {
      if (newVal && !this.isLoaded) {
        this.initDify()
      }
    }
  },

  mounted() {
    // phòng trường hợp state đã có sẵn
    if (this.name && !this.isLoaded) {
      this.initDify()
    }
  },

  methods: {
    initDify() {
      this.isLoaded = true

      window.difyChatbotConfig = {
        token: 'RQOr94OHdTRHpgce',
        userVariables: {
          name: this.name,
          avatar_url: this.avatar
        }
      }

      if (!document.getElementById('RQOr94OHdTRHpgce')) {
        const script = document.createElement('script')
        script.src = 'https://udify.app/embed.min.js'
        script.id = 'RQOr94OHdTRHpgce'
        script.defer = true
        document.body.appendChild(script)
      }
    },

    openChatbot() {
      const win = document.getElementById('dify-chatbot-bubble-window')
      if (win) {
        win.style.display = win.style.display === 'none' ? 'block' : 'block'
      }
    }
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
  .chatbot-icon-btn{
    width: 50px;
    height: 50px;
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

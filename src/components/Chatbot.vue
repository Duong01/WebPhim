<template>
  <div class="chatbot-container">
    <!-- Chatbot Icon Button -->
    <button class="chatbot-icon-btn" @click="toggleChatbot" :title="$t('common.chat', 'Chat with us')">
      <img src="@/assets/IT AI.gif" alt="Chatbot" class="chatbot-icon" />
    </button>

    <!-- Chatbot Modal/Dialog -->
    <transition name="fade">
      <div v-if="isChatbotOpen" class="chatbot-overlay" @click="closeChatbot">
        <div class="chatbot-modal" @click.stop>
          <!-- Header -->
          <div class="chatbot-header">
            <h2>{{ $t('common.assistant', 'MOVIES AI') }}</h2>
            <button class="close-btn" @click="closeChatbot">✕</button>
          </div>

          <!-- Chatbot iframe -->
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
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ChatBot',
  data() {
    return {
      isChatbotOpen: false
    }
  },
  methods: {
    toggleChatbot() {
      this.isChatbotOpen = !this.isChatbotOpen;
      // Ngăn scroll khi modal mở
      if (this.isChatbotOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    },
    closeChatbot() {
      this.isChatbotOpen = false;
      document.body.style.overflow = 'auto';
    }
  },
  beforeUnmount() {
    document.body.style.overflow = 'auto';
  }
}
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 70px;
  right: 15px;
  z-index: 1000;
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

/* Modal Overlay */
.chatbot-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 30px;
  z-index: 2000;
}

/* Modal Container */
.chatbot-modal {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  width: 90vw;
  max-width: 500px;
  height: 80vh;
  max-height: 700px;
  overflow: hidden;
}

/* Modal Header */
.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: 1px solid #e0e0e0;
}

.chatbot-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.2);
}

/* Chatbot Content */
.chatbot-content {
  flex: 1;
  overflow: hidden;
  display: flex;
}

.chatbot-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile/Tablet Responsive */
@media (max-width: 768px) {
  .chatbot-overlay {
    justify-content: center;
    padding-right: 0;
  }

  .chatbot-container {
    bottom: 70px;
    right: 15px;
  }

  .chatbot-icon-btn {
    width: 56px;
    height: 56px;
  }

  .chatbot-icon {
    width: 46px;
    height: 46px;
  }

  .chatbot-modal {
    width: 95vw;
    max-width: none;
    height: 85vh;
    max-height: none;
  }

  .chatbot-header h2 {
    font-size: 16px;
  }
}

/* Small Devices */
@media (max-width: 480px) {
  .chatbot-container {
    bottom: 70px;
    right: 15px;
  }

  .chatbot-icon-btn {
    width: 52px;
    height: 52px;
  }

  .chatbot-icon {
    width: 42px;
    height: 42px;
  }

  .chatbot-modal {
    width: 98vw;
    height: 90vh;
    border-radius: 8px;
  }

  .chatbot-header {
    padding: 15px;
  }

  .chatbot-header h2 {
    font-size: 14px;
  }

  .close-btn {
    font-size: 20px;
  }
}

/* Landscape Mode */
@media (max-height: 600px) and (orientation: landscape) {
  .chatbot-modal {
    height: 95vh;
  }
}
</style>

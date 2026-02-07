<template>
<div style="display:none"></div>
</template>
<script>
export default {
  name: 'DifyChatbot',

  props: {
    user: {
      type: Object,
      default: null,
    },
  },

  mounted() {
    // Không load trùng script
    if (document.getElementById('dify-embed')) return

    // Config chatbot
    window.difyChatbotConfig = {
      token: 'RQOr94OHdTRHpgce',
      inputs: {},
      systemVariables: {
        user_id: this.user?.id || 'guest',
      },
      userVariables: {
        name: this.user?.name || 'Guest',
        avatar_url: this.user?.avatar || '',
      },
    }

    // Inject script
    const script = document.createElement('script')
    script.src = 'https://udify.app/embed.min.js'
    script.id = 'dify-embed'
    script.defer = true
    document.body.appendChild(script)
  },

}
</script>



<style>
#dify-chatbot-bubble-button {
  background-color: #1C64F2 !important;

}

#dify-chatbot-bubble-window {
  width: 24rem !important;
  height: 40rem !important;
  position: fixed !important;
  bottom: 100px !important;
  right: 50px !important;
  width: 24rem !important;
  height: 40rem !important;
  z-index: 99999 !important;
  
}
/* Nút bong bóng chat */
#dify-chatbot-bubble-button {
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  z-index: 99999 !important;
}
body {
  position: relative;
}
@media (max-width: 768px) {
  #dify-chatbot-bubble-window {
    width: 100vw !important;
    height: 70vh !important;
    bottom: 100px !important;
    right: 20px !important;
    border-radius: 20px !important;
  }
}
#dify-chatbot-bubble-button {
  position: fixed !important;
  bottom: 70px !important;
  right: 15px !important;
  z-index: 99999 !important;
}

</style>

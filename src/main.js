import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

/* =========================
   CSS
========================= */
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'element-plus/dist/index.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

/* =========================
   Libraries
========================= */
import { BootstrapVue3 } from 'bootstrap-vue-3'
import ElementPlus from 'element-plus'
import vue3GoogleLogin from 'vue3-google-login'
import { createHead } from '@vueuse/head'

import i18n from '@/lang'
import { CheckSession } from "@/model/api"

/* =========================
   Vuetify
========================= */
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  }
})

/* =========================
   Polyfills
========================= */
import "intersection-observer"
import ResizeObserver from "resize-observer-polyfill"

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver
}

/* =========================
   Reload logic
========================= */

// reload khi tab inactive lâu
let lastHiddenTime = 0

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    lastHiddenTime = Date.now()
  } else {
    const diff = Date.now() - lastHiddenTime
    if (diff > 60 * 60 * 1000) {
      window.location.reload()
    }
  }
})

// reload khi có mạng lại
window.addEventListener("online", () => {
  window.location.reload()
})

/* =========================
   Ignore ResizeObserver warning
========================= */
window.addEventListener("error", (e) => {
  if (
    e.message === 'ResizeObserver loop completed with undelivered notifications.' ||
    e.message.includes('ResizeObserver loop limit exceeded')
  ) {
    e.stopImmediatePropagation()
    console.warn('ResizeObserver warning ignored.')
  }
})

/* =========================
   Track user activity (Throttled)
========================= */
let activityTimer = null
const updateActivity = () => {
  if (!activityTimer) {
    store.commit("UPDATE_ACTIVE_TIME")
    activityTimer = setTimeout(() => {
      activityTimer = null
    }, 10000) // Giới hạn cập nhật 10 giây 1 lần để tối ưu CPU
  }
}

document.addEventListener("click", updateActivity)
document.addEventListener("keydown", updateActivity)
window.addEventListener("scroll", updateActivity, { passive: true })

/* =========================
   Bootstrap App
========================= */
async function bootstrap() {

  const token = localStorage.getItem("token")

  if (token) {
    await new Promise((resolve) => {
      CheckSession(
        (res) => {
          if (res?.data?.status === "success") {
            store.commit("setEmpInfor", res.data.data)
            store.commit("setAvatar", res.data.data.Avatar)
          }
          resolve()
        },
        (err) => {
          console.error("CheckSession error:", err)
          resolve()
        }
      )
    })
  }

  /* =========================
     User info for chatbot
  ========================= */
  window.difyUser = {
    avatar_url: store.state.empInfor?.Avatar || '',
    name: store.state.empInfor?.EmpName || '',
  }

  const app = createApp(App)

  /* ===== Global Vue error handler ===== */
  app.config.errorHandler = (err, vm, info) => {
    console.error("Vue error:", err, info)
  }

  /* =========================
     Use plugins
  ========================= */

  app.use(router)
  app.use(store)
  app.use(BootstrapVue3)
  app.use(ElementPlus)
  app.use(i18n)
  app.use(vuetify)
  app.use(createHead())

  app.use(vue3GoogleLogin, {
    clientId: "637267486434-t4hh87i10u44oo2m7mo0p3aelebqivo6.apps.googleusercontent.com"
  })

  app.mount('#app')
}

bootstrap()
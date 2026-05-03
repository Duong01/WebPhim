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

if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name))
  })
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister())
  })
}

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
   PWA Install Prompt
========================= */
let deferredPrompt;

// function detectDevice() {
//   const userAgent = navigator.userAgent;

//   const isIOS = /iPad|iPhone|iPod/.test(userAgent);
//   const isAndroid = /Android/.test(userAgent);
//   const isMobile = isIOS || isAndroid;

//   console.log('Device detection:', { isIOS, isAndroid, isMobile });

//   // Reset
//   store.commit('setIOS', false);
//   store.commit('setAndroid', false);
//   store.commit('setCanInstall', false);

//   // 🍎 iPhone → chỉ hiển thị popup hướng dẫn
//   if (isIOS) {
//     store.commit('setIOS', true);
//     store.commit('setCanInstall', false); // ❗ QUAN TRỌNG
//   }

//   // 🤖 Android → có thể install
//   else if (isAndroid) {
//     store.commit('setAndroid', true);
//     store.commit('setCanInstall', true);
//   }

//   // 💻 Desktop → cũng cho install
//   else {
//     store.commit('setCanInstall', true);
//   }

//   return { isIOS, isAndroid, isMobile };
// }

// Detect on page load
// window.addEventListener('load', () => {
//   detectDevice();
// });

// Also detect immediately for faster detection
// detectDevice();

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  store.commit('setInstallPrompt', deferredPrompt);
});

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

  /* Register Service Worker */
//   if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/service-worker.js')
//     .then((registration) => {

//       // kiểm tra update
//       registration.onupdatefound = () => {
//         const newWorker = registration.installing;

//         newWorker.onstatechange = () => {
//           if (newWorker.state === 'installed') {
//             if (navigator.serviceWorker.controller) {
//               // Có bản mới
//               if (confirm('Có phiên bản mới. Reload?')) {
//                 window.location.reload();
//               }
//             }
//           }
//         };
//       };

//     });
// }

  app.mount('#app')
}

bootstrap()
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import i18n from '@/lang'

/* UI */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { createHead } from '@vueuse/head'

/* Vuetify */
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

/* Google login */
import vue3GoogleLogin from 'vue3-google-login'

/* API */
import { CheckSession } from '@/model/api'

/* Polyfills */
import 'intersection-observer'

/* ResizeObserver */
if (!window.ResizeObserver) {
  import('resize-observer-polyfill').then(({ default: ResizeObserver }) => {
    window.ResizeObserver = ResizeObserver
  })
}

/* =========================
   Vuetify
========================= */

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
   Create app FIRST
========================= */

const app = createApp(App)

/* Vue error handler */
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err, info)
}

/* Plugins */
app.use(router)
app.use(store)
app.use(i18n)
app.use(ElementPlus)
app.use(vuetify)
app.use(createHead())

app.use(vue3GoogleLogin, {
  clientId:
    '637267486434-t4hh87i10u44oo2m7mo0p3aelebqivo6.apps.googleusercontent.com'
})

/* Mount immediately */
app.mount('#app')

/* =========================
   Background tasks AFTER render
========================= */

requestIdleCallback(async () => {
  initSession()
  initActivityTracking()
  initVisibilityReload()
  initResizeObserverWarning()
})

/* =========================
   Session
========================= */

async function initSession() {
  try {
    //const token = localStorage.getItem('token')
    const token = localStorage.getItem("token");

    if (!token) return

    CheckSession(
      (res) => {
        if (res?.data?.status === 'success') {
          store.commit('setEmpInfor', res.data.data)
          store.commit('setAvatar', res.data.data.Avatar)

          window.difyUser = {
            avatar_url: res.data.data.Avatar || '',
            name: res.data.data.EmpName || ''
          }
        }
      },
      (err) => {
        console.error('CheckSession error:', err)
      }
    )
  } catch (err) {
    console.error(err)
  }
}

/* =========================
   Activity tracking
========================= */

function initActivityTracking() {
  let ticking = false

  const updateActivity = () => {
    if (ticking) return

    ticking = true

    requestAnimationFrame(() => {
      store.commit('UPDATE_ACTIVE_TIME')

      setTimeout(() => {
        ticking = false
      }, 10000)
    })
  }

  window.addEventListener('scroll', updateActivity, {
    passive: true
  })
}

/* =========================
   Reload logic
========================= */

function initVisibilityReload() {
  let lastHiddenTime = 0

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      lastHiddenTime = Date.now()
    } else {
      const diff = Date.now() - lastHiddenTime

      // 2 giờ mới reload
      if (diff > 2 * 60 * 60 * 1000) {
        location.reload()
      }
    }
  })

  // debounce online reload
  let onlineTimeout = null

  window.addEventListener('online', () => {
    clearTimeout(onlineTimeout)

    onlineTimeout = setTimeout(() => {
      location.reload()
    }, 3000)
  })
}

/* =========================
   Ignore ResizeObserver
========================= */

function initResizeObserverWarning() {
  window.addEventListener('error', (e) => {
    if (
      e.message?.includes('ResizeObserver')
    ) {
      e.stopImmediatePropagation()
    }
  })
}
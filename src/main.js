import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import { BootstrapVue3 } from 'bootstrap-vue-3'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import i18n from '@/lang'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import "intersection-observer"
import ResizeObserver from "resize-observer-polyfill"

import { CheckSession } from "@/model/api";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})

async function bootstrap() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      await CheckSession((res) =>{
        console.log(res)
        if (res.data.status === "success") {
        store.commit("setEmpInfor", res.data.data);
      } else {
        localStorage.removeItem("token");
      }
      });
      
      
    } catch (err) {
      console.warn("Session invalid / expired");
      localStorage.removeItem("token");
    }
  }

  const app = createApp(App);

  // ===== Global error handler =====
  app.config.errorHandler = (err, vm, info) => {
    console.error("Lỗi Vue:", err, info)
    app.config.globalProperties.$emit?.(
      "show-error",
      err.message || "Có lỗi xảy ra"
    )
  }

  window.addEventListener('error', function (e) {
    if (
      e.message === 'ResizeObserver loop completed with undelivered notifications.' ||
      e.message.includes('ResizeObserver loop limit exceeded')
    ) {
      e.stopImmediatePropagation();
      console.warn('⚠️ ResizeObserver warning ignored.');
    }
  });

  if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserver;
  }

  app.use(router);
  app.use(store);
  app.use(BootstrapVue3);
  app.use(ElementPlus);
  app.use(i18n);
  app.use(vuetify);

  app.mount('#app');
}

bootstrap(); // 🚀 KHỞI ĐỘNG APP

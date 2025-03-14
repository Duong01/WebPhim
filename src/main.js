import { createApp } from 'vue'

import App from './App.vue'

import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import BootstrapVue3 from 'bootstrap-vue-3'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);

app.use(router)
app.use(store);
app.use(BootstrapVue3)
app.use(ElementPlus)


app.mount('#app')


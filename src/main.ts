import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Vue3GoogleSignin from 'vue3-google-signin';

const app = createApp(App)

// Register all Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(VueApexCharts)

app.use(Vue3GoogleSignin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});

app.mount('#app')

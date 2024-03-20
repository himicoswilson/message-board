import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import UUID from "vue3-uuid";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(UUID)

app.mount('#app')

import './assets/main.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import UUID from "vue3-uuid";

/* import the fontawesome core */
import {library} from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faThumbsUp as farThumbsUp } from '@fortawesome/free-regular-svg-icons'
import {faRightFromBracket, faTrash, faEllipsis, faPenToSquare, faThumbsUp} from '@fortawesome/free-solid-svg-icons'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// import every components
import AppHeader from '@/components/AppHeader.vue'
import AppCard from '@/components/AppCard.vue'
import AppAside from '@/components/AppAside.vue'


const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

axios.defaults.baseURL = 'http://47.100.101.113:3000'

/* add icons to the library */
library.add(faRightFromBracket, faTrash, faEllipsis, faPenToSquare, faThumbsUp, farThumbsUp)

/* 注册 font awesome icon 全局组件 */
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(UUID)

app.component('AppHeader', AppHeader)
  .component('AppCard', AppCard)
  .component('AppAside', AppAside)

app.mount('#app')

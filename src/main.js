import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import UUID from "vue3-uuid";

/* import the fontawesome core */
import {library} from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {faBell, faCirclePlus} from '@fortawesome/free-solid-svg-icons'


const app = createApp(App)

/* add icons to the library */
library.add(faBell,faCirclePlus)

/* 注册 font awesome icon 全局组件 */
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(UUID)

app.mount('#app')

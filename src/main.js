import { createApp, Vue } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import './styles/index.scss'

import gallery from 'img-vuer3'
import 'img-vuer3/dist/style.css'

createApp(App).use(store).use(router).use(gallery).mount('#app')

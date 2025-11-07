import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './index.css'
import App from './App.vue'
import router from './router/index.ts'
import { storeDirty } from './stores/plugins/dirty'
import { ApiInterface } from '../electron/interface'

const app = createApp(App)

const pinia = createPinia()
pinia.use(storeDirty)

app.use(pinia)
app.use(router)

app.mount('#app').$nextTick(() => {
  // Use contextBridge
  (window.api as ApiInterface)?.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})

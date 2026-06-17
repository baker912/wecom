import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// 抑制 webview 环境中的非关键跨域脚本错误
window.addEventListener('error', (event) => {
  if (event.message === 'Script error.' && !event.filename) {
    event.preventDefault()
    return
  }
})

const app = createApp(App)

app.config.errorHandler = (err, _instance, info) => {
  console.error('[Vue Error]', info, err)
}

app.use(router).mount('#root')

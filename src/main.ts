import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importar el header (que monta automáticamente) y obtener la instancia de Pinia
import { pinia } from './header'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

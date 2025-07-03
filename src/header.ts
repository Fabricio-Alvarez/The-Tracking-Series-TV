import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import AppHeader from '@/components/AppHeader.vue'
import { useShowsStore } from '@/stores/shows'
import { watch } from 'vue'

// Crear una instancia de Pinia que será compartida
const pinia = createPinia()

// Función para montar el header
function mountHeader() {
  const headerElement = document.getElementById('app-header')
  if (headerElement) {
    const headerApp = createApp(AppHeader)
    headerApp.use(pinia)
    headerApp.use(router)
    headerApp.mount(headerElement)

    // Ocultar el header si el usuario no está logueado
    const store = useShowsStore()
    function updateHeaderVisibility() {
      headerElement.style.display = store.currentUser ? '' : 'none'
    }
    updateHeaderVisibility()
    watch(
      () => store.currentUser,
      () => updateHeaderVisibility()
    )
  }
}

// Montar el header cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountHeader)
} else {
  mountHeader()
}

// Exportar la instancia de Pinia para que la app principal la use
export { pinia } 
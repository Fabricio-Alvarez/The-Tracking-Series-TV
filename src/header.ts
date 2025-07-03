import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import AppHeader from '@/components/AppHeader.vue'
import { useShowsStore } from '@/stores/shows'
import { watch } from 'vue'


const pinia = createPinia()


function mountHeader() {
  const headerElement = document.getElementById('app-header')
  if (headerElement) {
    const headerApp = createApp(AppHeader)
    headerApp.use(pinia)
    headerApp.use(router)
    headerApp.mount(headerElement)

    
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


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountHeader)
} else {
  mountHeader()
}


export { pinia } 
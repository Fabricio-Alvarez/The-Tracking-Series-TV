<script setup lang="ts">
import { onMounted } from 'vue'
import { useShowsStore } from '@/stores/shows'
import BottomNavigation from '@/components/BottomNavigation.vue'

const showsStore = useShowsStore()

onMounted(async () => {
  // Inicializar datos desde localStorage
  showsStore.initializeFromStorage()

  // Cargar usuario actual si existe
  await showsStore.loadCurrentUser()
})
</script>

<template>
  <div id="app">
    <main class="main-content">
      <router-view />
    </main>
    <BottomNavigation />
  </div>
</template>

<style>
#app {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  background-color: #121212;
  color: #fff;
  min-height: calc(100vh - 80px); /* Restar altura del header */
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-bottom: 80px; /* Espacio para la navegación inferior */
}

/* Estilos globales */
* {
  box-sizing: border-box;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Transiciones suaves */
* {
  transition:
    color 0.2s,
    background-color 0.2s,
    border-color 0.2s;
}

/* Focus visible para accesibilidad */
*:focus-visible {
  outline: 2px solid #6c7ae0;
  outline-offset: 2px;
}

/* Botones */
button {
  cursor: pointer;
  font-family: inherit;
}

button:disabled {
  cursor: not-allowed;
}

/* Enlaces */
a {
  color: inherit;
  text-decoration: none;
}

/* Inputs */
input {
  font-family: inherit;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding-bottom: 70px;
  }
}
</style>

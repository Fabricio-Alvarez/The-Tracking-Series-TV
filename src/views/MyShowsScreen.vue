<template>
  <div class="myshows-screen">
    <!-- Tabs internas -->
    <Tabs :tabs="tabs" :active-tab="activeTab" @tab-change="handleTabChange" />

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando contenido...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="loadData" class="retry-button">Reintentar</button>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- TV series -->
      <div v-if="activeTab === 'tv'" class="tab-content">
        <MovieGrid
          :movies="tvSeries"
          :count="tvSeries.length"
          type="shows"
          @selection-mode="handleSelectionMode"
          @movie-click="handleMovieClick"
        />
      </div>

      <!-- Movies -->
      <div v-if="activeTab === 'movies'" class="tab-content">
        <MovieGrid
          :movies="movies"
          :count="movies.length"
          type="movies"
          @selection-mode="handleSelectionMode"
          @movie-click="handleMovieClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Tabs from '@/components/Tabs.vue'
import MovieGrid from '@/components/MovieGrid.vue'
import TVDBService, { type Movie } from '@/services/tvdbService'

// Configuración de tabs
const tabs = [
  {
    id: 'tv',
    label: 'TV series',
    icon: 'tv-outline',
  },
  {
    id: 'movies',
    label: 'Movies',
    icon: 'film-outline',
  },
]

const activeTab = ref('tv')

// Estado
const isLoading = ref(true)
const error = ref('')
const tvSeries = ref<Movie[]>([])
const movies = ref<Movie[]>([])

// Cargar datos
const loadData = async () => {
  try {
    isLoading.value = true
    error.value = ''

    // Para My Shows, usamos series populares como ejemplo
    // En una implementación real, aquí cargarías las series del usuario
    const popularShows = await TVDBService.getPopularShows()

    // Dividir en TV series y movies (simulado)
    tvSeries.value = popularShows.slice(0, 6)
    movies.value = popularShows.slice(6, 12)
  } catch (err) {
    console.error('Error cargando datos:', err)
    error.value = 'Error al cargar el contenido. Verifica tu conexión a internet.'
  } finally {
    isLoading.value = false
  }
}

// Event handlers
const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
}

const handleSelectionMode = () => {
  console.log('Modo selección activado')
  // Aquí puedes implementar la lógica del modo selección
}

const handleMovieClick = (movie: Movie) => {
  console.log('Película clickeada:', movie.title)
  // Aquí puedes navegar a la página de detalles de la película
}

// Cargar datos al montar el componente
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.myshows-screen {
  background-color: #121212;
  min-height: 100%;
}

.tab-content {
  background-color: #121212;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6c7ae0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container p {
  color: #ff6b6b;
  margin-bottom: 16px;
}

.retry-button {
  background: #6c7ae0;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background: #5a6bc8;
}
</style>

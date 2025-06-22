<template>
  <div class="search-view">
    <div class="search-header">
      <h1>Buscar Series</h1>
      <p>Encuentra tus series favoritas</p>
    </div>

    <!-- Barra de búsqueda -->
    <div class="search-container">
      <div class="search-box">
        <ion-icon name="search-outline" class="search-icon"></ion-icon>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          @keyup.enter="performSearch"
          type="text"
          placeholder="Buscar series..."
          class="search-input"
          :disabled="isLoading"
        />
        <button
          @click="performSearch"
          class="search-button"
          :disabled="isLoading || !searchQuery.trim()"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          <ion-icon v-else name="search-outline"></ion-icon>
        </button>
      </div>
    </div>

    <!-- Resultados -->
    <div class="search-results">
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Buscando series...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="performSearch" class="retry-button">Reintentar</button>
      </div>

      <div v-else-if="searchResults.length === 0 && hasSearched" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No se encontraron series</h3>
        <p>Intenta con otros términos de búsqueda</p>
      </div>

      <div v-else-if="searchResults.length > 0" class="results-grid">
        <MovieCard
          v-for="movie in searchResults"
          :key="movie.id"
          :movie="movie"
          :show-rating="true"
          :show-year="true"
        />
      </div>

      <div v-else class="welcome-state">
        <div class="welcome-icon">🔍</div>
        <h3>¡Busca tus series favoritas!</h3>
        <p>Escribe el nombre de una serie para comenzar</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useShowsStore } from '@/stores/shows'
import TVDBService, { type Movie } from '@/services/tvdbService'
import MovieCard from '@/components/MovieCard.vue'

const showsStore = useShowsStore()

// Estado local
const searchQuery = ref('')
const isLoading = ref(false)
const error = ref('')
const hasSearched = ref(false)
const searchResults = ref<Movie[]>([])

// Debounce para la búsqueda
let searchTimeout: NodeJS.Timeout | null = null

const handleSearch = () => {
  // Limpiar timeout anterior
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Nuevo timeout para debounce
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      performSearch()
    }
  }, 500)
}

const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  try {
    isLoading.value = true
    error.value = ''
    hasSearched.value = true

    const results = await TVDBService.searchShows(searchQuery.value)
    searchResults.value = results
    showsStore.setSearchResults(results)
  } catch (err: any) {
    console.error('Error en búsqueda:', err)
    error.value =
      err.response?.data?.message || 'Error al buscar series. Verifica tu conexión a internet.'
    searchResults.value = []
    showsStore.setSearchResults([])
  } finally {
    isLoading.value = false
  }
}

// Inicializar con la query del store si existe
onMounted(() => {
  const storedQuery = showsStore.searchQuery
  if (storedQuery) {
    searchQuery.value = storedQuery
    performSearch()
  }
})

// Limpiar la query del store cuando se desmonte el componente
watch(
  () => searchQuery.value,
  (newQuery) => {
    if (!newQuery) {
      showsStore.setSearchQuery('')
      showsStore.setSearchResults([])
      hasSearched.value = false
      searchResults.value = []
    }
  },
)
</script>

<style scoped>
.search-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #121212;
  min-height: 100%;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
}

.search-header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  color: #fff;
  font-weight: 700;
}

.search-header p {
  margin: 0;
  font-size: 16px;
  color: #aaa;
}

.search-container {
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #2d2d2d;
  border-radius: 25px;
  padding: 4px;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  font-size: 20px;
  color: #888;
  margin-left: 16px;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 16px;
  outline: none;
  padding: 12px 16px;
}

.search-input::placeholder {
  color: #888;
}

.search-button {
  background: #6c7ae0;
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 4px;
}

.search-button:hover:not(:disabled) {
  background: #5a6bc8;
}

.search-button:disabled {
  background: #555;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.search-results {
  min-height: 400px;
}

.loading-container,
.error-container,
.empty-state,
.welcome-state {
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

.empty-icon,
.welcome-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3,
.welcome-state h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #fff;
}

.empty-state p,
.welcome-state p {
  margin: 0;
  font-size: 16px;
  color: #aaa;
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

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .search-view {
    padding: 16px;
  }

  .search-header {
    margin-bottom: 30px;
  }

  .search-header h1 {
    font-size: 24px;
  }

  .search-container {
    margin-bottom: 30px;
  }

  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>

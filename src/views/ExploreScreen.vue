<template>
  <div class="explore-screen">
    <div class="explore-header">
      <h1 v-if="searchQuery && searchResults.length > 0">Resultados de búsqueda</h1>
      <div v-if="searchQuery && searchResults.length > 0" class="search-tabs-bar">
        <div :class="['search-tab', selectedSearchTab === 'all' ? 'active' : '']" @click="selectedSearchTab = 'all'">All</div>
        <div :class="['search-tab', selectedSearchTab === 'series' ? 'active' : '']" @click="selectedSearchTab = 'series'">TV Series</div>
        <div :class="['search-tab', selectedSearchTab === 'movies' ? 'active' : '']" @click="selectedSearchTab = 'movies'">Movies</div>
      </div>
    </div>
    <div class="explore-content">
      <div v-if="searchQuery && searchResults.length > 0" class="shows-grid">
        <MovieCard
          v-for="movie in filteredSearchResults"
          :key="movie.id as string"
          :movie="movie"
          :show-rating="true"
          :show-year="true"
        />
      </div>
      <template v-else>
        <!-- Series Populares -->
        <section class="section">
          <h2>Recommended movies</h2>
          <div v-if="isLoadingPopular" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Cargando series populares...</p>
          </div>
          <div v-else-if="popularError" class="error-container">
            <p>{{ popularError }}</p>
            <button @click="loadPopularShows" class="retry-button">Reintentar</button>
          </div>
          <div v-else-if="popularSeries.length === 0" class="empty-state">
            <p>No se encontraron series populares</p>
          </div>
          <div v-else class="shows-row-scroll">
            <MovieCard
              v-for="movie in popularSeries"
              :key="movie.id as string"
              :movie="movie"
              :show-rating="true"
              :show-year="true"
            />
          </div>
        </section>
        <!-- Series Recomendadas -->
        <section class="section">
          <h2>Popular TV series</h2>
          <div v-if="isLoadingRecommended" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Cargando series recomendadas...</p>
          </div>
          <div v-else-if="recommendedError" class="error-container">
            <p>{{ recommendedError }}</p>
            <button @click="loadRecommendedShows" class="retry-button">Reintentar</button>
          </div>
          <div v-else-if="recommendedSeries.length === 0" class="empty-state">
            <p>No se encontraron series recomendadas</p>
          </div>
          <div v-else class="shows-row-scroll">
            <MovieCard
              v-for="movie in recommendedSeries"
              :key="movie.id as string"
              :movie="movie"
              :show-rating="true"
              :show-year="true"
            />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useShowsStore } from '@/stores/shows'
import MovieCard from '@/components/MovieCard.vue'
import { batchSearchTheTVDBExact, batchSearchMoviesTheTVDBExact } from '@/services/tvdbService'
import { useRoute } from 'vue-router'
import type { Movie } from '@/services/tvdbService'

const showsStore = useShowsStore()
const searchQuery = computed(() => showsStore.searchQuery)
const searchResults = computed(() => showsStore.searchResults)

const popularSeries = ref<Movie[]>([])
const recommendedSeries = ref<Movie[]>([])
const isLoadingPopular = ref(false)
const isLoadingRecommended = ref(false)
const popularError = ref('')
const recommendedError = ref('')

const selectedSearchTab = ref('all') // 'all', 'series', 'movies'

const filteredSearchResults = computed(() => {
  if (selectedSearchTab.value === 'series') {
    return searchResults.value.filter(item => item.mediaType !== 'movie')
  } else if (selectedSearchTab.value === 'movies') {
    return searchResults.value.filter(item => item.mediaType === 'movie')
  }
  return searchResults.value
})

const loadPopularShows = async () => {
  isLoadingPopular.value = true
  popularError.value = ''
  try {
    // Lista de 12 películas populares internacionales
    popularSeries.value = await batchSearchMoviesTheTVDBExact([
      'The Shawshank Redemption',
      'The Godfather',
      'The Dark Knight',
      'Pulp Fiction',
      'Forrest Gump',
      'Inception',
      'Fight Club',
      'The Matrix',
      'Interstellar',
      'Parasite',
      'Gladiator',
      'Titanic',
    ])
    showsStore.addShowsToResults(popularSeries.value)
  } catch (error) {
    popularError.value = 'Error al cargar películas recomendadas'
  } finally {
    isLoadingPopular.value = false
  }
}
const loadRecommendedShows = async () => {
  isLoadingRecommended.value = true
  recommendedError.value = ''
  try {
    recommendedSeries.value = await batchSearchTheTVDBExact([
      'Fleabag', 'The Marvelous Mrs. Maisel', 'Chernobyl', 'Mindhunter',
      'The Expanse', 'Succession', 'Barry', 'The Leftovers',
      'Atlanta', 'The Good Place', 'Severance', 'Ted Lasso',
    ])
    showsStore.addShowsToResults(recommendedSeries.value)
  } catch (error) {
    recommendedError.value = 'Error al cargar series recomendadas'
  } finally {
    isLoadingRecommended.value = false
  }
}

const route = useRoute()

onMounted(() => {
  loadPopularShows()
  loadRecommendedShows()
})

watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath === '/') {
      showsStore.setSearchQuery('')
      showsStore.setSearchResults([])
    }
  }
)
</script>

<style scoped>
.explore-screen {
  /* max-width: 1200px; */
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #121212;
  min-height: 100%;
}

.explore-header {
  text-align: center;
  margin-bottom: 40px;
}

.explore-header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  color: #fff;
  font-weight: 700;
}

.explore-header p {
  margin: 0;
  font-size: 16px;
  color: #aaa;
}

.explore-content {
  margin-top: 40px;
}

.section {
  margin-bottom: 60px;
}

.section h2 {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #fff;
  font-weight: 600;
}

.loading-container,
.error-container,
.empty-state {
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

.empty-state p {
  color: #aaa;
  font-size: 16px;
}

.shows-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 768px) {
  .shows-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .shows-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 768px) {
  .explore-screen {
    padding: 16px;
  }

  .explore-header {
    margin-bottom: 30px;
  }

  .explore-header h1 {
    font-size: 24px;
  }

  .explore-content {
    margin-top: 30px;
  }

  .section {
    margin-bottom: 40px;
  }

  .section h2 {
    font-size: 20px;
  }

  .shows-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

.shows-row-scroll {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  gap: 20px;
  padding-bottom: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.4) #222;
}

.shows-row-scroll::-webkit-scrollbar {
  height: 10px;
}
.shows-row-scroll::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.4);
  border-radius: 8px;
}
.shows-row-scroll::-webkit-scrollbar-track {
  background: #222;
  border-radius: 8px;
}

.shows-row-scroll > * {
  min-width: 180px;
  max-width: 220px;
  flex: 0 0 auto;
}

.search-tabs-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: 18px 0 10px 0;
}
.search-tab {
  padding: 8px 22px;
  border-radius: 20px;
  background: #23243a;
  color: #aaa;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.search-tab.active {
  background: #6c7ae0;
  color: #fff;
}
</style>

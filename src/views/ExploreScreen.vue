<template>
  <div class="explore-screen">
    <div class="explore-header">
      <h1>Explorar Series</h1>
      <p>Descubre las mejores series de televisión</p>
    </div>

    <div class="explore-content">
      <!-- Series Populares -->
      <section class="section">
        <h2>Series Populares</h2>
        <div v-if="isLoadingPopular" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Cargando series populares...</p>
        </div>

        <div v-else-if="popularError" class="error-container">
          <p>{{ popularError }}</p>
          <button @click="loadPopularShows" class="retry-button">Reintentar</button>
        </div>

        <div v-else-if="popularShows.length === 0" class="empty-state">
          <p>No se encontraron series populares</p>
        </div>

        <div v-else class="shows-grid">
          <MovieCard
            v-for="movie in popularShows"
            :key="movie.id"
            :movie="movie"
            :show-rating="true"
            :show-year="true"
          />
        </div>
      </section>

      <!-- Series Recomendadas -->
      <section class="section">
        <h2>Series Recomendadas</h2>
        <div v-if="isLoadingRecommended" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Cargando series recomendadas...</p>
        </div>

        <div v-else-if="recommendedError" class="error-container">
          <p>{{ recommendedError }}</p>
          <button @click="loadRecommendedShows" class="retry-button">Reintentar</button>
        </div>

        <div v-else-if="recommendedShows.length === 0" class="empty-state">
          <p>No se encontraron series recomendadas</p>
        </div>

        <div v-else class="shows-grid">
          <MovieCard
            v-for="movie in recommendedShows"
            :key="movie.id"
            :movie="movie"
            :show-rating="true"
            :show-year="true"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TVDBService, { type Movie } from '@/services/tvdbService'
import MovieCard from '@/components/MovieCard.vue'

// Estado
const popularShows = ref<Movie[]>([])
const recommendedShows = ref<Movie[]>([])
const isLoadingPopular = ref(false)
const isLoadingRecommended = ref(false)
const popularError = ref('')
const recommendedError = ref('')

// Cargar series populares
const loadPopularShows = async () => {
  isLoadingPopular.value = true
  popularError.value = ''

  try {
    popularShows.value = await TVDBService.getPopularShows()
  } catch (error: any) {
    console.error('Error cargando series populares:', error)
    popularError.value = error.response?.data?.message || 'Error al cargar series populares'
  } finally {
    isLoadingPopular.value = false
  }
}

// Cargar series recomendadas
const loadRecommendedShows = async () => {
  isLoadingRecommended.value = true
  recommendedError.value = ''

  try {
    recommendedShows.value = await TVDBService.getRecommendedShows()
  } catch (error: any) {
    console.error('Error cargando series recomendadas:', error)
    recommendedError.value = error.response?.data?.message || 'Error al cargar series recomendadas'
  } finally {
    isLoadingRecommended.value = false
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  loadPopularShows()
  loadRecommendedShows()
})
</script>

<style scoped>
.explore-screen {
  max-width: 1200px;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
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
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>

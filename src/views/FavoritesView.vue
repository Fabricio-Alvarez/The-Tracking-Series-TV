<template>
  <div class="favorites-view">
    <div class="favorites-header">
      <h1>Mis Favoritos</h1>
      <p>Series que más te gustan</p>
    </div>

    <div class="favorites-content">
      <div v-if="hasFavorites" class="favorites-stats">
        <span class="stat-item">
          <span class="stat-number">{{ favorites.length }}</span>
          <span class="stat-label">series favoritas</span>
        </span>
      </div>

      <div v-if="favorites.length === 0" class="empty-state">
        <div class="empty-icon">⭐</div>
        <h3>No tienes favoritos</h3>
        <p>Agrega series a favoritos desde la pantalla de exploración</p>
        <router-link to="/" class="cta-button"> Explorar Series </router-link>
      </div>

      <div v-else class="favorites-grid">
        <MovieCard
          v-for="movie in favorites"
          :key="movie.id"
          :movie="movie"
          :show-rating="true"
          :show-year="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useShowsStore } from '@/stores/shows'
import MovieCard from '@/components/MovieCard.vue'
import { onBeforeRouteLeave } from 'vue-router'

const showsStore = useShowsStore()

onBeforeRouteLeave(() => {
  showsStore.setSearchQuery('')
})

const favorites = computed(() => {
  if (!showsStore.searchQuery) {
    return showsStore.favorites
  }
  return showsStore.favorites.filter(movie =>
    movie.title.toLowerCase().includes(showsStore.searchQuery.toLowerCase())
  )
})

const hasFavorites = computed(() => showsStore.hasFavorites)
</script>

<style scoped>
.favorites-view {
  /* max-width: 1200px; */
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #121212;
  min-height: 100%;
}

.favorites-header {
  text-align: center;
  margin-bottom: 40px;
}

.favorites-header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  color: #fff;
  font-weight: 700;
}

.favorites-header p {
  margin: 0;
  font-size: 16px;
  color: #aaa;
}

.favorites-content {
  margin-top: 40px;
}

.favorites-stats {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #dc3545;
}

.stat-label {
  font-size: 14px;
  color: #aaa;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #fff;
}

.empty-state p {
  margin: 0 0 24px 0;
  font-size: 16px;
  color: #aaa;
}

.cta-button {
  background: #dc3545;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.cta-button:hover {
  background: #c82333;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (min-width: 1024px) {
  .favorites-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 768px) {
  .favorites-view {
    padding: 16px;
  }

  .favorites-header {
    margin-bottom: 30px;
  }

  .favorites-header h1 {
    font-size: 24px;
  }

  .favorites-content {
    margin-top: 30px;
  }

  .stat-number {
    font-size: 20px;
  }

  .favorites-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
</style>

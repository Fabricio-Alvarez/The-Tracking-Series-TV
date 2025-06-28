<template>
  <div class="watchlist-view">
    <div class="watchlist-header">
      <h1>Mi Watchlist</h1>
      <p>Series que quieres ver</p>
    </div>

    <div class="watchlist-content">
      <div v-if="hasWatchlist" class="watchlist-stats">
        <span class="stat-item">
          <span class="stat-number">{{ watchlist.length }}</span>
          <span class="stat-label">series en tu lista</span>
        </span>
      </div>

      <div v-if="watchlist.length === 0" class="empty-state">
        <div class="empty-icon">📺</div>
        <h3>Tu watchlist está vacía</h3>
        <p>Agrega series desde la pantalla de exploración</p>
        <router-link to="/" class="cta-button"> Explorar Series </router-link>
      </div>

      <div v-else class="watchlist-grid">
        <MovieCard
          v-for="movie in watchlist"
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

const showsStore = useShowsStore()

const watchlist = computed(() => showsStore.watchlist)
const hasWatchlist = computed(() => showsStore.hasWatchlist)
</script>

<style scoped>
.watchlist-view {
  /* max-width: 1200px; */
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #121212;
  min-height: 100%;
}

.watchlist-header {
  text-align: center;
  margin-bottom: 40px;
}

.watchlist-header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  color: #fff;
  font-weight: 700;
}

.watchlist-header p {
  margin: 0;
  font-size: 16px;
  color: #aaa;
}

.watchlist-content {
  margin-top: 40px;
}

.watchlist-stats {
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
  color: #6c7ae0;
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
  background: #6c7ae0;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.cta-button:hover {
  background: #5a6bc8;
}

.watchlist-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (min-width: 1024px) {
  .watchlist-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}

@media (max-width: 768px) {
  .watchlist-view {
    padding: 16px;
  }

  .watchlist-header {
    margin-bottom: 30px;
  }

  .watchlist-header h1 {
    font-size: 24px;
  }

  .watchlist-content {
    margin-top: 30px;
  }

  .stat-number {
    font-size: 20px;
  }

  .watchlist-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
</style>

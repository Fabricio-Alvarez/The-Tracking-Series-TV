<template>
  <div class="watchlist-view">
    <div class="watchlist-header">
      <h1>Watchlist</h1>
    </div>

    <div class="watchlist-content">
      <div v-if="hasWatchlist" class="watchlist-stats">
        <span class="stat-item">
          <span class="stat-number">{{ watchlist.length }}</span>
          <span class="stat-label">en tu lista</span>
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
          :show-rating="false"
          :show-year="true"
          :show-status-icon="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useShowsStore } from '@/stores/shows'
import MovieCard from '@/components/MovieCard.vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'

const showsStore = useShowsStore()
const route = useRoute()

onBeforeRouteLeave(() => {
  showsStore.setSearchQuery('')
})

const watchlist = computed(() => {
  const type = route.query.type || 'series'
  let list = showsStore.watchlist
  if (type === 'series') {
    list = list.filter(movie => movie.mediaType !== 'movie')
  } else if (type === 'movies') {
    list = list.filter(movie => movie.mediaType === 'movie')
  }
  if (!showsStore.searchQuery) {
    return list
  }
  return list.filter(movie =>
    movie.title.toLowerCase().includes(showsStore.searchQuery.toLowerCase())
  )
})

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
    grid-template-columns: repeat(6, 1fr);
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

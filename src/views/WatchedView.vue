<template>
  <div class="watched-view">
    <div class="watched-header">
      <h1>Series Vistas</h1>
      <p>Series que ya has terminado de ver</p>
    </div>

    <div class="watched-content">
      <div v-if="hasWatched" class="watched-stats">
        <span class="stat-item">
          <span class="stat-number">{{ watched.length }}</span>
          <span class="stat-label">series vistas</span>
        </span>
      </div>

      <div v-if="watched.length === 0" class="empty-state">
        <div class="empty-icon">✅</div>
        <h3>No has visto ninguna serie</h3>
        <p>Marca series como vistas desde la pantalla de exploración</p>
        <router-link to="/" class="cta-button"> Explorar Series </router-link>
      </div>

      <div v-else class="watched-grid">
        <MovieCard
          v-for="movie in watched"
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

const watched = computed(() => showsStore.watched)
const hasWatched = computed(() => showsStore.hasWatched)
</script>

<style scoped>
.watched-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #121212;
  min-height: 100%;
}

.watched-header {
  text-align: center;
  margin-bottom: 40px;
}

.watched-header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  color: #fff;
  font-weight: 700;
}

.watched-header p {
  margin: 0;
  font-size: 16px;
  color: #aaa;
}

.watched-content {
  margin-top: 40px;
}

.watched-stats {
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
  color: #28a745;
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
  background: #28a745;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.cta-button:hover {
  background: #218838;
}

.watched-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .watched-view {
    padding: 16px;
  }

  .watched-header {
    margin-bottom: 30px;
  }

  .watched-header h1 {
    font-size: 24px;
  }

  .watched-content {
    margin-top: 30px;
  }

  .stat-number {
    font-size: 20px;
  }

  .watched-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { useShowsStore } from '@/stores/shows'
</script>

<template>
  <div class="home-view">
    <div class="hero-section">
      <h1>¡Bienvenido a SeriesTracker!</h1>
      <p>Organiza y rastrea tus series favoritas de manera fácil y divertida</p>
      <router-link to="/search" class="cta-button"> 🔍 Buscar Series </router-link>
    </div>

    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📺</div>
          <div class="stat-content">
            <h3>Watchlist</h3>
            <p class="stat-number">{{ watchlist.length }}</p>
            <p class="stat-description">Series por ver</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>Vistas</h3>
            <p class="stat-number">{{ watched.length }}</p>
            <p class="stat-description">Series completadas</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <h3>Favoritos</h3>
            <p class="stat-number">{{ favorites.length }}</p>
            <p class="stat-description">Series favoritas</p>
          </div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h2>Acciones Rápidas</h2>
      <div class="actions-grid">
        <router-link to="/search" class="action-card">
          <div class="action-icon">🔍</div>
          <h3>Buscar Series</h3>
          <p>Encuentra nuevas series para agregar a tus listas</p>
        </router-link>

        <router-link to="/watchlist" class="action-card">
          <div class="action-icon">📺</div>
          <h3>Mi Watchlist</h3>
          <p>Revisa las series que quieres ver</p>
        </router-link>

        <router-link to="/watched" class="action-card">
          <div class="action-icon">✅</div>
          <h3>Series Vistas</h3>
          <p>Ve tu historial de series completadas</p>
        </router-link>

        <router-link to="/favorites" class="action-card">
          <div class="action-icon">⭐</div>
          <h3>Mis Favoritos</h3>
          <p>Accede a tus series favoritas</p>
        </router-link>
      </div>
    </div>

    <div v-if="hasAnyShows" class="recent-shows">
      <h2>Series Recientes</h2>
      <div class="recent-grid">
        <div v-for="show in recentShows" :key="show.id" class="recent-show">
          <img :src="show.poster" :alt="show.name" @error="handleImageError" />
          <div class="recent-show-info">
            <h4>{{ show.name }}</h4>
            <p>{{ show.network }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useShowsStore } from '@/stores/shows'

const showsStore = useShowsStore()

const watchlist = computed(() => showsStore.watchlist)
const watched = computed(() => showsStore.watched)
const favorites = computed(() => showsStore.favorites)

const hasAnyShows = computed(
  () => watchlist.value.length > 0 || watched.value.length > 0 || favorites.value.length > 0,
)

const recentShows = computed(() => {
  const allShows = [...watchlist.value, ...watched.value, ...favorites.value]

  // Remover duplicados y tomar los últimos 6
  const uniqueShows = allShows.filter(
    (show, index, self) => index === self.findIndex((s) => s.id === show.id),
  )

  return uniqueShows.slice(-6)
})

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-poster.jpg'
}
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  margin-bottom: 40px;
}

.hero-section h1 {
  margin: 0 0 16px 0;
  font-size: 36px;
  font-weight: 700;
}

.hero-section p {
  margin: 0 0 32px 0;
  font-size: 18px;
  opacity: 0.9;
}

.cta-button {
  display: inline-block;
  background: white;
  color: #667eea;
  padding: 12px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
}

.stats-section {
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
}

.stat-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #666;
}

.stat-number {
  margin: 0 0 4px 0;
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.stat-description {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  text-align: center;
  margin: 0 0 30px 0;
  font-size: 28px;
  color: #333;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-4px);
}

.action-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.action-card h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.action-card p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.recent-shows {
  margin-bottom: 40px;
}

.recent-shows h2 {
  text-align: center;
  margin: 0 0 30px 0;
  font-size: 28px;
  color: #333;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.recent-show {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-show img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recent-show-info {
  padding: 12px;
}

.recent-show-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.3;
}

.recent-show-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

@media (max-width: 768px) {
  .home-view {
    padding: 16px;
  }

  .hero-section {
    padding: 40px 20px;
  }

  .hero-section h1 {
    font-size: 28px;
  }

  .hero-section p {
    font-size: 16px;
  }

  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }

  .recent-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>

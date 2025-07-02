<template>
  <nav class="navigation">
    <div class="nav-container">
      <router-link to="/" class="nav-logo" @click="clearSearchAndGoHome">
        <span class="logo-icon">📺</span>
        <span class="logo-text">SeriesTracker</span>
      </router-link>

      <div class="nav-links">
        <a href="#" @click.prevent="clearSearchAndGoHome" class="nav-link" :class="{ active: $route.path === '/' }">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">Inicio</span>
        </a>

        <router-link to="/search" class="nav-link" active-class="active">
          <span class="nav-icon">🔍</span>
          <span class="nav-text">Buscar</span>
        </router-link>

        <router-link to="/watchlist" class="nav-link" active-class="active">
          <span class="nav-icon">📺</span>
          <span class="nav-text">Watchlist</span>
          <span v-if="watchlistCount > 0" class="nav-badge">{{ watchlistCount }}</span>
        </router-link>

        <router-link to="/watched" class="nav-link" active-class="active">
          <span class="nav-icon">✅</span>
          <span class="nav-text">Vistas</span>
          <span v-if="watchedCount > 0" class="nav-badge">{{ watchedCount }}</span>
        </router-link>

        <router-link to="/favorites" class="nav-link" active-class="active">
          <span class="nav-icon">⭐</span>
          <span class="nav-text">Favoritos</span>
          <span v-if="favoritesCount > 0" class="nav-badge">{{ favoritesCount }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useShowsStore } from '@/stores/shows'

const router = useRouter()
const showsStore = useShowsStore()

// Contadores para los badges
const watchlistCount = computed(() => showsStore.watchlist.length)
const watchedCount = computed(() => showsStore.watched.length)
const favoritesCount = computed(() => showsStore.favorites.length)

const clearSearchAndGoHome = () => {
  showsStore.setSearchQuery('')
  showsStore.setSearchResults([])
  router.push('/')
}
</script>

<style scoped>
.navigation {
  background: white;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 700;
  font-size: 20px;
  transition: color 0.2s;
}

.nav-logo:hover {
  color: #007bff;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  text-decoration: none;
  color: #666;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  font-size: 14px;
  font-weight: 500;
}

.nav-link:hover {
  background: #f8f9fa;
  color: #333;
}

.nav-link.active {
  background: #007bff;
  color: white;
}

.nav-icon {
  font-size: 16px;
}

.nav-text {
  display: none;
}

.nav-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}

@media (min-width: 768px) {
  .nav-text {
    display: inline;
  }

  .nav-links {
    gap: 16px;
  }

  .nav-link {
    padding: 10px 20px;
    font-size: 16px;
  }

  .nav-icon {
    font-size: 18px;
  }
}
</style>

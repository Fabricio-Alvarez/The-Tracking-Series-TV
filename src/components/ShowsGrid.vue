<template>
  <div class="shows-grid-container">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Buscando series...</p>
    </div>

    <div v-else-if="shows.length === 0 && hasSearched" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>No se encontraron series</h3>
      <p>Intenta con otros términos de búsqueda</p>
    </div>

    <div v-else-if="shows.length > 0" class="shows-grid">
      <ShowCard v-for="show in shows" :key="show.id" :show="show" />
    </div>

    <div v-else class="welcome-state">
      <div class="welcome-icon">📺</div>
      <h3>¡Bienvenido a tu Tracking de Series!</h3>
      <p>Busca tus series favoritas y organízalas en tus listas personalizadas</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useShowsStore } from '@/stores/shows'
import ShowCard from './ShowCard.vue'
import type { Show } from '@/stores/shows'

interface Props {
  shows?: Show[]
  isLoading?: boolean
  hasSearched?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  shows: () => [],
  isLoading: false,
  hasSearched: false,
})

const showsStore = useShowsStore()

// Si no se proporcionan shows, usar los del store
const shows = computed(() => (props.shows.length > 0 ? props.shows : showsStore.searchResults))
const isLoading = computed(() => props.isLoading || showsStore.isLoading)
const hasSearched = computed(() => props.hasSearched || showsStore.searchQuery.length > 0)
</script>

<style scoped>
.shows-grid-container {
  width: 100%;
  min-height: 400px;
}

.loading-container {
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
  border-top: 4px solid #007bff;
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

.empty-state,
.welcome-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
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
  color: #333;
}

.empty-state p,
.welcome-state p {
  margin: 0;
  font-size: 16px;
  color: #666;
  max-width: 400px;
}

.shows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 20px 0;
}

@media (max-width: 768px) {
  .shows-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    padding: 16px 0;
  }

  .empty-state,
  .welcome-state {
    padding: 40px 20px;
  }

  .empty-icon,
  .welcome-icon {
    font-size: 36px;
  }

  .empty-state h3,
  .welcome-state h3 {
    font-size: 20px;
  }
}
</style>

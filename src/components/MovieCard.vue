<template>
  <div class="movie-item" @dblclick="goToDetail" @click="handleCardClick">
    <div class="movie-card" @click="$emit('click', movie)">
      <div v-if="showRating" class="movie-rating">{{ movie.rating }}</div>
      <img :src="movie.image" :alt="movie.title" class="movie-image" @error="handleImageError" />

      <!-- Overlay con botones de acción -->
      <div class="movie-overlay">
        <div class="movie-actions">
          <button
            @click.stop="toggleWatchlist"
            :class="['action-btn', { active: isInWatchlist }]"
            :title="isInWatchlist ? 'Quitar de Watchlist' : 'Agregar a Watchlist'"
            :disabled="isLoading"
          >
            <ion-icon name="tv-outline"></ion-icon>
          </button>

          <button
            @click.stop="toggleWatched"
            :class="['action-btn', { active: isInWatched }]"
            :title="isInWatched ? 'Quitar de Vistas' : 'Marcar como Vista'"
            :disabled="isLoading"
          >
            <ion-icon name="checkmark-outline"></ion-icon>
          </button>

          <button
            @click.stop="toggleFavorites"
            :class="['action-btn', { active: isInFavorites }]"
            :title="isInFavorites ? 'Quitar de Favoritos' : 'Agregar a Favoritos'"
            :disabled="isLoading"
          >
            <ion-icon name="heart-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
    <div class="movie-title">{{ movie.title }}</div>
    <div v-if="showYear" class="movie-year">{{ movie.year }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useShowsStore } from '@/stores/shows'
import type { Movie } from '@/services/tvdbService'
import { useRouter } from 'vue-router'

interface Props {
  movie: Movie
  showRating?: boolean
  showYear?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRating: true,
  showYear: false,
})

const showsStore = useShowsStore()
const isLoading = ref(false)
const router = useRouter()

// Computed properties para verificar estado
const isInWatchlist = computed(() => showsStore.isInWatchlist(props.movie.id))
const isInWatched = computed(() => showsStore.isInWatched(props.movie.id))
const isInFavorites = computed(() => showsStore.isInFavorites(props.movie.id))

// Event handlers
const toggleWatchlist = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    if (isInWatchlist.value) {
      await showsStore.removeFromWatchlist(props.movie.id)
    } else {
      await showsStore.addToWatchlist(props.movie)
    }
  } catch (error) {
    console.error('Error al toggle watchlist:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleWatched = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    if (isInWatched.value) {
      await showsStore.removeFromWatched(props.movie.id)
    } else {
      await showsStore.addToWatched(props.movie)
    }
  } catch (error) {
    console.error('Error al toggle watched:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleFavorites = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    if (isInFavorites.value) {
      await showsStore.removeFromFavorites(props.movie.id)
    } else {
      await showsStore.addToFavorites(props.movie)
    }
  } catch (error) {
    console.error('Error al toggle favorites:', error)
  } finally {
    isLoading.value = false
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/300x450/333/fff?text=No+Image'
}

function goToDetail() {
  router.push({ name: 'show-detail', params: { id: String(props.movie.id) } })
}

function handleCardClick(event: MouseEvent) {
  // Si el click fue en un botón de acción, no navegar
  const target = event.target as HTMLElement
  if (target.closest('.action-btn')) return
  // En móvil, un solo toque/clic abre el detalle
  if (window.innerWidth <= 768) {
    goToDetail()
  }
}
</script>

<style scoped>
.movie-item {
  display: flex;
  flex-direction: column;
}

.movie-card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 2/3;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.movie-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #333;
}

.movie-rating {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 2;
}

/* Overlay con botones de acción */
.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.movie-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
}

.action-btn:hover:not(:disabled) {
  background: white;
  transform: scale(1.1);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.action-btn.active {
  background: #6c7ae0;
  color: white;
}

.action-btn ion-icon {
  font-size: 18px;
}

.movie-title {
  margin-top: 6px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-year {
  font-size: 12px;
  color: #aaa;
}

/* Responsive */
@media (min-width: 768px) {
  .movie-title {
    font-size: 15px;
  }

  .action-btn {
    width: 40px;
    height: 40px;
  }

  .action-btn ion-icon {
    font-size: 20px;
  }
}
</style>

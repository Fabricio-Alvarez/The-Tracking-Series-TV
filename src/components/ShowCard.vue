<template>
  <div class="show-card" @dblclick="goToDetail">
    <div class="show-image">
      <img :src="show.image" :alt="show.title" @error="handleImageError" />
      <div class="show-overlay">
        <div class="show-actions">
          <button
            @click="toggleWatchlist"
            :class="['action-btn', { active: isInWatchlist }]"
            :title="isInWatchlist ? 'Quitar de Watchlist' : 'Agregar a Watchlist'"
          >
            📺
          </button>
          <button
            @click="toggleWatched"
            :class="['action-btn', { active: isInWatched }]"
            :title="isInWatched ? 'Quitar de Vistas' : 'Marcar como Watched'"
          >
            ✅
          </button>
          <button
            @click="toggleFavorites"
            :class="['action-btn', { active: isInFavorites }]"
            :title="isInFavorites ? 'Quitar de Favoritos' : 'Agregar a Favorites'"
          >
            ⭐
          </button>
        </div>
      </div>
    </div>

    <div class="show-info">
      <h3 class="show-title">{{ show.title }}</h3>
      <p class="show-overview">{{ truncatedOverview }}</p>

      <div class="show-details">
        <span class="show-status" :class="statusClass">{{ show.status }}</span>
        <span class="show-network">{{ show.network }}</span>
        <span class="show-rating">⭐ {{ show.rating }}/10</span>
      </div>

      <div class="show-date">
        <span>Año: {{ show.year }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useShowsStore } from '@/stores/shows'
import type { Movie } from '@/services/tvdbService'

interface Props {
  show: Movie
}

const props = defineProps<Props>()
const showsStore = useShowsStore()
const router = useRouter()


const truncatedOverview = computed(() => {
  const maxLength = 150
  return props.show.overview && props.show.overview.length > maxLength
    ? props.show.overview.substring(0, maxLength) + '...'
    : props.show.overview
})

const isInWatchlist = computed(() => showsStore.isInWatchlist(props.show.id))
const isInWatched = computed(() => showsStore.isInWatched(props.show.id))
const isInFavorites = computed(() => showsStore.isInFavorites(props.show.id))

const statusClass = computed(() => {
  const status = (props.show.status || '').toLowerCase()
  if (status.includes('running') || status.includes('continuing')) return 'status-running'
  if (status.includes('ended') || status.includes('canceled')) return 'status-ended'
  return 'status-unknown'
})

// Methods
const toggleWatchlist = () => {
  if (isInWatchlist.value) {
    showsStore.removeFromWatchlist(props.show.id)
  } else {
    showsStore.addToWatchlist(props.show)
  }
}

const toggleWatched = () => {
  if (isInWatched.value) {
    showsStore.removeFromWatched(props.show.id)
  } else {
    showsStore.addToWatched(props.show)
  }
}

const toggleFavorites = () => {
  if (isInFavorites.value) {
    showsStore.removeFromFavorites(props.show.id)
  } else {
    showsStore.addToFavorites(props.show)
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-poster.jpg'
}

const formatDate = (dateString?: string) => {
  if (!dateString || dateString === 'Fecha no disponible') return 'Fecha no disponible'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

function goToDetail() {
  router.push({ name: 'show-detail', params: { id: String(props.show.id) } })
}
</script>

<style scoped>
.show-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.show-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.show-image {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.show-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.show-card:hover .show-image img {
  transform: scale(1.05);
}

.show-overlay {
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
}

.show-card:hover .show-overlay {
  opacity: 1;
}

.show-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: white;
  transform: scale(1.1);
}

.action-btn.active {
  background: #007bff;
  color: white;
}

.show-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.show-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.show-overview {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  flex: 1;
}

.show-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.show-status,
.show-network,
.show-rating {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background: #f8f9fa;
  color: #666;
}

.status-running {
  background: #d4edda;
  color: #155724;
}

.status-ended {
  background: #f8d7da;
  color: #721c24;
}

.status-unknown {
  background: #fff3cd;
  color: #856404;
}

.show-date {
  font-size: 12px;
  color: #999;
  margin-top: auto;
}
</style>

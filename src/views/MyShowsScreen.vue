<template>
  <div class="myshows-screen">
    <div class="myshows-inner">
      <div class="myshows-cards">
        <!-- Watchlist Card -->
        <div class="myshows-card" @click="goTo('watchlist')">
          <div class="myshows-preview">
            <img
              v-for="movie in watchlistPreview"
              :key="movie.id"
              :src="movie.image"
              :alt="movie.title"
              class="preview-img"
              @error="handleImageError"
            />
            <div v-if="watchlistPreview.length === 0" class="empty-preview">Sin series</div>
          </div>
          <div class="myshows-card-footer">
            <span>Watchlist</span>
            <span class="count">{{ watchlist.length }}</span>
          </div>
        </div>
        <!-- Watched Card -->
        <div class="myshows-card" @click="goTo('watched')">
          <div class="myshows-preview">
            <img
              v-for="movie in watchedPreview"
              :key="movie.id"
              :src="movie.image"
              :alt="movie.title"
              class="preview-img"
              @error="handleImageError"
            />
            <div v-if="watchedPreview.length === 0" class="empty-preview">Sin series</div>
          </div>
          <div class="myshows-card-footer">
            <span>Watched</span>
            <span class="count">{{ watched.length }}</span>
          </div>
        </div>
        <!-- Favorites Card -->
        <div class="myshows-card" @click="goTo('favorites')">
          <div class="myshows-preview">
            <img
              v-for="movie in favoritesPreview"
              :key="movie.id"
              :src="movie.image"
              :alt="movie.title"
              class="preview-img"
              @error="handleImageError"
            />
            <div v-if="favoritesPreview.length === 0" class="empty-preview">Sin series</div>
          </div>
          <div class="myshows-card-footer">
            <span>Favorites</span>
            <span class="count">{{ favorites.length }}</span>
          </div>
        </div>
      </div>
      <h2 class="watching-title">Watching</h2>
      <div class="watching-list">
        <template v-if="watching.length > 0">
          <div class="watching-grid">
            <MovieCard
              v-for="movie in watching"
              :key="movie.id"
              :movie="movie"
              :show-rating="true"
              :show-year="true"
            />
          </div>
        </template>
        <template v-else>
          <div class="empty-watching">No tienes series en Watching.</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useShowsStore } from '@/stores/shows'
import MovieCard from '@/components/MovieCard.vue'

const router = useRouter()
const showsStore = useShowsStore()

const watchlist = computed(() => showsStore.watchlist)
const watched = computed(() => showsStore.watched)
const favorites = computed(() => showsStore.favorites)
const watching = computed(() => {
  // Filtrar series que están en watching pero no en watched
  return showsStore.watching.filter(movie => !showsStore.isInWatched(movie.id))
})

const watchlistPreview = computed(() => watchlist.value.slice(0, 4))
const watchedPreview = computed(() => watched.value.slice(0, 4))
const favoritesPreview = computed(() => favorites.value.slice(0, 4))

function goTo(type: string) {
  if (type === 'watchlist') router.push({ name: 'watchlist' })
  if (type === 'watched') router.push({ name: 'watched' })
  if (type === 'favorites') router.push({ name: 'favorites' })
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/80x120/333/fff?text=No+Image'
}
</script>

<style scoped>
.myshows-screen {
  width: 100%;
  min-height: 100%;
  background-color: #121212;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.myshows-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.myshows-cards {
  display: flex;
  gap: 32px;
  width: 100%;
  justify-content: center;
  margin-bottom: 40px;
}
.myshows-card {
  background: #181818;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  padding: 24px 16px 12px 16px;
  min-width: 220px;
  max-width: 260px;
  flex: 1 1 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.15s, box-shadow 0.15s;
}
.myshows-card:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 6px 24px rgba(108,122,224,0.18);
}
.myshows-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  min-height: 120px;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}
.preview-img {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  background: #333;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
}
.empty-preview {
  color: #888;
  font-size: 14px;
  font-style: italic;
}
.myshows-card-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #222;
  padding-top: 10px;
  font-size: 17px;
  color: #fff;
  font-weight: 600;
}
.count {
  color: #6c7ae0;
  font-size: 18px;
  font-weight: 700;
}
.watching-title {
  width: 100%;
  text-align: left;
  color: #fff;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 18px;
  margin-top: 10px;
}
.watching-list {
  width: 100%;
  min-height: 60px;
}
.watching-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}
.empty-watching {
  color: #888;
  font-size: 16px;
  text-align: center;
  padding: 30px 0 10px 0;
}
@media (max-width: 900px) {
  .myshows-cards {
    flex-direction: column;
    gap: 24px;
    align-items: center;
  }
  .myshows-inner {
    padding: 12px;
  }
}
</style>


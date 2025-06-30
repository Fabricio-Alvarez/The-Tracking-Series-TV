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
            <div v-for="movie in watching" :key="movie.id" class="watching-progress-card custom-watching-card">
              <div class="watching-card-media">
                <img :src="movie.image" :alt="movie.title" class="watching-card-img" @error="handleImageError" />
                <div class="watching-card-info">
                  <div class="watching-card-title">{{ movie.title }}</div>
                  <div class="watching-card-episode">
                    <span class="episode-new">NEW!</span>
                    <span class="episode-code">{{ getLastWatchedEpisodeCode(movie) }}</span>
                    <span class="episode-title">{{ movie.seasons && movie.seasons.length > 0 ? movie.seasons[getSeasonProgress(movie).season-1]?.title || '' : '' }}</span>
                  </div>
                  <div class="watching-card-progressbar">
                    <div class="progress-bar">
                      <div class="progress-bar-fill" :style="{ width: (getSeasonProgress(movie).total > 0 ? (getSeasonProgress(movie).watched / getSeasonProgress(movie).total * 100) : 0) + '%' }"></div>
                    </div>
                    <div class="watching-card-episodes-row">
                      <span class="episodes-watched">{{ getSeasonProgress(movie).watched }}/{{ getSeasonProgress(movie).total }}</span>
                      <span class="episodes-left">{{ getSeasonProgress(movie).left }} left</span>
                    </div>
                  </div>
                  <div class="watching-card-actions">
                    <button class="watched-btn" @click="markAsWatched(movie)">Watched</button>
                    <button class="summary-btn" @click="goToSummary(movie)">Summary</button>
                  </div>
                </div>
              </div>
            </div>
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
  // Filtrar series que están en watching pero no en watched y revertir la lista
  return showsStore.watching.filter(movie => !showsStore.isInWatched(movie.id)).slice().reverse()
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


interface ProgressInfo {
  watched: number
  total: number
  left: number
  season: number
}

const seriesWatchData: Record<string, any> = {
  'wednesday': { seasons: [{ number: 1, total: 8 }] },
  'stranger things': { seasons: [ { number: 4, total: 9 }, { number: 3, total: 8 }, { number: 2, total: 9 }, { number: 1, total: 8 } ] },
  'peaky blinders': { seasons: [ { number: 6, total: 6 }, { number: 5, total: 6 }, { number: 4, total: 6 }, { number: 3, total: 6 }, { number: 2, total: 6 }, { number: 1, total: 6 } ] },
  'the mandalorian': { seasons: [ { number: 3, total: 8 }, { number: 2, total: 8 }, { number: 1, total: 8 } ] },
  'the crown': { seasons: [ { number: 6, total: 10 }, { number: 5, total: 10 }, { number: 4, total: 10 }, { number: 3, total: 10 }, { number: 2, total: 10 }, { number: 1, total: 10 } ] },
  'dark': { seasons: [ { number: 3, total: 8 }, { number: 2, total: 8 }, { number: 1, total: 10 } ] },
  'the boys': { seasons: [ { number: 4, total: 8 }, { number: 3, total: 8 }, { number: 2, total: 8 }, { number: 1, total: 8 } ] },
  'la casa de papel': { seasons: [ { number: 5, total: 10 }, { number: 4, total: 8 }, { number: 3, total: 8 }, { number: 2, total: 9 }, { number: 1, total: 13 } ] },
}

function getSeasonProgress(movie: any): ProgressInfo {
  // Buscar la última temporada marcada por el usuario
  const lastWatchedKey = `lastWatched_${movie.id}`
  let lastWatched = { season: 1, episode: 1 }
  try {
    const data = JSON.parse(localStorage.getItem(lastWatchedKey) || '{}')
    if (data && data.season) {
      lastWatched = data
    }
  } catch {}
  const season = lastWatched.season || 1
  // Buscar en localStorage el progreso de episodios vistos para esa temporada
  const storageKey = `episodes_${movie.id}_season_${season}`
  let watchedEpisodes: number[] = []
  try {
    watchedEpisodes = JSON.parse(localStorage.getItem(storageKey) || '[]')
  } catch {
    watchedEpisodes = []
  }
  // Obtener el total de episodios de la temporada de forma robusta
  let total = 10
  let seasonsArr = movie.seasons
  // Si no existe en el objeto, buscar en el mock
  if (!seasonsArr) {
    const key = (movie.title || '').toLowerCase().trim()
    if (seriesWatchData[key]) {
      seasonsArr = seriesWatchData[key].seasons
    }
  }
  if (seasonsArr && seasonsArr[season - 1]) {
    if (Array.isArray(seasonsArr[season - 1].episodes)) {
      total = seasonsArr[season - 1].episodes.length
    } else if (typeof seasonsArr[season - 1].total === 'number') {
      total = seasonsArr[season - 1].total
    }
  }
  const watched = watchedEpisodes.length
  const left = total - watched
  return { watched, total, left, season }
}

function getLastWatchedEpisodeCode(movie: any): string {
  const lastWatchedKey = `lastWatched_${movie.id}`
  let lastWatched = { season: 1, episode: 1 }
  try {
    const data = JSON.parse(localStorage.getItem(lastWatchedKey) || '{}')
    if (data && data.season) {
      lastWatched = data
    }
  } catch {}

  return `s${String(lastWatched.season).padStart(2, '0')}e${String(lastWatched.episode).padStart(2, '0')}`
}

function markAsWatched(movie: any) {
  showsStore.addToWatched(movie)
}

function goToSummary(movie: any) {
  router.push({ name: 'show-detail', params: { id: String(movie.id) } })
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
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.empty-watching {
  color: #888;
  font-size: 16px;
  text-align: center;
  padding: 30px 0 10px 0;
}
.watching-progress-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #181818;
  border-radius: 12px;
  padding: 10px 0 0 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  justify-content: space-between;
}
.progress-info-bar {
  margin-top: 4px;
}
.progress-labels {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #aaa;
  margin-bottom: 2px;
}
.progress-label {
  background: #23243a;
  border-radius: 6px;
  padding: 2px 8px;
  font-weight: 500;
}
.progress-label-ep {
  color: #6c7ae0;
  background: #23243a;
}
.progress-label-left {
  color: #aaa;
  background: transparent;
}
.progress-label-code {
  background: #23243a;
  color: #fff;
  font-family: monospace;
  font-size: 15px;
  padding: 2px 10px;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 1px;
}
.progress-bar {
  flex: 1 1 0;
  height: 7px;
  background: #23243a;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 10px;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6c7ae0, #007bff);
  border-radius: 4px;
  transition: width 0.3s;
}
.watching-actions {
  display: flex;
  gap: 0;
  width: 100%;
  justify-content: space-between;
  margin-top: auto;
  padding: 0;
  box-sizing: border-box;
}
.watched-btn, .summary-btn {
  flex: 1 1 0;
  margin: 0;
  border-radius: 0;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  box-sizing: border-box;
}
.watched-btn {
  background: #6c7ae0;
  color: #fff;
  border: none;
  border-bottom-left-radius: 12px;
}
.watched-btn:hover {
  background: #4e5bbd;
}
.summary-btn {
  background: #23243a;
  color: #fff;
  border: none;
  border-bottom-right-radius: 12px;
}
.summary-btn:hover {
  background: #33344a;
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
.custom-watching-card {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  min-height: 140px;
}
.watching-card-media {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: flex-start;
}
.watching-card-img {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  background: #333;
  flex-shrink: 0;
  margin: 12px;
}
.watching-card-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1 1 0;
  padding: 12px 12px 12px 0;
  min-width: 0;
}
.watching-card-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 350px;
}
.watching-card-episode {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 8px;
}
.episode-new {
  color: #4caf50;
  font-weight: 700;
  font-size: 12px;
}
.episode-code {
  background: #23243a;
  color: #fff;
  border-radius: 6px;
  padding: 2px 8px;
  font-family: monospace;
  font-size: 13px;
  font-weight: 600;
}
.episode-title {
  color: #aaa;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.watching-card-progressbar {
  margin-bottom: 0;
  margin-top: 2px;
}
.watching-card-episodes-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 2px;
  margin-bottom: 12px;
}
.episodes-watched {
  color: #6c7ae0;
  font-weight: 600;
  font-size: 13px;
  margin-right: 8px;
}
.episodes-left {
  color: #aaa;
  font-size: 13px;
  margin-left: auto;
}
.watching-card-actions {
  display: flex;
  gap: 0;
  margin-top: 8px;
  align-items: center;
}
.watched-btn, .summary-btn {
  border-radius: 24px;
  padding: 12px 32px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-sizing: border-box;
  border: none;
  margin-right: 12px;
}
.watched-btn {
  background: #bfc6ff;
  color: #23243a;
}
.summary-btn {
  background: transparent;
  color: #bfc6ff;
  margin-right: 0;
}
@media (max-width: 700px) {
  .custom-watching-card {
    max-width: 100%;
  }
  .watching-card-title {
    max-width: 100%;
    font-size: 17px;
  }
  .watched-btn, .summary-btn {
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
    margin-right: 0;
  }
  .watching-card-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>


<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShowsStore } from '@/stores/shows'
import type { Movie } from '@/services/tvdbService'
import TVDBService from '@/services/tvdbService'

const route = useRoute()
const router = useRouter()
const showsStore = useShowsStore()

const showId = String(route.params.id)
const show = computed(() => showsStore.getShowById(showId))
const loading = ref(false)
const notFound = ref(false)

const isInWatchlist = computed(() => show.value && showsStore.isInWatchlist(show.value.id))
const isInWatched = computed(() => show.value && showsStore.isInWatched(show.value.id))
const isInFavorites = computed(() => show.value && showsStore.isInFavorites(show.value.id))
const isInWatching = computed(() => show.value && showsStore.isInWatching(show.value.id))

const isLoading = ref(false)
const enhancedShow = ref<Movie | null>(null)


async function loadRealShowData() {
  if (!show.value) return
  
  try {
    isLoading.value = true
    const realShowData = await TVDBService.getShowDetails(showId)
    
    if (realShowData) {
      enhancedShow.value = realShowData
      
      showsStore.addShowsToResults([realShowData])
    }
  } catch (error) {
    console.error('Error loading real show data:', error)
  } finally {
    isLoading.value = false
  }
}


const seriesOverrides: Record<string, {
  genres: string[]
  seasons: number
  creators: string[]
  status: string
  runtime: string
}> = {
  'peaky blinders': {
    genres: ['History', 'Mystery', 'Drama', 'Police', 'Crime', 'Police procedural', 'Thriller', 'Detective fiction'],
    seasons: 6,
    creators: ['Steven Knight'],
    status: 'Ended',
    runtime: '60m',
  },
  'stranger things': {
    genres: ['Drama', 'Fantasy', 'Horror', 'Mystery', 'Sci-Fi'],
    seasons: 4,
    creators: ['The Duffer Brothers'],
    status: 'Ongoing',
    runtime: '50m',
  },
  'the mandalorian': {
    genres: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi', 'Space Western'],
    seasons: 3,
    creators: ['Jon Favreau'],
    status: 'Ongoing',
    runtime: '40m',
  },
  'the crown': {
    genres: ['Drama', 'History', 'Biography'],
    seasons: 6,
    creators: ['Peter Morgan'],
    status: 'Ended',
    runtime: '60m',
  },
  'dark': {
    genres: ['Drama', 'Mystery', 'Sci-Fi', 'Thriller'],
    seasons: 3,
    creators: ['Baran bo Odar', 'Jantje Friese'],
    status: 'Ended',
    runtime: '60m',
  },
  'the boys': {
    genres: ['Action', 'Comedy', 'Crime', 'Drama', 'Sci-Fi'],
    seasons: 4,
    creators: ['Eric Kripke'],
    status: 'Ongoing',
    runtime: '60m',
  },
  'better call saul': {
    genres: ['Crime', 'Drama'],
    seasons: 6,
    creators: ['Vince Gilligan', 'Peter Gould'],
    status: 'Ended',
    runtime: '47m',
  },
  'the witcher': {
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy', 'Mystery'],
    seasons: 3,
    creators: ['Lauren Schmidt Hissrich'],
    status: 'Ongoing',
    runtime: '60m',
  },
  'money heist': {
    genres: ['Action', 'Crime', 'Drama', 'Mystery', 'Thriller'],
    seasons: 5,
    creators: ['Álex Pina'],
    status: 'Ended',
    runtime: '50m',
  },
  'ozark': {
    genres: ['Crime', 'Drama', 'Thriller'],
    seasons: 4,
    creators: ['Bill Dubuque', 'Mark Williams'],
    status: 'Ended',
    runtime: '60m',
  },
  'westworld': {
    genres: ['Drama', 'Mystery', 'Sci-Fi', 'Western'],
    seasons: 4,
    creators: ['Jonathan Nolan', 'Lisa Joy'],
    status: 'Ended',
    runtime: '60m',
  },
  'the office': {
    genres: ['Comedy'],
    seasons: 9,
    creators: ['Greg Daniels'],
    status: 'Ended',
    runtime: '22m',
  },
  'wednesday': {
    genres: ['Comedy', 'Crime', 'Fantasy'],
    seasons: 1,
    creators: ['Alfred Gough', 'Miles Millar'],
    status: 'Ongoing',
    runtime: '50m',
  },
  'fleabag': {
    genres: ['Comedy', 'Drama'],
    seasons: 2,
    creators: ['Phoebe Waller-Bridge'],
    status: 'Ended',
    runtime: '25m',
  },
  'the marvelous mrs. maisel': {
    genres: ['Comedy', 'Drama'],
    seasons: 5,
    creators: ['Amy Sherman-Palladino'],
    status: 'Ended',
    runtime: '60m',
  },
  'chernobyl': {
    genres: ['Drama', 'History', 'Thriller'],
    seasons: 1,
    creators: ['Craig Mazin'],
    status: 'Ended',
    runtime: '60m',
  },
  'mindhunter': {
    genres: ['Crime', 'Drama', 'Thriller'],
    seasons: 2,
    creators: ['Joe Penhall'],
    status: 'Ended',
    runtime: '60m',
  },
  'the expanse': {
    genres: ['Drama', 'Mystery', 'Sci-Fi', 'Thriller'],
    seasons: 6,
    creators: ['Mark Fergus', 'Hawk Ostby'],
    status: 'Ended',
    runtime: '45m',
  },
  'succession': {
    genres: ['Drama'],
    seasons: 4,
    creators: ['Jesse Armstrong'],
    status: 'Ended',
    runtime: '60m',
  },
  'barry': {
    genres: ['Comedy', 'Crime', 'Drama', 'Thriller'],
    seasons: 4,
    creators: ['Alec Berg', 'Bill Hader'],
    status: 'Ended',
    runtime: '30m',
  },
  'the leftovers': {
    genres: ['Drama', 'Fantasy', 'Mystery'],
    seasons: 3,
    creators: ['Damon Lindelof', 'Tom Perrotta'],
    status: 'Ended',
    runtime: '60m',
  },
  'atlanta': {
    genres: ['Comedy', 'Drama', 'Music'],
    seasons: 4,
    creators: ['Donald Glover'],
    status: 'Ended',
    runtime: '30m',
  },
  'the good place': {
    genres: ['Comedy', 'Drama', 'Fantasy', 'Romance'],
    seasons: 4,
    creators: ['Michael Schur'],
    status: 'Ended',
    runtime: '22m',
  },
  'severance': {
    genres: ['Drama', 'Mystery', 'Sci-Fi', 'Thriller'],
    seasons: 2,
    creators: ['Dan Erickson'],
    status: 'Ongoing',
    runtime: '60m',
  },
  'ted lasso': {
    genres: ['Comedy', 'Drama', 'Sport'],
    seasons: 3,
    creators: ['Bill Lawrence', 'Jason Sudeikis', 'Brendan Hunt', 'Joe Kelly'],
    status: 'Ended',
    runtime: '30m',
  },
  'la casa de papel': {
    genres: ['Action', 'Crime', 'Drama', 'Mystery', 'Thriller'],
    seasons: 5,
    creators: ['Álex Pina'],
    status: 'Ended',
    runtime: '50m',
  },
  'the office (us)': {
    genres: ['Comedy', 'Romance'],
    seasons: 9,
    creators: ['Greg Daniels'],
    status: 'Ended',
    runtime: '22m',
  },
  '견우와 선녀': {
    genres: ['Drama', 'Romance', 'Fantasy', 'Historical'],
    seasons: 1,
    creators: ['Kim Jong-hak'],
    status: 'Ended',
    runtime: '60m',
  },
}

const customOverride = computed(() => {
  if (!show.value) return null
  let key = show.value.title?.toLowerCase()
  
  if (key === 'the office' && show.value.year && String(show.value.year).startsWith('2005')) key = 'the office (us)'
  return key && seriesOverrides[key] ? seriesOverrides[key] : null
})

const displayGenres = computed(() => {

  if (enhancedShow.value?.genres && enhancedShow.value.genres.length > 0) {
    return enhancedShow.value.genres
  }
  if (customOverride.value) return customOverride.value.genres
  return show.value?.genres || []
})

const displaySeasons = computed(() => {

  if (enhancedShow.value?.seasons) {
    return enhancedShow.value.seasons
  }
  if (customOverride.value) return customOverride.value.seasons
  return show.value?.seasons || 1
})

const displayCreators = computed(() => {

  if (enhancedShow.value?.creators && enhancedShow.value.creators.length > 0) {
    return enhancedShow.value.creators
  }
  if (customOverride.value) return customOverride.value.creators
  return show.value?.creators || []
})

const displayStatus = computed(() => {
 
  if (enhancedShow.value?.status) {
    return enhancedShow.value.status
  }
  if (customOverride.value) return customOverride.value.status
  return show.value?.status
})

const displayRuntime = computed(() => {
  if (customOverride.value) return customOverride.value.runtime
  return '45m'
})

const handleWatchlist = async () => {
  if (!show.value) return
  isLoading.value = true
  try {
    if (isInWatchlist.value) {
      await showsStore.removeFromWatchlist(show.value.id)
    } else {
      await showsStore.addToWatchlist(show.value)
    }
  } finally {
    isLoading.value = false
  }
}
const handleWatched = async () => {
  if (!show.value) return
  isLoading.value = true
  try {
    if (isInWatched.value) {
      await showsStore.removeFromWatched(show.value.id)
    } else {
      await showsStore.addToWatched(show.value)
    }
  } finally {
    isLoading.value = false
  }
}
const handleFavorites = async () => {
  if (!show.value) return
  isLoading.value = true
  try {
    if (isInFavorites.value) {
      await showsStore.removeFromFavorites(show.value.id)
    } else {
      await showsStore.addToFavorites(show.value)
    }
  } finally {
    isLoading.value = false
  }
}

async function goToWatch() {
  if (!show.value) return
  
  isLoading.value = true
  try {
   
    if (!showsStore.isInWatching(show.value.id)) {
      await showsStore.addToWatching(show.value)
    }
    router.push({ name: 'show-watch', params: { id: showId } })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (!show.value) {
    loading.value = true
    const loaded = await showsStore.fetchShowById(showId)
    loading.value = false
    if (!loaded) notFound.value = true
  }
  
  
  await loadRealShowData()
})
</script>

<template>
  <div v-if="loading">
    <p>Cargando...</p>
  </div>
  <div v-else-if="notFound">
    <p>No se encontró la serie.</p>
  </div>
  <div v-else-if="show" class="detail-container">
    <img :src="show.image || '/placeholder-poster.jpg'" alt="Poster" class="detail-poster" />
    <div class="detail-content">
      <button class="back-btn" @click="router.back()" title="Regresar">
        <ion-icon name="arrow-back-outline"></ion-icon>
      </button>
      <div class="show-meta">
        <span class="netflix">N</span>
        <span class="type">{{ show.mediaType === 'movie' ? 'Movie' : 'TV-series' }}</span>
      </div>
      <h1>{{ show.title }}</h1>
      <div class="imdb-row">
        <span class="imdb-badge">IMDb</span>
        <span class="imdb-rating">{{ show.rating || '8.0' }}</span>
        <span class="year">{{ show.year }}</span>
        <span v-if="show.mediaType !== 'movie'" class="season">{{ displaySeasons }} season{{ displaySeasons === 1 ? '' : 's' }}</span>
        <span class="status">{{ displayStatus }}</span>
        <span class="runtime">{{ displayRuntime }}</span>
      </div>
      <div class="genres genres-grid">
        <span v-for="genre in displayGenres" :key="genre" class="genre">{{ genre }}</span>
      </div>
      <p class="description">{{ show.overview }}</p>
      <p class="creators">Creadores: <span>{{ displayCreators.length > 0 ? displayCreators.join(', ') : 'No disponible' }}</span></p>
      <button class="start-watching-btn" :disabled="isLoading" @click="goToWatch">
        <ion-icon name="eye-outline" class="icon-main"></ion-icon>
        {{ isInWatching ? 'Watching' : 'Start watching' }}
      </button>
      <div class="actions">
        <button :class="['action-btn', { active: isInWatchlist }]" @click="handleWatchlist" :disabled="isLoading">
          <ion-icon name="bookmark-outline" class="icon-action"></ion-icon>
          <span>Agregar a Watchlist</span>
        </button>
        <button :class="['action-btn', { active: isInWatched }]" @click="handleWatched" :disabled="isLoading">
          <ion-icon name="checkmark-circle-outline" class="icon-action"></ion-icon>
          <span>Marcar como Watched</span>
        </button>
        <button :class="['action-btn', { active: isInFavorites }]" @click="handleFavorites" :disabled="isLoading">
          <ion-icon name="star-outline" class="icon-action"></ion-icon>
          <span>Agregar a Favorites</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 32px 16px 16px 16px;
  box-sizing: border-box;
}

.detail-poster {
  width: 100%;
  max-width: 350px;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.25);
  margin-bottom: 24px;
}

.detail-content {
  width: 100%;
  max-width: 500px;
  background: #181818;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  margin-bottom: 32px;
  color: #fff;
  text-align: center;
}

@media (max-width: 600px) {
  .detail-container {
    padding: 16px 4px 8px 4px;
  }
  .detail-content {
    padding: 16px 8px;
    max-width: 100%;
  }
  .detail-poster {
    max-width: 90vw;
  }
}

@media (min-width: 900px) {
  .detail-container {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    padding: 48px 0;
  }
  .detail-poster {
    margin-right: 48px;
    margin-bottom: 0;
    max-width: 400px;
  }
  .detail-content {
    text-align: left;
    max-width: 600px;
    margin-bottom: 0;
  }
}

.show-detail {
  background: #181a20;
  color: #fff;
  border-radius: 16px;
  padding: 2rem 1.5rem;
  max-width: 420px;
  margin: 2rem auto;
  box-shadow: 0 2px 16px #0008;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.poster {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 1rem;
}
.show-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.5rem;
}
.netflix {
  color: #e50914;
  font-weight: bold;
  font-size: 1.3rem;
  letter-spacing: 2px;
}
.type {
  background: #222;
  color: #fff;
  border-radius: 8px;
  padding: 0.2rem 0.7rem;
  font-size: 0.9rem;
}
.imdb-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0.5rem 0 1rem 0;
}
.imdb-badge {
  background: #f5c518;
  color: #222;
  border-radius: 4px;
  padding: 2px 8px;
  font-weight: bold;
  font-size: 1rem;
}
.imdb-rating {
  font-weight: bold;
  color: #f5c518;
  font-size: 1.1rem;
}
.year, .season, .status, .runtime {
  color: #aaa;
  font-size: 0.95rem;
}
.genres {
  margin-bottom: 1rem;
}
.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 6px 10px;
  width: 100%;
  margin-bottom: 1.2rem;
}
.genre {
  background: #222;
  color: #fff;
  border-radius: 8px;
  padding: 0.12rem 0.3rem;
  font-size: 0.72rem;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}
@media (min-width: 500px) {
  .genres-grid {
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  }
}
@media (min-width: 900px) {
  .genres-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}
.description {
  margin: 1rem 0;
  text-align: center;
}
.creators {
  color: #aaa;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}
.start-watching-btn {
  width: 100%;
  background: #6c7ae0;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 0.9rem 0;
  font-size: 1.15rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  box-shadow: 0 2px 8px #0004;
}
.start-watching-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.icon-main {
  font-size: 1.5rem;
  color: #fff;
}
.actions {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 0.7rem;
}
.action-btn {
  flex: 1;
  background: #23243a;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 0.7rem 0.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s;
  box-shadow: 0 1px 4px #0002;
}
.action-btn.active {
  background: #6c7ae0;
  color: #fff;
}
.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.icon-action {
  font-size: 1.3rem;
  color: #fff;
}
/* Botón de regreso */
.back-btn {
  position: absolute;
  top: 18px;
  left: 18px;
  background: rgba(30,30,30,0.45);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s;
}
.back-btn:hover {
  background: rgba(30,30,30,0.7);
}
.back-btn ion-icon {
  color: #fff;
  font-size: 24px;
}
</style> 
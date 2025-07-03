import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Movie } from '@/services/tvdbService'
import TursoService, { type User, type UserShow as TursoUserShow } from '@/services/tursoService'
import TVDBService from '@/services/tvdbService'

interface UserShow extends TursoUserShow {
  mediaType: 'series' | 'movie';
}

export const useShowsStore = defineStore('shows', () => {
  const searchQuery = ref('')
  const searchResults = ref<Movie[]>([])
  const isLoading = ref(false)
  const searchError = ref('')
  const currentUser = ref<User | null>(null)
  const progress = ref<Record<string, { season: number, episode: number }>>({})
  const initializeStore = async () => {
    try {
      await loadCurrentUser()
      await loadProgress()
    } catch (error) {
      console.error('Error inicializando store:', error)
    }
  }
  initializeStore()
  const watchlist = ref<Movie[]>([])
  const watched = ref<Movie[]>([])
  const favorites = ref<Movie[]>([])
  const watching = ref<Movie[]>([])
  const hasWatchlist = computed(() => watchlist.value.length > 0)
  const hasWatched = computed(() => watched.value.length > 0)
  const hasFavorites = computed(() => favorites.value.length > 0)
  const hasWatching = computed(() => watching.value.length > 0)
  const isLoggedIn = computed(() => currentUser.value !== null)
  function setSearchQuery(query: string) {
    searchQuery.value = query
  }
  function setSearchResults(results: Movie[]) {
    searchResults.value = results
  }
  function setLoading(loading: boolean) {
    isLoading.value = loading
  }
  function setSearchError(error: string) {
    searchError.value = error
  }
  async function loginUser(email: string, name: string) {
    try {
      let user = await TursoService.getUserByEmail(email)
      if (!user) {
        user = await TursoService.createUser(email, name)
      }
      currentUser.value = user
      await loadUserShows()
      return user
    } catch (error: any) {
      if (error.message && error.message.includes('409')) {
        throw new Error('El email ya está registrado')
      }
      throw error
    }
  }
  async function loadCurrentUser() {
    currentUser.value = null
    clearAllLists()
      return null
    }
  function clearAllLists() {
    watchlist.value = []
    watched.value = []
    favorites.value = []
    watching.value = []
    localStorage.removeItem('watchlist')
    localStorage.removeItem('watched')
    localStorage.removeItem('favorites')
    localStorage.removeItem('watching')
  }
  async function addToWatchlist(movie: Movie) {
    if (!currentUser.value) {
      if (!watchlist.value.find((m) => m.id === movie.id)) {
        watchlist.value.push(movie)
        saveToLocalStorage('watchlist', watchlist.value)
      }
      return
    }
    try {
      const showId = String(movie.id).replace(/^series-/, '').replace(/^movie-/, '')
      await TursoService.addUserShow(currentUser.value.id, showId, 'watchlist', movie.mediaType || 'series')
      if (!watchlist.value.find((m) => m.id === movie.id)) {
        watchlist.value.push(movie)
      }
    } catch (error) {
      console.error('Error al agregar a watchlist:', error)
      if (!watchlist.value.find((m) => m.id === movie.id)) {
        watchlist.value.push(movie)
        saveToLocalStorage('watchlist', watchlist.value)
      }
    }
  }
  async function removeFromWatchlist(movieId: string | number) {
    if (!currentUser.value) {
      watchlist.value = watchlist.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('watchlist', watchlist.value)
      return
    }
    try {
      await TursoService.removeUserShow(currentUser.value.id, String(movieId), 'watchlist')
      watchlist.value = watchlist.value.filter((m) => String(m.id) !== String(movieId))
    } catch (error) {
      console.error('Error al remover de watchlist:', error)
      watchlist.value = watchlist.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('watchlist', watchlist.value)
    }
  }
  function isInWatchlist(movieId: string | number): boolean {
    return watchlist.value.some((m) => String(m.id) === String(movieId))
  }
  async function addToWatched(movie: Movie) {
    if (!currentUser.value) {
      if (!watched.value.find((m) => m.id === movie.id)) {
        watched.value.push(movie)
        saveToLocalStorage('watched', watched.value)
        if (watching.value.find((m) => m.id === movie.id)) {
          watching.value = watching.value.filter((m) => m.id !== movie.id)
          saveToLocalStorage('watching', watching.value)
        }
      }
      return
    }
    try {
      const showId = String(movie.id).replace(/^series-/, '').replace(/^movie-/, '')
      await TursoService.addUserShow(currentUser.value.id, showId, 'watched', movie.mediaType || 'series')
      if (!watched.value.find((m) => m.id === movie.id)) {
        watched.value.push(movie)
        if (watching.value.find((m) => m.id === movie.id)) {
          watching.value = watching.value.filter((m) => m.id !== movie.id)
          await TursoService.removeUserShow(currentUser.value.id, showId, 'watching')
        }
      }
    } catch (error) {
      console.error('Error al agregar a watched:', error)
      if (!watched.value.find((m) => m.id === movie.id)) {
        watched.value.push(movie)
        saveToLocalStorage('watched', watched.value)
        if (watching.value.find((m) => m.id === movie.id)) {
          watching.value = watching.value.filter((m) => m.id !== movie.id)
          saveToLocalStorage('watching', watching.value)
        }
      }
    }
  }
  async function removeFromWatched(movieId: string | number) {
    if (!currentUser.value) {
      watched.value = watched.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('watched', watched.value)
      return
    }
    try {
      await TursoService.removeUserShow(currentUser.value.id, String(movieId), 'watched')
      watched.value = watched.value.filter((m) => String(m.id) !== String(movieId))
    } catch (error) {
      console.error('Error al remover de watched:', error)
      watched.value = watched.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('watched', watched.value)
    }
  }
  function isInWatched(movieId: string | number): boolean {
    return watched.value.some((m) => String(m.id) === String(movieId))
  }
  async function addToFavorites(movie: Movie) {
    if (!currentUser.value) {
      if (!favorites.value.find((m) => m.id === movie.id)) {
        favorites.value.push(movie)
        saveToLocalStorage('favorites', favorites.value)
      }
      return
    }
    try {
      const showId = String(movie.id).replace(/^series-/, '').replace(/^movie-/, '')
      await TursoService.addUserShow(currentUser.value.id, showId, 'favorites', movie.mediaType || 'series')
      if (!favorites.value.find((m) => m.id === movie.id)) {
        favorites.value.push(movie)
      }
    } catch (error) {
      console.error('Error al agregar a favorites:', error)
      if (!favorites.value.find((m) => m.id === movie.id)) {
        favorites.value.push(movie)
        saveToLocalStorage('favorites', favorites.value)
      }
    }
  }
  async function removeFromFavorites(movieId: string | number) {
    if (!currentUser.value) {
      favorites.value = favorites.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('favorites', favorites.value)
      return
    }
    try {
      await TursoService.removeUserShow(currentUser.value.id, String(movieId), 'favorites')
      favorites.value = favorites.value.filter((m) => String(m.id) !== String(movieId))
    } catch (error) {
      console.error('Error al remover de favorites:', error)
      favorites.value = favorites.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('favorites', favorites.value)
    }
  }
  function isInFavorites(movieId: string | number): boolean {
    return favorites.value.some((m) => String(m.id) === String(movieId))
  }
  async function addToWatching(movie: Movie) {
    if (!currentUser.value) {
      if (!watching.value.find((m) => m.id === movie.id)) {
        watching.value.push(movie)
        saveToLocalStorage('watching', watching.value)
        if (watched.value.find((m) => m.id === movie.id)) {
          watched.value = watched.value.filter((m) => m.id !== movie.id)
          saveToLocalStorage('watched', watched.value)
        }
      }
      return
    }
    try {
      const showId = String(movie.id).replace(/^series-/, '').replace(/^movie-/, '')
      await TursoService.addUserShow(currentUser.value.id, showId, 'watching', movie.mediaType || 'series')
      if (!watching.value.find((m) => m.id === movie.id)) {
        watching.value.push(movie)
        if (watched.value.find((m) => m.id === movie.id)) {
          watched.value = watched.value.filter((m) => m.id !== movie.id)
          await TursoService.removeUserShow(currentUser.value.id, showId, 'watched')
        }
      }
    } catch (error) {
      console.error('Error al agregar a watching:', error)
      if (!watching.value.find((m) => m.id === movie.id)) {
        watching.value.push(movie)
        saveToLocalStorage('watching', watching.value)
        if (watched.value.find((m) => m.id === movie.id)) {
          watched.value = watched.value.filter((m) => m.id !== movie.id)
          saveToLocalStorage('watched', watched.value)
        }
      }
    }
  }
  async function removeFromWatching(movieId: string | number) {
    if (!currentUser.value) {
      watching.value = watching.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('watching', watching.value)
      return
    }
    try {
      await TursoService.removeUserShow(currentUser.value.id, String(movieId), 'watching')
      watching.value = watching.value.filter((m) => String(m.id) !== String(movieId))
    } catch (error) {
      console.error('Error al remover de watching:', error)
      watching.value = watching.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('watching', watching.value)
    }
  }
  function isInWatching(movieId: string | number): boolean {
    return watching.value.some((m) => String(m.id) === String(movieId))
  }
  async function loadUserShows() {
    if (!currentUser.value) return
    try {
      const watchlistShows = await TursoService.getUserShows(currentUser.value.id, 'watchlist')
      const watchedShows = await TursoService.getUserShows(currentUser.value.id, 'watched')
      const favoritesShows = await TursoService.getUserShows(currentUser.value.id, 'favorites')
      const watchingShows = await TursoService.getUserShows(currentUser.value.id, 'watching')
      const watchlistShowsTyped = watchlistShows as UserShow[];
      const watchedShowsTyped = watchedShows as UserShow[];
      const favoritesShowsTyped = favoritesShows as UserShow[];
      const watchingShowsTyped = watchingShows as UserShow[];
      watchlist.value = (
        await Promise.all(
          watchlistShowsTyped.map(async (us) => {
            const id = us.showId
            if (us.mediaType === 'movie') {
              return await TVDBService.getMovieDetails(String(id))
            } else {
              return await TVDBService.getShowDetails(String(id))
            }
          })
        )
      ).filter((m): m is Movie => Boolean(m))
      watched.value = (
        await Promise.all(
          watchedShowsTyped.map(async (us) => {
            const id = us.showId
            if (us.mediaType === 'movie') {
              return await TVDBService.getMovieDetails(String(id))
            } else {
              return await TVDBService.getShowDetails(String(id))
            }
          })
        )
      ).filter((m): m is Movie => Boolean(m))
      favorites.value = (
        await Promise.all(
          favoritesShowsTyped.map(async (us) => {
            const id = us.showId
            if (us.mediaType === 'movie') {
              return await TVDBService.getMovieDetails(String(id))
            } else {
              return await TVDBService.getShowDetails(String(id))
            }
          })
        )
      ).filter((m): m is Movie => Boolean(m))
      watching.value = (
        await Promise.all(
          watchingShowsTyped.map(async (us) => {
            const id = us.showId
            if (us.mediaType === 'movie') {
              return await TVDBService.getMovieDetails(String(id))
            } else {
              return await TVDBService.getShowDetails(String(id))
            }
          })
        )
      ).filter((m): m is Movie => Boolean(m))
    } catch (error) {
      console.error('Error al cargar shows del usuario:', error)
    }
  }
  function saveToLocalStorage(key: string, data: Movie[]) {
    localStorage.setItem(key, JSON.stringify(data))
  }
  function loadFromLocalStorage(key: string): Movie[] {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }
  function initializeFromStorage() {
    watchlist.value = loadFromLocalStorage('watchlist')
    watched.value = loadFromLocalStorage('watched')
    favorites.value = loadFromLocalStorage('favorites')
    watching.value = loadFromLocalStorage('watching')
  }
  function getShowById(id: string) {
    return (
      watchlist.value.find((m) => String(m.id) === String(id)) ||
      watched.value.find((m) => String(m.id) === String(id)) ||
      favorites.value.find((m) => String(m.id) === String(id)) ||
      watching.value.find((m) => String(m.id) === String(id)) ||
      searchResults.value.find((m) => String(m.id) === String(id))
    )
  }
  async function fetchShowById(id: string): Promise<Movie | null> {
    let show = getShowById(id)
    if (show) return show
    const apiShow = await TVDBService.getShowDetails(String(id))
    if (apiShow) {
      searchResults.value.push(apiShow)
      return apiShow
    }
    return null
  }
  function addShowsToResults(shows: Movie[]) {
    const existingIds = new Set(searchResults.value.map(s => String(s.id)))
    const newShows = shows.filter(s => !existingIds.has(String(s.id)))
    searchResults.value.push(...newShows)
  }
  function loadProgress() {
    const stored = localStorage.getItem('progress')
    if (stored) {
      progress.value = JSON.parse(stored)
    }
  }
  function saveProgress() {
    localStorage.setItem('progress', JSON.stringify(progress.value))
  }
  function setProgress(showId: string, season: number, episode: number) {
    progress.value[showId] = { season, episode }
    saveProgress()
  }
  function getProgress(showId: string) {
    return progress.value[showId] || { season: 1, episode: 1 }
  }
  async function searchAll(query: string) {
    try {
      setLoading(true)
      setSearchError('')
      const [series, movies] = await Promise.all([
        TVDBService.searchShows(query),
        TVDBService.searchMovies(query)
      ])
      searchResults.value = [...series, ...movies]
    } catch (error: any) {
      setSearchError('Error en la búsqueda')
    } finally {
      setLoading(false)
    }
  }
  return {
    searchQuery,
    searchResults,
    isLoading,
    searchError,
    currentUser,
    watchlist,
    watched,
    favorites,
    watching,
    progress,
    hasWatchlist,
    hasWatched,
    hasFavorites,
    hasWatching,
    isLoggedIn,
    setSearchQuery,
    setSearchResults,
    setLoading,
    setSearchError,
    loginUser,
    loadCurrentUser,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToWatched,
    removeFromWatched,
    isInWatched,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    addToWatching,
    removeFromWatching,
    isInWatching,
    initializeFromStorage,
    loadUserShows,
    getShowById,
    fetchShowById,
    addShowsToResults,
    loadProgress,
    saveProgress,
    setProgress,
    getProgress,
    searchAll,
  }
})

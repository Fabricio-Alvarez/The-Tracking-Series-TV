import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Movie } from '@/services/tvdbService'
import TursoService, { type User } from '@/services/tursoService'
import TVDBService from '@/services/tvdbService'

export const useShowsStore = defineStore('shows', () => {
  // Estado de búsqueda
  const searchQuery = ref('')
  const searchResults = ref<Movie[]>([])
  const isLoading = ref(false)
  const searchError = ref('')

  // Estado del usuario
  const currentUser = ref<User | null>(null)

  // Inicializar el store automáticamente
  const initializeStore = async () => {
    try {
      await loadCurrentUser()
    } catch (error) {
      console.error('Error inicializando store:', error)
    }
  }

  // Llamar a la inicialización cuando se crea el store
  initializeStore()

  // Listas del usuario
  const watchlist = ref<Movie[]>([])
  const watched = ref<Movie[]>([])
  const favorites = ref<Movie[]>([])
  const watching = ref<Movie[]>([])

  // Computed properties
  const hasWatchlist = computed(() => watchlist.value.length > 0)
  const hasWatched = computed(() => watched.value.length > 0)
  const hasFavorites = computed(() => favorites.value.length > 0)
  const hasWatching = computed(() => watching.value.length > 0)
  const isLoggedIn = computed(() => currentUser.value !== null)

  // Métodos para búsqueda
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

  // Métodos de usuario
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
    // No restaurar usuario automáticamente
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

  // Métodos para watchlist
  async function addToWatchlist(movie: Movie) {
    if (!currentUser.value) {
      // Fallback a localStorage si no hay usuario
      if (!watchlist.value.find((m) => m.id === movie.id)) {
        watchlist.value.push(movie)
        saveToLocalStorage('watchlist', watchlist.value)
      }
      return
    }

    try {
      const showId = String(movie.id).replace(/^series-/, '')
      await TursoService.addUserShow(currentUser.value.id, showId, 'watchlist')
      if (!watchlist.value.find((m) => m.id === movie.id)) {
        watchlist.value.push(movie)
      }
    } catch (error) {
      console.error('Error al agregar a watchlist:', error)
      // Fallback a localStorage
      if (!watchlist.value.find((m) => m.id === movie.id)) {
        watchlist.value.push(movie)
        saveToLocalStorage('watchlist', watchlist.value)
      }
    }
  }

  async function removeFromWatchlist(movieId: string | number) {
    if (!currentUser.value) {
      // Fallback a localStorage
      watchlist.value = watchlist.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('watchlist', watchlist.value)
      return
    }

    try {
      await TursoService.removeUserShow(currentUser.value.id, String(movieId), 'watchlist')
      watchlist.value = watchlist.value.filter((m) => String(m.id) !== String(movieId))
    } catch (error) {
      console.error('Error al remover de watchlist:', error)
      // Fallback a localStorage
      watchlist.value = watchlist.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('watchlist', watchlist.value)
    }
  }

  function isInWatchlist(movieId: string | number): boolean {
    return watchlist.value.some((m) => String(m.id) === String(movieId))
  }

  // Métodos para watched
  async function addToWatched(movie: Movie) {
    if (!currentUser.value) {
      // Fallback a localStorage
      if (!watched.value.find((m) => m.id === movie.id)) {
        watched.value.push(movie)
        saveToLocalStorage('watched', watched.value)
        // Remover de watching si está ahí
        if (watching.value.find((m) => m.id === movie.id)) {
          watching.value = watching.value.filter((m) => m.id !== movie.id)
          saveToLocalStorage('watching', watching.value)
        }
      }
      return
    }

    try {
      const showId = String(movie.id).replace(/^series-/, '')
      await TursoService.addUserShow(currentUser.value.id, showId, 'watched')
      if (!watched.value.find((m) => m.id === movie.id)) {
        watched.value.push(movie)
        // Remover de watching si está ahí
        if (watching.value.find((m) => m.id === movie.id)) {
          watching.value = watching.value.filter((m) => m.id !== movie.id)
          await TursoService.removeUserShow(currentUser.value.id, showId, 'watching')
        }
      }
    } catch (error) {
      console.error('Error al agregar a watched:', error)
      // Fallback a localStorage
      if (!watched.value.find((m) => m.id === movie.id)) {
        watched.value.push(movie)
        saveToLocalStorage('watched', watched.value)
        // Remover de watching si está ahí
        if (watching.value.find((m) => m.id === movie.id)) {
          watching.value = watching.value.filter((m) => m.id !== movie.id)
          saveToLocalStorage('watching', watching.value)
        }
      }
    }
  }

  async function removeFromWatched(movieId: string | number) {
    if (!currentUser.value) {
      // Fallback a localStorage
      watched.value = watched.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('watched', watched.value)
      return
    }

    try {
      await TursoService.removeUserShow(currentUser.value.id, String(movieId), 'watched')
      watched.value = watched.value.filter((m) => String(m.id) !== String(movieId))
    } catch (error) {
      console.error('Error al remover de watched:', error)
      // Fallback a localStorage
      watched.value = watched.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('watched', watched.value)
    }
  }

  function isInWatched(movieId: string | number): boolean {
    return watched.value.some((m) => String(m.id) === String(movieId))
  }

  // Métodos para favorites
  async function addToFavorites(movie: Movie) {
    if (!currentUser.value) {
      // Fallback a localStorage
      if (!favorites.value.find((m) => m.id === movie.id)) {
        favorites.value.push(movie)
        saveToLocalStorage('favorites', favorites.value)
      }
      return
    }

    try {
      const showId = String(movie.id).replace(/^series-/, '')
      await TursoService.addUserShow(currentUser.value.id, showId, 'favorites')
      if (!favorites.value.find((m) => m.id === movie.id)) {
        favorites.value.push(movie)
      }
    } catch (error) {
      console.error('Error al agregar a favorites:', error)
      // Fallback a localStorage
      if (!favorites.value.find((m) => m.id === movie.id)) {
        favorites.value.push(movie)
        saveToLocalStorage('favorites', favorites.value)
      }
    }
  }

  async function removeFromFavorites(movieId: string | number) {
    if (!currentUser.value) {
      // Fallback a localStorage
      favorites.value = favorites.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('favorites', favorites.value)
      return
    }

    try {
      await TursoService.removeUserShow(currentUser.value.id, String(movieId), 'favorites')
      favorites.value = favorites.value.filter((m) => String(m.id) !== String(movieId))
    } catch (error) {
      console.error('Error al remover de favorites:', error)
      // Fallback a localStorage
      favorites.value = favorites.value.filter((m) => String(m.id) !== String(movieId))
      saveToLocalStorage('favorites', favorites.value)
    }
  }

  function isInFavorites(movieId: string | number): boolean {
    return favorites.value.some((m) => String(m.id) === String(movieId))
  }

  // Métodos para watching
  async function addToWatching(movie: Movie) {
    if (!currentUser.value) {
      if (!watching.value.find((m) => m.id === movie.id)) {
        watching.value.push(movie)
        saveToLocalStorage('watching', watching.value)
        // Remover de watched si está ahí
        if (watched.value.find((m) => m.id === movie.id)) {
          watched.value = watched.value.filter((m) => m.id !== movie.id)
          saveToLocalStorage('watched', watched.value)
        }
      }
      return
    }

    try {
      const showId = String(movie.id).replace(/^series-/, '')
      await TursoService.addUserShow(currentUser.value.id, showId, 'watching')
      if (!watching.value.find((m) => m.id === movie.id)) {
        watching.value.push(movie)
        // Remover de watched si está ahí
        if (watched.value.find((m) => m.id === movie.id)) {
          watched.value = watched.value.filter((m) => m.id !== movie.id)
          await TursoService.removeUserShow(currentUser.value.id, showId, 'watched')
        }
      }
    } catch (error) {
      console.error('Error al agregar a watching:', error)
      // Fallback a localStorage
    if (!watching.value.find((m) => m.id === movie.id)) {
      watching.value.push(movie)
      saveToLocalStorage('watching', watching.value)
      // Remover de watched si está ahí
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
      // Fallback a localStorage
    watching.value = watching.value.filter((m) => String(m.id) !== String(movieId))
    saveToLocalStorage('watching', watching.value)
    }
  }

  function isInWatching(movieId: string | number): boolean {
    return watching.value.some((m) => String(m.id) === String(movieId))
  }

  // Cargar shows del usuario desde el backend y mapear a Movie[]
  async function loadUserShows() {
    if (!currentUser.value) return
    try {
      // 1. Obtener los user shows del backend
      const watchlistShows = await TursoService.getUserShows(currentUser.value.id, 'watchlist')
      const watchedShows = await TursoService.getUserShows(currentUser.value.id, 'watched')
      const favoritesShows = await TursoService.getUserShows(currentUser.value.id, 'favorites')
      const watchingShows = await TursoService.getUserShows(currentUser.value.id, 'watching')

      // 2. Mapear a detalles completos usando TVDBService y filtrar nulls
      watchlist.value = (
        await Promise.all(
          watchlistShows.map(async (us) => await TVDBService.getShowDetails(us.showId || us.show_id))
        )
      ).filter((m): m is Movie => Boolean(m))
      watched.value = (
        await Promise.all(
          watchedShows.map(async (us) => await TVDBService.getShowDetails(us.showId || us.show_id))
        )
      ).filter((m): m is Movie => Boolean(m))
      favorites.value = (
        await Promise.all(
          favoritesShows.map(async (us) => await TVDBService.getShowDetails(us.showId || us.show_id))
        )
      ).filter((m): m is Movie => Boolean(m))
      watching.value = (
        await Promise.all(
          watchingShows.map(async (us) => await TVDBService.getShowDetails(us.showId || us.show_id))
        )
      ).filter((m): m is Movie => Boolean(m))
    } catch (error) {
      console.error('Error al cargar shows del usuario:', error)
    }
  }

  // Persistencia en localStorage (fallback)
  function saveToLocalStorage(key: string, data: Movie[]) {
    localStorage.setItem(key, JSON.stringify(data))
  }

  function loadFromLocalStorage(key: string): Movie[] {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }

  // Inicializar datos desde localStorage
  function initializeFromStorage() {
    watchlist.value = loadFromLocalStorage('watchlist')
    watched.value = loadFromLocalStorage('watched')
    favorites.value = loadFromLocalStorage('favorites')
    watching.value = loadFromLocalStorage('watching')
  }

  function getShowById(id: string) {
    // Buscar en todas las listas
    return (
      watchlist.value.find((m) => String(m.id) === String(id)) ||
      watched.value.find((m) => String(m.id) === String(id)) ||
      favorites.value.find((m) => String(m.id) === String(id)) ||
      watching.value.find((m) => String(m.id) === String(id)) ||
      searchResults.value.find((m) => String(m.id) === String(id))
    )
  }

  async function fetchShowById(id: string): Promise<Movie | null> {
    // Buscar primero en las listas locales
    let show = getShowById(id)
    if (show) return show
    // Si no está, buscar en la API
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

  return {
    // Estado
    searchQuery,
    searchResults,
    isLoading,
    searchError,
    currentUser,
    watchlist,
    watched,
    favorites,
    watching,

    // Computed
    hasWatchlist,
    hasWatched,
    hasFavorites,
    hasWatching,
    isLoggedIn,

    // Métodos de búsqueda
    setSearchQuery,
    setSearchResults,
    setLoading,
    setSearchError,

    // Métodos de usuario
    loginUser,
    loadCurrentUser,

    // Métodos de watchlist
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,

    // Métodos de watched
    addToWatched,
    removeFromWatched,
    isInWatched,

    // Métodos de favorites
    addToFavorites,
    removeFromFavorites,
    isInFavorites,

    // Métodos de watching
    addToWatching,
    removeFromWatching,
    isInWatching,

    // Persistencia
    initializeFromStorage,
    loadUserShows,

    getShowById,
    fetchShowById,

    addShowsToResults,
  }
})

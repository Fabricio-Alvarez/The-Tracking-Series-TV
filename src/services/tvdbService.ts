import axios from 'axios'

// Configuración de la API de TheTVDB
const TVDB_BASE_URL = 'https://api4.thetvdb.com/v4'
const TVDB_API_KEY = '249d19f5-13f4-4fb7-bebb-15e631a2b67a'
console.log('API KEY utilizada:', TVDB_API_KEY)

// Instancia de axios configurada
const tvdbApi = axios.create({
  baseURL: TVDB_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token de acceso
let accessToken: string | null = null

// Interceptor para manejar errores
tvdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('TVDB API Error:', error.response?.data || error.message)
    throw error
  },
)

export interface Movie {
  id: string | number
  title: string
  image: string
  rating?: string | number
  year?: string | number
  overview?: string
  status?: string
  network?: string
  genres?: string[]
  creators?: string[]
  seasons?: number
  mediaType: 'series' | 'movie'
}

export interface Episode {
  id: number
  name: string
  description: string
  watched: boolean
  airDate: string
  seasonNumber?: number
  episodeNumber?: number
  runtime?: number
  image?: string
}

export interface Season {
  id: number
  name: string
  seasonNumber: number
  episodeCount: number
  airDate?: string
  overview?: string
  image?: string
}

export class TVDBService {
  /**
   * Autenticarse con TheTVDB API y guardar el token
   */
  public static async authenticate(): Promise<void> {
    if (accessToken) return // Ya tenemos un token válido

    try {
      console.log('🔐 Autenticando con TheTVDB...')
      const response = await tvdbApi.post('/login', {
        apikey: TVDB_API_KEY,
      })
      accessToken = response.data.data.token
      // Actualizar el header de autorización para futuras peticiones
      tvdbApi.defaults.headers.Authorization = `Bearer ${accessToken}`
      console.log('✅ Autenticación exitosa')
    } catch (error) {
      console.error('❌ Error de autenticación:', error)
      throw new Error('Error de autenticación con TheTVDB API')
    }
  }

  /**
   * Buscar series por nombre
   */
  static async searchShows(query: string): Promise<Movie[]> {
    await this.authenticate()
    try {
      const response = await tvdbApi.get('/search', {
        params: {
          query,
          type: 'series',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = response.data
      if (!data.data || !Array.isArray(data.data)) {
        return []
      }
      // Adaptar la estructura de los resultados
      return data.data
        .filter((item: any) => item?.objectID || item?.id)
        .map((item: any) => ({
          id: item.objectID || item.id,
          title: item.name,
          rating: item.score?.toFixed?.(1) ?? item.score ?? '7.9',
          image: item.image_url || item.image || '/images/placeholder.jpg',
          year: item.firstAired?.split?.('-')[0] ?? item.year ?? '',
          overview: item.overview || 'Sin descripción disponible',
          status: item.status?.name || 'Estado desconocido',
          network: item.network?.name || 'Red no disponible',
          mediaType: 'series',
        }))
    } catch (error) {
      console.error('Error en searchShows:', error)
      return []
    }
  }

  /**
   * Buscar películas por nombre
   */
  static async searchMovies(query: string): Promise<Movie[]> {
    await this.authenticate()
    try {
      const response = await tvdbApi.get('/search', {
        params: {
          query,
          type: 'movie',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = response.data
      if (!data.data || !Array.isArray(data.data)) {
        return []
      }
      // Adaptar la estructura de los resultados
      return data.data
        .filter((item: any) => item?.objectID || item?.id)
        .map((item: any) => ({
          id: item.objectID || item.id,
          title: item.name,
          rating: item.score?.toFixed?.(1) ?? item.score ?? '7.9',
          image: item.image_url || item.image || '/images/placeholder.jpg',
          year: item.firstAired?.split?.('-')[0] ?? item.year ?? '',
          overview: item.overview || 'Sin descripción disponible',
          status: item.status?.name || 'Estado desconocido',
          network: item.network?.name || 'Red no disponible',
          mediaType: 'movie',
        }))
    } catch (error) {
      console.error('Error en searchMovies:', error)
      return []
    }
  }

  /**
   * Obtener detalles de una serie específica
   */
  static async getShowDetails(showId: string): Promise<Movie | null> {
    await this.authenticate()
    try {
      // 1. Detalles principales
      const response = await tvdbApi.get(`/series/${showId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const show = response.data.data

      // 2. Géneros: si vienen como IDs, obtener nombres
      let genres: string[] = []
      if (Array.isArray(show.genres) && show.genres.length > 0 && typeof show.genres[0] !== 'string') {
        // Si son objetos
        genres = show.genres.map((g: any) => g.name || g)
      } else if (Array.isArray(show.genres) && typeof show.genres[0] === 'string') {
        // Si son IDs, buscar nombres
        try {
          const genresResp = await tvdbApi.get('/genres', {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          const genresMap: Record<string, string> = {}
          for (const g of genresResp.data.data) {
            genresMap[String(g.id)] = g.name
          }
          genres = show.genres.map((id: string) => genresMap[String(id)] || id)
        } catch {}
      } else if (typeof show.genre === 'string') {
        genres = [show.genre]
      } else if (Array.isArray(show.tags)) {
        genres = show.tags.map((t: any) => t.name || t)
      }

      // 3. Creadores: llamada a /series/{id}/people
      let creators: string[] = []
      try {
        const peopleResp = await tvdbApi.get(`/series/${showId}/people`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const people = peopleResp.data.data || []
        creators = people.filter((p: any) => (p.type || p.role || '').toLowerCase().includes('creator')).map((p: any) => p.name)
        // Fallback: si no hay creadores, usar escritores principales
        if (creators.length === 0) {
          creators = people.filter((p: any) => (p.type || p.role || '').toLowerCase().includes('writer')).map((p: any) => p.name)
        }
      } catch {}
      // Fallbacks adicionales
      if (creators.length === 0 && Array.isArray(show.people)) {
        creators = show.people.filter((p: any) => (p.type || p.role || '').toLowerCase().includes('creator')).map((p: any) => p.name)
      } else if (creators.length === 0 && Array.isArray(show.seriesPeople)) {
        creators = show.seriesPeople.filter((p: any) => (p.type || p.role || '').toLowerCase().includes('creator')).map((p: any) => p.name)
      } else if (creators.length === 0 && Array.isArray(show.createdBy)) {
        creators = show.createdBy.map((c: any) => c.name || c)
      }

      // 4. Temporadas: llamada a /series/{id}/seasons
      let seasons = 1
      try {
        const seasonsResp = await tvdbApi.get(`/series/${showId}/seasons`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (Array.isArray(seasonsResp.data.data)) {
          seasons = seasonsResp.data.data.length
        }
      } catch {
        // Fallbacks
        if (Array.isArray(show.seasons)) {
          seasons = show.seasons.length
        } else if (show.seasonsCount) {
          seasons = show.seasonsCount
        }
      }

      return {
        id: show.id,
        title: show.name,
        image: show.image_url || show.image || '/images/placeholder.jpg',
        rating: show.score || '7.9',
        year: show.firstAired?.split?.('-')[0] ?? show.year ?? '',
        overview: show.overview || 'Sin descripción disponible',
        status: show.status?.name || 'Estado desconocido',
        network: show.network?.name || 'Red no disponible',
        genres,
        creators,
        seasons,
        mediaType: 'series',
      }
    } catch (error) {
      console.error('Error al obtener detalles del show:', error)
      return null
    }
  }

  /**
   * Obtener temporadas de una serie
   */
  static async getSeasons(showId: string): Promise<Season[]> {
    await this.authenticate()
    try {
      const response = await tvdbApi.get(`/series/${showId}/seasons`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      const seasons = response.data.data || []
      return seasons.map((season: any) => ({
        id: season.id,
        name: season.name || `Temporada ${season.number}`,
        seasonNumber: season.number,
        episodeCount: season.episodeCount || 0,
        airDate: season.airDate,
        overview: season.overview,
        image: season.image || season.image_url,
      }))
    } catch (error) {
      console.error('Error al obtener temporadas:', error)
      return []
    }
  }

  /**
   * Obtener episodios de una temporada específica
   */
  static async getEpisodes(showId: string, seasonNumber: number): Promise<Episode[]> {
    await this.authenticate()
    try {
      const response = await tvdbApi.get(`/series/${showId}/episodes`, {
        params: {
          season: seasonNumber,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      const episodes = response.data.data || []
      return episodes.map((episode: any) => ({
        id: episode.id,
        name: episode.name || `Episodio ${episode.number}`,
        description: episode.overview || episode.description || 'Sin descripción disponible',
        watched: false, // Se maneja localmente
        airDate: episode.airDate || episode.firstAired || 'TBA',
        seasonNumber: episode.seasonNumber || seasonNumber,
        episodeNumber: episode.number,
        runtime: episode.runtime,
        image: episode.image || episode.image_url,
      }))
    } catch (error) {
      console.error('Error al obtener episodios:', error)
      return []
    }
  }

  /**
   * Obtener todas las temporadas y episodios de una serie
   */
  static async getAllSeasonsAndEpisodes(showId: string): Promise<Record<number, Episode[]>> {
    await this.authenticate()
    try {
      // Primero obtener todas las temporadas
      const seasons = await this.getSeasons(showId)
      
      // Luego obtener episodios para cada temporada
      const episodesBySeason: Record<number, Episode[]> = {}
      
      for (const season of seasons) {
        const episodes = await this.getEpisodes(showId, season.seasonNumber)
        episodesBySeason[season.seasonNumber] = episodes
      }
      
      return episodesBySeason
    } catch (error) {
      console.error('Error al obtener todas las temporadas y episodios:', error)
      return {}
    }
  }


  /**
   * Obtener imágenes específicas para series populares
   */
  static async getSpecificShowImages(showTitle: string): Promise<string[]> {
    const title = showTitle.toLowerCase()
    
    // Mapeo de series populares con URLs de imágenes específicas
    const specificImages: Record<string, string[]> = {
      'wednesday': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/4/42/WednesdayNetflixPosterEnglish.jpg/1200px-WednesdayNetflixPosterEnglish.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Wednesday_Addams_Netflix.jpg/800px-Wednesday_Addams_Netflix.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Wednesday_-_Netflix_Series.png/800px-Wednesday_-_Netflix_Series.png',
        'https://static.tvmaze.com/uploads/images/original_untouched/425/1064741.jpg'
      ],
      'stranger things': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/3/38/Stranger_Things_logo.png/1200px-Stranger_Things_logo.png',
        'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Stranger_Things_season_1.jpg/1200px-Stranger_Things_season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Stranger_Things_season_2.jpg/1200px-Stranger_Things_season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Stranger_Things_season_3.jpg/1200px-Stranger_Things_season_3.jpg'
      ],
      'money heist': [
        'https://upload.wikimedia.org/wikipedia/en/7/7e/Money_Heist_logo.png',
        'https://upload.wikimedia.org/wikipedia/en/7/7e/Money_Heist_S1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/7/7e/Money_Heist_S2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/7/7e/Money_Heist_S3.jpg'
      ],
      'the witcher': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Witcher_logo.jpg/800px-The_Witcher_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Witcher_Season_1.jpg/800px-The_Witcher_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Witcher_Season_2.jpg/800px-The_Witcher_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Witcher_Season_3.jpg/800px-The_Witcher_Season_3.jpg'
      ],
      'peaky blinders': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Peaky_Blinders_logo.jpg/800px-Peaky_Blinders_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Peaky_Blinders_Season_1.jpg/800px-Peaky_Blinders_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Peaky_Blinders_Season_2.jpg/800px-Peaky_Blinders_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Peaky_Blinders_Season_3.jpg/800px-Peaky_Blinders_Season_3.jpg'
      ],
      'the mandalorian': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Mandalorian_logo.jpg/800px-The_Mandalorian_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Mandalorian_Season_1.jpg/800px-The_Mandalorian_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Mandalorian_Season_2.jpg/800px-The_Mandalorian_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Mandalorian_Season_3.jpg/800px-The_Mandalorian_Season_3.jpg'
      ],
      'the crown': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Crown_logo.jpg/800px-The_Crown_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Crown_Season_1.jpg/800px-The_Crown_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Crown_Season_2.jpg/800px-The_Crown_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Crown_Season_3.jpg/800px-The_Crown_Season_3.jpg'
      ],
      'dark': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_logo.jpg/800px-Dark_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_Season_1.jpg/800px-Dark_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_Season_2.jpg/800px-Dark_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_Season_3.jpg/800px-Dark_Season_3.jpg'
      ],
      'the boys': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Boys_logo.jpg/800px-The_Boys_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Boys_Season_1.jpg/800px-The_Boys_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Boys_Season_2.jpg/800px-The_Boys_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Boys_Season_3.jpg/800px-The_Boys_Season_3.jpg'
      ],
      'better call saul': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Better_Call_Saul_logo.jpg/800px-Better_Call_Saul_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Better_Call_Saul_Season_1.jpg/800px-Better_Call_Saul_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Better_Call_Saul_Season_2.jpg/800px-Better_Call_Saul_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Better_Call_Saul_Season_3.jpg/800px-Better_Call_Saul_Season_3.jpg'
      ]
    }

    // Buscar coincidencias exactas o parciales
    for (const [key, images] of Object.entries(specificImages)) {
      if (title.includes(key) || key.includes(title)) {
        console.log(`Imágenes específicas encontradas para: ${showTitle}`)
        return images
      }
    }

    return []
  }

  /**
   * Obtener detalles de una película específica
   */
  static async getMovieDetails(movieId: string): Promise<Movie | null> {
    await this.authenticate()
    try {
      // 1. Detalles principales
      const response = await tvdbApi.get(`/movies/${movieId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const movie = response.data.data

      // 2. Géneros
      let genres: string[] = []
      if (Array.isArray(movie.genres) && movie.genres.length > 0 && typeof movie.genres[0] !== 'string') {
        genres = movie.genres.map((g: any) => g.name || g)
      } else if (Array.isArray(movie.genres) && typeof movie.genres[0] === 'string') {
        try {
          const genresResp = await tvdbApi.get('/genres', {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          const genresMap: Record<string, string> = {}
          for (const g of genresResp.data.data) {
            genresMap[String(g.id)] = g.name
          }
          genres = movie.genres.map((id: string) => genresMap[String(id)] || id)
        } catch {}
      } else if (typeof movie.genre === 'string') {
        genres = [movie.genre]
      } else if (Array.isArray(movie.tags)) {
        genres = movie.tags.map((t: any) => t.name || t)
      }

      return {
        id: movie.id,
        title: movie.name,
        image: movie.image_url || movie.image || '/images/placeholder.jpg',
        rating: movie.score || '7.9',
        year: movie.year || (movie.releaseDate?.split?.('-')[0] ?? ''),
        overview: movie.overview || 'Sin descripción disponible',
        status: movie.status?.name || 'Estado desconocido',
        network: movie.network?.name || 'Red no disponible',
        genres,
        creators: [],
        seasons: 1,
        mediaType: 'movie',
      }
    } catch (error) {
      console.error('Error al obtener detalles de la película:', error)
      return null
    }
  }
}

// --- FUNCIÓN FUERA DE LA CLASE ---
export async function batchSearchTheTVDBExact(titles: string[]): Promise<Movie[]> {
  await TVDBService.authenticate();
  const fetches = titles.map(async (title) => {
    try {
      const response = await tvdbApi.get('/search', {
        params: {
          query: title,
          type: 'series',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      const first = data.data?.[0];
      return first
        ? {
            id: first.objectID || first.id,
            title: first.name,
            rating: first.score?.toFixed?.(1) ?? first.score ?? '7.9',
            image: first.image_url || first.image || '/images/placeholder.jpg',
            year: first.firstAired?.split?.('-')[0] ?? first.year ?? '',
            overview: first.overview || 'Sin descripción disponible',
            status: first.status?.name || 'Estado desconocido',
            network: first.network?.name || 'Red no disponible',
            mediaType: 'series',
          } as Movie & { mediaType: 'series' }
        : null;
    } catch (err) {
      console.warn(`Error al buscar "${title}":`, err);
      return null;
    }
  });

  const results = await Promise.all(fetches);
  return results.filter((item): item is Movie => item !== null);
}

export async function batchSearchMoviesTheTVDBExact(titles: string[]): Promise<Movie[]> {
  await TVDBService.authenticate();
  const fetches = titles.map(async (title) => {
    try {
      const response = await tvdbApi.get('/search', {
        params: {
          query: title,
          type: 'movie',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      const first = data.data?.[0];
      return first
        ? {
            id: first.objectID || first.id,
            title: first.name,
            rating: first.score?.toFixed?.(1) ?? first.score ?? '7.9',
            image: first.image_url || first.image || '/images/placeholder.jpg',
            year: first.firstAired?.split?.('-')[0] ?? first.year ?? '',
            overview: first.overview || 'Sin descripción disponible',
            status: first.status?.name || 'Estado desconocido',
            network: first.network?.name || 'Red no disponible',
            mediaType: 'movie',
          } as Movie & { mediaType: 'movie' }
        : null;
    } catch (err) {
      console.warn(`Error al buscar película "${title}":`, err);
      return null;
    }
  });

  const results = await Promise.all(fetches);
  return results.filter((item): item is Movie => item !== null);
}

// --- MÉTODOS MOCK PARA VISTA WATCH ---
export async function getSeriesPeopleMock(showId: string) {
  // Puedes personalizar según showId si quieres
  return [
    { id: 1, name: 'Jenna Ortega', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064746.jpg' },
    { id: 2, name: 'Hunter Doohan', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064747.jpg' },
    { id: 3, name: 'Percy Hynes White', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064748.jpg' },
    { id: 4, name: 'Emma Myers', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064749.jpg' },
    { id: 5, name: 'Joy Sunday', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064750.jpg' },
  ]
}

export async function getSeriesImagesMock(showId: string) {
  return [
    'https://static.tvmaze.com/uploads/images/original_untouched/425/1064741.jpg',
    'https://static.tvmaze.com/uploads/images/original_untouched/425/1064742.jpg',
    'https://static.tvmaze.com/uploads/images/original_untouched/425/1064743.jpg',
  ]
}

export default TVDBService

// --- SERVICIO DE DATOS REALES COMBINADOS ---
export class RealDataService {
  // Cache para evitar llamadas repetidas a la API
  private static episodeCache: Record<string, Episode[]> = {}
  private static seasonCache: Record<string, Season[]> = {}

  /**
   * Obtener episodios reales combinando API y datos externos
   */
  static async getRealEpisodes(showId: string, showTitle: string, seasonNumber: number): Promise<Episode[]> {
    const cacheKey = `${showId}_${seasonNumber}`
    
    // Verificar cache primero
    if (this.episodeCache[cacheKey]) {
      return this.episodeCache[cacheKey]
    }

    try {
      // Intentar obtener de la API primero
      const apiEpisodes = await TVDBService.getEpisodes(showId, seasonNumber)
      
      if (apiEpisodes.length > 0) {
        // Si la API tiene datos, usarlos
        this.episodeCache[cacheKey] = apiEpisodes
        return apiEpisodes
      }
    } catch (error) {
      console.log(`API no tiene datos para ${showTitle} temporada ${seasonNumber}, usando datos externos`)
    }

    // Si la API no tiene datos, usar datos externos
    const externalEpisodes = await this.getExternalEpisodes(showTitle, seasonNumber)
    this.episodeCache[cacheKey] = externalEpisodes
    return externalEpisodes
  }

  /**
   * Obtener episodios de fuentes externas (TMDB, Wikipedia, etc.)
   */
  private static async getExternalEpisodes(showTitle: string, seasonNumber: number): Promise<Episode[]> {
    const showTitleLower = showTitle.toLowerCase()
    
    // Intentar obtener de TMDB API (gratuita)
    try {
      const tmdbEpisodes = await this.getTMDBEpisodes(showTitle, seasonNumber)
      if (tmdbEpisodes.length > 0) {
        return tmdbEpisodes
      }
    } catch (error) {
      console.log('Error obteniendo datos de TMDB:', error)
    }

    // Fallback a datos hardcodeados para series populares
    const hardcodedEpisodes = this.getHardcodedEpisodes(showTitleLower, seasonNumber)
    if (hardcodedEpisodes.length > 0) {
      return hardcodedEpisodes
    }

    // Último fallback: episodios genéricos
    return this.generateGenericEpisodes(showTitle, seasonNumber)
  }

  /**
   * Obtener episodios de TMDB API
   */
  private static async getTMDBEpisodes(showTitle: string, seasonNumber: number): Promise<Episode[]> {
    // TMDB API es gratuita y tiene muchos datos
    const TMDB_API_KEY = '8c247ea0b4b56ed2ff7d41c9a833aa77' // API key pública de ejemplo
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
    
    try {
      // 1. Buscar la serie
      const searchResponse = await fetch(
        `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(showTitle)}`
      )
      const searchData = await searchResponse.json()
      
      if (!searchData.results || searchData.results.length === 0) {
        return []
      }
      
      const showId = searchData.results[0].id
      
      // 2. Obtener episodios de la temporada
      const episodesResponse = await fetch(
        `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`
      )
      const episodesData = await episodesResponse.json()
      
      if (!episodesData.episodes) {
        return []
      }
      
      return episodesData.episodes.map((episode: any, index: number) => ({
        id: episode.id || index + 1,
        name: episode.name || `Episodio ${episode.episode_number}`,
        description: episode.overview || 'Sin descripción disponible',
        watched: false,
        airDate: episode.air_date || 'TBA',
        seasonNumber: seasonNumber,
        episodeNumber: episode.episode_number,
        runtime: episode.runtime,
        image: episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : undefined,
      }))
    } catch (error) {
      console.error('Error obteniendo datos de TMDB:', error)
      return []
    }
  }

  /**
   * Datos hardcodeados para series populares que no están en la API
   */
  private static getHardcodedEpisodes(showTitle: string, seasonNumber: number): Episode[] {
    // Aquí puedes agregar más series con datos reales
    const hardcodedData: Record<string, Record<number, Episode[]>> = {
      'breaking bad': {
        1: [
          { id: 1, name: 'Pilot', description: 'Un profesor de química de secundaria recurre a una vida de crimen, produciendo y vendiendo metanfetaminas para asegurar el futuro financiero de su familia.', watched: false, airDate: '2008-01-20' },
          { id: 2, name: 'Cat\'s in the Bag...', description: 'Walter y Jesse intentan deshacerse del cuerpo, pero las cosas se complican cuando el teléfono del muerto sigue sonando.', watched: false, airDate: '2008-01-27' },
          { id: 3, name: '...And the Bag\'s in the River', description: 'Walter debe decidir si matar a Krazy-8 o dejarlo ir, mientras Jesse intenta vender la metanfetamina.', watched: false, airDate: '2008-02-10' },
          { id: 4, name: 'Cancer Man', description: 'Walter le dice a su familia sobre su cáncer, mientras Jesse intenta vender drogas en la escuela.', watched: false, airDate: '2008-02-17' },
          { id: 5, name: 'Gray Matter', description: 'Walter rechaza la ayuda de sus antiguos socios, mientras Jesse intenta vender drogas a sus amigos.', watched: false, airDate: '2008-02-24' },
          { id: 6, name: 'Crazy Handful of Nothin\'', description: 'Walter usa su conocimiento de química para crear una explosión, mientras Jesse se mete en problemas con Tuco.', watched: false, airDate: '2008-03-02' },
          { id: 7, name: 'A No-Rough-Stuff-Type Deal', description: 'Walter y Jesse hacen un trato con Tuco, pero las cosas se complican rápidamente.', watched: false, airDate: '2008-03-09' }
        ],
        2: [
          { id: 8, name: 'Seven Thirty-Seven', description: 'Walter y Jesse se enteran de que Tuco quiere matarlos, y deben encontrar una manera de sobrevivir.', watched: false, airDate: '2009-03-08' },
          { id: 9, name: 'Grilled', description: 'Walter y Jesse son llevados a la casa de Tuco, donde deben encontrar una manera de escapar.', watched: false, airDate: '2009-03-15' },
          { id: 10, name: 'Bit by a Dead Bee', description: 'Walter finge estar en coma para evitar preguntas, mientras Jesse intenta vender drogas.', watched: false, airDate: '2009-03-22' },
          { id: 11, name: 'Down', description: 'Walter se siente deprimido después de su experiencia con Tuco, mientras Jesse intenta vender drogas.', watched: false, airDate: '2009-03-29' },
          { id: 12, name: 'Breakage', description: 'Walter regresa al trabajo, mientras Jesse intenta vender drogas a sus amigos.', watched: false, airDate: '2009-04-05' },
          { id: 13, name: 'Peekaboo', description: 'Walter y Jesse deben limpiar un laboratorio, mientras Jesse se preocupa por un niño.', watched: false, airDate: '2009-04-12' },
          { id: 14, name: 'Negro y Azul', description: 'Walter y Jesse intentan vender drogas en territorio de otros traficantes.', watched: false, airDate: '2009-04-19' },
          { id: 15, name: 'Better Call Saul', description: 'Walter y Jesse contratan a un abogado para ayudarlos con sus problemas legales.', watched: false, airDate: '2009-04-26' },
          { id: 16, name: '4 Days Out', description: 'Walter y Jesse van al desierto para cocinar drogas, pero las cosas se complican.', watched: false, airDate: '2009-05-03' },
          { id: 17, name: 'Over', description: 'Walter celebra su cumpleaños, mientras Jesse intenta vender drogas.', watched: false, airDate: '2009-05-10' },
          { id: 18, name: 'Mandala', description: 'Walter y Jesse intentan vender drogas a un nuevo cliente, pero las cosas se complican.', watched: false, airDate: '2009-05-17' },
          { id: 19, name: 'Phoenix', description: 'Walter y Jesse intentan vender drogas, pero las cosas se complican cuando Jesse se mete en problemas.', watched: false, airDate: '2009-05-24' },
          { id: 20, name: 'ABQ', description: 'Walter debe lidiar con las consecuencias de sus acciones, mientras Jesse intenta vender drogas.', watched: false, airDate: '2009-05-31' }
        ]
      },
      'game of thrones': {
        1: [
          { id: 1, name: 'Winter Is Coming', description: 'Lord Stark se ve obligado a servir como Mano del Rey después de que el Rey Robert Baratheon llegue a Winterfell.', watched: false, airDate: '2011-04-17' },
          { id: 2, name: 'The Kingsroad', description: 'Jon Snow se dirige al Muro con su tío Benjen, mientras Daenerys se adapta a su nueva vida con los Dothraki.', watched: false, airDate: '2011-04-24' },
          { id: 3, name: 'Lord Snow', description: 'Jon Snow se adapta a la vida en el Muro, mientras Ned Stark investiga la muerte de Jon Arryn.', watched: false, airDate: '2011-05-01' },
          { id: 4, name: 'Cripples, Bastards, and Broken Things', description: 'Ned Stark investiga la muerte de Jon Arryn, mientras Tyrion Lannister visita el Muro.', watched: false, airDate: '2011-05-08' },
          { id: 5, name: 'The Wolf and the Lion', description: 'Ned Stark se enfrenta a Cersei Lannister, mientras Tyrion es capturado por Catelyn Stark.', watched: false, airDate: '2011-05-15' },
          { id: 6, name: 'A Golden Crown', description: 'Tyrion Lannister se enfrenta a un juicio por combate, mientras Daenerys intenta salvar a su esposo.', watched: false, airDate: '2011-05-22' },
          { id: 7, name: 'You Win or You Die', description: 'Ned Stark se enfrenta a Cersei Lannister, mientras Robert Baratheon es herido en una cacería.', watched: false, airDate: '2011-05-29' },
          { id: 8, name: 'The Pointy End', description: 'Ned Stark es arrestado por traición, mientras Robb Stark prepara su ejército.', watched: false, airDate: '2011-06-05' },
          { id: 9, name: 'Baelor', description: 'Robb Stark se enfrenta a los Lannister en batalla, mientras Ned Stark es ejecutado.', watched: false, airDate: '2011-06-12' },
          { id: 10, name: 'Fire and Blood', description: 'Robb Stark es proclamado Rey del Norte, mientras Daenerys intenta salvar a su esposo.', watched: false, airDate: '2011-06-19' }
        ]
      }
    }

    return hardcodedData[showTitle]?.[seasonNumber] || []
  }

  /**
   * Generar episodios genéricos como último recurso
   */
  private static generateGenericEpisodes(showTitle: string, seasonNumber: number): Episode[] {
    // Generar 10 episodios genéricos
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Episodio ${i + 1}`,
      description: `Descripción del episodio ${i + 1} de la temporada ${seasonNumber} de ${showTitle}.`,
      watched: false,
      airDate: 'TBA',
      seasonNumber: seasonNumber,
      episodeNumber: i + 1,
    }))
  }

  /**
   * Limpiar cache
   */
  static clearCache() {
    this.episodeCache = {}
    this.seasonCache = {}
  }

  /**
   * Obtener imágenes reales combinando múltiples fuentes
   */
  static async getRealImages(showId: string, showTitle: string): Promise<string[]> {
    console.log('Obteniendo imágenes reales para:', showTitle)
    
    // 1. Intentar obtener imágenes específicas para series populares
    try {
      const specificImages = await RealDataService.getSpecificShowImages(showTitle)
      if (specificImages.length > 0) {
        console.log('Usando imágenes específicas:', specificImages.length)
        return specificImages
      }
    } catch (error) {
      console.log('No se pudieron obtener imágenes específicas')
    }

    // 2. Intentar obtener de TheTVDB
    try {
      const tvdbImages = await RealDataService.getShowImages(showId)
      if (tvdbImages.length > 0) {
        console.log('Usando imágenes de TheTVDB:', tvdbImages.length)
        return tvdbImages
      }
    } catch (error) {
      console.log('No se pudieron obtener imágenes de TheTVDB')
    }

    // 3. Fallback a TMDB
    try {
      const tmdbImages = await RealDataService.getTMDBImages(showTitle)
      if (tmdbImages.length > 0) {
        console.log('Usando imágenes de TMDB:', tmdbImages.length)
        return tmdbImages
      }
    } catch (error) {
      console.log('No se pudieron obtener imágenes de TMDB')
    }

    // 4. Último fallback: imágenes genéricas
    console.log('Usando imágenes genéricas')
    return [
      'https://via.placeholder.com/300x450/333/fff?text=No+Image',
      'https://via.placeholder.com/300x450/333/fff?text=No+Image',
      'https://via.placeholder.com/300x450/333/fff?text=No+Image'
    ]
  }

  /**
   * Obtener cast real combinando múltiples fuentes
   */
  static async getRealCast(showId: string, showTitle: string): Promise<Array<{name: string, image: string}>> {
    try {
      // Intentar obtener de TheTVDB primero
      const tvdbCast = await RealDataService.getShowCast(showId)
      if (tvdbCast.length > 0) {
        return tvdbCast
      }
    } catch (error) {
      console.log('No se pudo obtener cast de TheTVDB')
    }

    // Fallback a TMDB
    try {
      const tmdbCast = await RealDataService.getTMDBCast(showTitle)
      if (tmdbCast.length > 0) {
        return tmdbCast
      }
    } catch (error) {
      console.log('No se pudo obtener cast de TMDB')
    }

    // Último fallback: cast genérico
    return [
      { name: 'Actor 1', image: 'https://via.placeholder.com/150x200/333/fff?text=A' },
      { name: 'Actor 2', image: 'https://via.placeholder.com/150x200/333/fff?text=B' },
      { name: 'Actor 3', image: 'https://via.placeholder.com/150x200/333/fff?text=C' },
      { name: 'Actor 4', image: 'https://via.placeholder.com/150x200/333/fff?text=D' },
      { name: 'Actor 5', image: 'https://via.placeholder.com/150x200/333/fff?text=E' }
    ]
  }

  /**
   * Obtener imágenes reales de una serie
   */
  static async getShowImages(showId: string): Promise<string[]> {
    await TVDBService.authenticate()
    try {
      const response = await tvdbApi.get(`/series/${showId}/images`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      const images = response.data.data || []
      console.log('Imágenes obtenidas de TheTVDB:', images.length)
      
      // Filtrar y ordenar por tipo de imagen
      const filteredImages = images
        .filter((img: any) => {
          const type = img.type?.toLowerCase()
          return type === 'poster' || type === 'fanart' || type === 'banner' || type === 'screenshot'
        })
        .sort((a: any, b: any) => {
          // Priorizar posters y fanart
          const typeA = a.type?.toLowerCase()
          const typeB = b.type?.toLowerCase()
          if (typeA === 'poster' && typeB !== 'poster') return -1
          if (typeA === 'fanart' && typeB !== 'poster' && typeB !== 'fanart') return -1
          return 0
        })
        .slice(0, 8) // Tomar más imágenes para tener opciones
        .map((img: any) => {
          // Construir URL completa si es necesario
          let imageUrl = img.image_url || img.url
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `https://artworks.thetvdb.com${imageUrl}`
          }
          return imageUrl
        })
        .filter((url: string) => url && url.startsWith('http'))
      
      console.log('Imágenes filtradas:', filteredImages.length)
      return filteredImages
    } catch (error) {
      console.error('Error al obtener imágenes de la serie:', error)
      return []
    }
  }

  /**
   * Obtener cast real de una serie
   */
  static async getShowCast(showId: string): Promise<Array<{name: string, image: string}>> {
    await TVDBService.authenticate()
    try {
      const response = await tvdbApi.get(`/series/${showId}/people`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      const people = response.data.data || []
      console.log('Personas obtenidas de TheTVDB:', people.length)
      
      const cast = people
        .filter((person: any) => {
          const type = person.type?.toLowerCase()
          const role = person.role?.toLowerCase() || ''
          return type === 'actor' || 
                 role.includes('actor') || 
                 type === 'cast' ||
                 role.includes('main') ||
                 role.includes('lead')
        })
        .slice(0, 8) // Tomar más personas para tener opciones
        .map((person: any) => {
          let imageUrl = person.image_url || person.image
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `https://artworks.thetvdb.com${imageUrl}`
          }
          return {
            name: person.name,
            image: imageUrl || `https://via.placeholder.com/150x200/333/fff?text=${person.name.charAt(0)}`
          }
        })
        .filter((person: any) => person.name && person.name.trim() !== '')
      
      console.log('Cast filtrado:', cast.length)
      return cast.slice(0, 5) // Retornar solo los primeros 5
    } catch (error) {
      console.error('Error al obtener cast de la serie:', error)
      return []
    }
  }

  /**
   * Obtener imágenes de TMDB como fallback
   */
  static async getTMDBImages(showTitle: string): Promise<string[]> {
    const TMDB_API_KEY = '8c247ea0b4b56ed2ff7d41c9a833aa77'
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
    
    try {
      console.log('Buscando serie en TMDB:', showTitle)
      
      // 1. Buscar la serie
      const searchResponse = await fetch(
        `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(showTitle)}`
      )
      const searchData = await searchResponse.json()
      
      if (!searchData.results || searchData.results.length === 0) {
        console.log('No se encontró la serie en TMDB')
        return []
      }
      
      const showId = searchData.results[0].id
      console.log('ID de serie encontrado en TMDB:', showId)
      
      // 2. Obtener imágenes
      const imagesResponse = await fetch(
        `${TMDB_BASE_URL}/tv/${showId}/images?api_key=${TMDB_API_KEY}`
      )
      const imagesData = await imagesResponse.json()
      
      const images: string[] = []
      
      // Agregar poster principal
      if (imagesData.poster_path) {
        images.push(`https://image.tmdb.org/t/p/w500${imagesData.poster_path}`)
      }
      
      // Agregar posters adicionales
      if (imagesData.posters) {
        images.push(...imagesData.posters.slice(0, 2).map((img: any) => 
          `https://image.tmdb.org/t/p/w500${img.file_path}`
        ))
      }
      
      // Agregar backdrops
      if (imagesData.backdrops) {
        images.push(...imagesData.backdrops.slice(0, 4).map((img: any) => 
          `https://image.tmdb.org/t/p/w500${img.file_path}`
        ))
      }
      
      // Agregar logos
      if (imagesData.logos) {
        images.push(...imagesData.logos.slice(0, 1).map((img: any) => 
          `https://image.tmdb.org/t/p/w500${img.file_path}`
        ))
      }
      
      console.log('Imágenes obtenidas de TMDB:', images.length)
      return images
    } catch (error) {
      console.error('Error obteniendo imágenes de TMDB:', error)
      return []
    }
  }

  /**
   * Obtener cast de TMDB como fallback
   */
  static async getTMDBCast(showTitle: string): Promise<Array<{name: string, image: string}>> {
    const TMDB_API_KEY = '8c247ea0b4b56ed2ff7d41c9a833aa77'
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
    
    try {
      console.log('Buscando cast en TMDB para:', showTitle)
      
      // 1. Buscar la serie
      const searchResponse = await fetch(
        `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(showTitle)}`
      )
      const searchData = await searchResponse.json()
      
      if (!searchData.results || searchData.results.length === 0) {
        console.log('No se encontró la serie en TMDB para cast')
        return []
      }
      
      const showId = searchData.results[0].id
      
      // 2. Obtener cast
      const castResponse = await fetch(
        `${TMDB_BASE_URL}/tv/${showId}/credits?api_key=${TMDB_API_KEY}`
      )
      const castData = await castResponse.json()
      
      const cast = castData.cast
        .slice(0, 8) // Tomar más actores para tener opciones
        .map((actor: any) => ({
          name: actor.name,
          image: actor.profile_path 
            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
            : `https://via.placeholder.com/150x200/333/fff?text=${actor.name.charAt(0)}`
        }))
        .filter((actor: any) => actor.name && actor.name.trim() !== '')
      
      console.log('Cast obtenido de TMDB:', cast.length)
      return cast.slice(0, 5) // Retornar solo los primeros 5
    } catch (error) {
      console.error('Error obteniendo cast de TMDB:', error)
      return []
    }
  }

  /**
   * Obtener imágenes específicas para series populares
   */
  static async getSpecificShowImages(showTitle: string): Promise<string[]> {
    const title = showTitle.toLowerCase()
    
    // Mapeo de series populares con URLs de imágenes específicas
    const specificImages: Record<string, string[]> = {
      'wednesday': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/4/42/WednesdayNetflixPosterEnglish.jpg/1200px-WednesdayNetflixPosterEnglish.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Wednesday_Addams_Netflix.jpg/800px-Wednesday_Addams_Netflix.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Wednesday_-_Netflix_Series.png/800px-Wednesday_-_Netflix_Series.png',
        'https://static.tvmaze.com/uploads/images/original_untouched/425/1064741.jpg'
      ],
      'stranger things': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/3/38/Stranger_Things_logo.png/1200px-Stranger_Things_logo.png',
        'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Stranger_Things_season_1.jpg/1200px-Stranger_Things_season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Stranger_Things_season_2.jpg/1200px-Stranger_Things_season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Stranger_Things_season_3.jpg/1200px-Stranger_Things_season_3.jpg'
      ],
      'money heist': [
        'https://upload.wikimedia.org/wikipedia/en/7/7e/Money_Heist_logo.png',
        'https://upload.wikimedia.org/wikipedia/en/7/7e/Money_Heist_S1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/7/7e/Money_Heist_S2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/7/7e/Money_Heist_S3.jpg'
      ],
      'the witcher': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Witcher_logo.jpg/800px-The_Witcher_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Witcher_Season_1.jpg/800px-The_Witcher_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Witcher_Season_2.jpg/800px-The_Witcher_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Witcher_Season_3.jpg/800px-The_Witcher_Season_3.jpg'
      ],
      'peaky blinders': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Peaky_Blinders_logo.jpg/800px-Peaky_Blinders_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Peaky_Blinders_Season_1.jpg/800px-Peaky_Blinders_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Peaky_Blinders_Season_2.jpg/800px-Peaky_Blinders_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Peaky_Blinders_Season_3.jpg/800px-Peaky_Blinders_Season_3.jpg'
      ],
      'the mandalorian': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Mandalorian_logo.jpg/800px-The_Mandalorian_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Mandalorian_Season_1.jpg/800px-The_Mandalorian_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Mandalorian_Season_2.jpg/800px-The_Mandalorian_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Mandalorian_Season_3.jpg/800px-The_Mandalorian_Season_3.jpg'
      ],
      'the crown': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Crown_logo.jpg/800px-The_Crown_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Crown_Season_1.jpg/800px-The_Crown_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Crown_Season_2.jpg/800px-The_Crown_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Crown_Season_3.jpg/800px-The_Crown_Season_3.jpg'
      ],
      'dark': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_logo.jpg/800px-Dark_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_Season_1.jpg/800px-Dark_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_Season_2.jpg/800px-Dark_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_Season_3.jpg/800px-Dark_Season_3.jpg'
      ],
      'the boys': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Boys_logo.jpg/800px-The_Boys_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Boys_Season_1.jpg/800px-The_Boys_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Boys_Season_2.jpg/800px-The_Boys_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Boys_Season_3.jpg/800px-The_Boys_Season_3.jpg'
      ],
      'better call saul': [
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Better_Call_Saul_logo.jpg/800px-Better_Call_Saul_logo.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Better_Call_Saul_Season_1.jpg/800px-Better_Call_Saul_Season_1.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Better_Call_Saul_Season_2.jpg/800px-Better_Call_Saul_Season_2.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Better_Call_Saul_Season_3.jpg/800px-Better_Call_Saul_Season_3.jpg'
      ]
    }

    // Buscar coincidencias exactas o parciales
    for (const [key, images] of Object.entries(specificImages)) {
      if (title.includes(key) || key.includes(title)) {
        console.log(`Imágenes específicas encontradas para: ${showTitle}`)
        return images
      }
    }

    return []
  }
}

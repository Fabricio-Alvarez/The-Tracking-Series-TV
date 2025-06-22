import axios from 'axios'

// Configuración de la API de TheTVDB
const TVDB_BASE_URL = 'https://api4.thetvdb.com/v4'
const TVDB_API_KEY = import.meta.env.VITE_TVDB_API_KEY

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
  id: string
  title: string
  image: string
  rating?: number
  year?: number
  overview?: string
  status?: string
  network?: string
}

export class TVDBService {
  /**
   * Autenticarse con TheTVDB API
   */
  private static async authenticate(): Promise<void> {
    if (accessToken) return // Ya tenemos un token válido

    try {
      console.log('🔐 Autenticando con TheTVDB...')

      const response = await tvdbApi.post('/login', {
        apikey: TVDB_API_KEY,
      })

      accessToken = response.data.data.token

      // Actualizar el header de autorización
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

    const response = await tvdbApi.get('/search', {
      params: {
        query,
        type: 'series',
      },
    })

    const shows = response.data.data
    const movies: Movie[] = []

    // Procesar cada serie
    for (const item of shows.slice(0, 10)) {
      // Limitar a 10 resultados para mejor performance
      try {
        // Intentar obtener la imagen
        const imageResponse = await tvdbApi.get(`/series/${item.id}/images`, {
          params: {
            keyType: 'poster',
            limit: 1,
          },
        })

        const images = imageResponse.data.data
        const imageUrl =
          images && images.length > 0
            ? `https://artworks.thetvdb.com/banners/${images[0].fileName}`
            : 'https://via.placeholder.com/300x450/333/fff?text=No+Image'

        movies.push({
          id: item.id.toString(),
          title: item.name,
          image: imageUrl,
          rating: item.score || 0,
          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : undefined,
          overview: item.overview || 'Sin descripción disponible',
          status: item.status?.name || 'Estado desconocido',
          network: item.network?.name || 'Red no disponible',
        })
      } catch (imageError) {
        console.error(`Error obteniendo imagen para ${item.name}:`, imageError)
        // Agregar la serie sin imagen
        movies.push({
          id: item.id.toString(),
          title: item.name,
          image: 'https://via.placeholder.com/300x450/333/fff?text=No+Image',
          rating: item.score || 0,
          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : undefined,
          overview: item.overview || 'Sin descripción disponible',
          status: item.status?.name || 'Estado desconocido',
          network: item.network?.name || 'Red no disponible',
        })
      }
    }

    return movies
  }

  /**
   * Obtener series populares
   */
  static async getPopularShows(): Promise<Movie[]> {
    await this.authenticate()

    const response = await tvdbApi.get('/series/popular')

    const shows = response.data.data
    const movies: Movie[] = []

    // Procesar cada serie
    for (const item of shows.slice(0, 10)) {
      // Limitar a 10 resultados
      try {
        // Intentar obtener la imagen
        const imageResponse = await tvdbApi.get(`/series/${item.id}/images`, {
          params: {
            keyType: 'poster',
            limit: 1,
          },
        })

        const images = imageResponse.data.data
        const imageUrl =
          images && images.length > 0
            ? `https://artworks.thetvdb.com/banners/${images[0].fileName}`
            : 'https://via.placeholder.com/300x450/333/fff?text=No+Image'

        movies.push({
          id: item.id.toString(),
          title: item.name,
          image: imageUrl,
          rating: item.score || 0,
          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : undefined,
          overview: item.overview || 'Sin descripción disponible',
          status: item.status?.name || 'Estado desconocido',
          network: item.network?.name || 'Red no disponible',
        })
      } catch (imageError) {
        console.error(`Error obteniendo imagen para ${item.name}:`, imageError)
        // Agregar la serie sin imagen
        movies.push({
          id: item.id.toString(),
          title: item.name,
          image: 'https://via.placeholder.com/300x450/333/fff?text=No+Image',
          rating: item.score || 0,
          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : undefined,
          overview: item.overview || 'Sin descripción disponible',
          status: item.status?.name || 'Estado desconocido',
          network: item.network?.name || 'Red no disponible',
        })
      }
    }

    return movies
  }

  /**
   * Obtener series recomendadas (usando trending)
   */
  static async getRecommendedShows(): Promise<Movie[]> {
    await this.authenticate()

    const response = await tvdbApi.get('/series/trending')

    const shows = response.data.data
    const movies: Movie[] = []

    // Procesar cada serie
    for (const item of shows.slice(0, 10)) {
      // Limitar a 10 resultados
      try {
        // Intentar obtener la imagen
        const imageResponse = await tvdbApi.get(`/series/${item.id}/images`, {
          params: {
            keyType: 'poster',
            limit: 1,
          },
        })

        const images = imageResponse.data.data
        const imageUrl =
          images && images.length > 0
            ? `https://artworks.thetvdb.com/banners/${images[0].fileName}`
            : 'https://via.placeholder.com/300x450/333/fff?text=No+Image'

        movies.push({
          id: item.id.toString(),
          title: item.name,
          image: imageUrl,
          rating: item.score || 0,
          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : undefined,
          overview: item.overview || 'Sin descripción disponible',
          status: item.status?.name || 'Estado desconocido',
          network: item.network?.name || 'Red no disponible',
        })
      } catch (imageError) {
        console.error(`Error obteniendo imagen para ${item.name}:`, imageError)
        // Agregar la serie sin imagen
        movies.push({
          id: item.id.toString(),
          title: item.name,
          image: 'https://via.placeholder.com/300x450/333/fff?text=No+Image',
          rating: item.score || 0,
          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : undefined,
          overview: item.overview || 'Sin descripción disponible',
          status: item.status?.name || 'Estado desconocido',
          network: item.network?.name || 'Red no disponible',
        })
      }
    }

    return movies
  }

  /**
   * Obtener detalles de una serie específica
   */
  static async getShowDetails(showId: string): Promise<Movie> {
    await this.authenticate()

    const response = await tvdbApi.get(`/series/${showId}`)
    const show = response.data.data

    let imageUrl = 'https://via.placeholder.com/300x450/333/fff?text=No+Image'

    try {
      const imageResponse = await tvdbApi.get(`/series/${showId}/images`, {
        params: {
          keyType: 'poster',
          limit: 1,
        },
      })

      const images = imageResponse.data.data
      if (images && images.length > 0) {
        imageUrl = `https://artworks.thetvdb.com/banners/${images[0].fileName}`
      }
    } catch (imageError) {
      console.error('Error obteniendo imagen:', imageError)
    }

    return {
      id: show.id.toString(),
      title: show.name,
      image: imageUrl,
      rating: show.score || 0,
      year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : undefined,
      overview: show.overview || 'Sin descripción disponible',
      status: show.status?.name || 'Estado desconocido',
      network: show.network?.name || 'Red no disponible',
    }
  }
}

export default TVDBService

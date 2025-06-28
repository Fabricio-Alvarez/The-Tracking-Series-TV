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
        }))
    } catch (error) {
      console.error('Error en searchShows:', error)
      return []
    }
  }

  /**
   * Obtener detalles de una serie específica
   */
  static async getShowDetails(showId: string): Promise<Movie | null> {
    await this.authenticate()
    try {
      const response = await tvdbApi.get(`/series/${showId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const show = response.data.data
      return {
        id: show.id,
        title: show.name,
        image: show.image_url || show.image || '/images/placeholder.jpg',
        rating: show.score || '7.9',
        year: show.firstAired?.split?.('-')[0] ?? show.year ?? '',
        overview: show.overview || 'Sin descripción disponible',
        status: show.status?.name || 'Estado desconocido',
        network: show.network?.name || 'Red no disponible',
      }
    } catch (error) {
      console.error('Error al obtener detalles del show:', error)
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
          } as Movie
        : null;
    } catch (err) {
      console.warn(`Error al buscar "${title}":`, err);
      return null;
    }
  });

  const results = await Promise.all(fetches);
  return results.filter((item): item is Movie => item !== null);
}

export default TVDBService

import axios from 'axios'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'

// Cargar variables de entorno
dotenv.config()

// Leer directamente del archivo .env como fallback
const envContent = readFileSync('.env', 'utf8')
const envVars = {}
envContent.split('\n').forEach((line) => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key.trim()] = value.trim()
  }
})

const TVDB_BASE_URL = 'https://api4.thetvdb.com/v4'
const TVDB_API_KEY = process.env.VITE_TVDB_API_KEY || envVars.VITE_TVDB_API_KEY

console.log('🔍 Probando autenticación con TheTVDB API v4...')
console.log('API Key:', TVDB_API_KEY ? '✅ Configurada' : '❌ No configurada')
console.log(
  'API Key (primeros 10 caracteres):',
  TVDB_API_KEY ? TVDB_API_KEY.substring(0, 10) + '...' : 'No disponible',
)

async function testAuth() {
  try {
    const authResponse = await axios.post(`${TVDB_BASE_URL}/login`, { apikey: TVDB_API_KEY })
    const token = authResponse.data.data.token
    const searchResponse = await axios.get(`${TVDB_BASE_URL}/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { query: 'Breaking Bad', type: 'series' },
    })
    const firstShow = searchResponse.data.data[0]
    const imagesResponse = await axios.get(`${TVDB_BASE_URL}/series/${firstShow.id}/images`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { keyType: 'poster', limit: 1 },
    })
    const imageUrl = imagesResponse.data.data[0]?.fileName
      ? `https://artworks.thetvdb.com/banners/${imagesResponse.data.data[0].fileName}`
      : 'No image'
    console.log('OK:', { show: firstShow.name, image: imageUrl })
  } catch (error) {
    console.error('ERROR:', error.response?.data || error.message)
  }
}

testAuth()

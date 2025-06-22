import { createClient } from '@libsql/client'

// Configuración de Turso
const TURSO_DB_URL = import.meta.env.VITE_TURSO_DB_URL
const TURSO_DB_TOKEN = import.meta.env.VITE_TURSO_DB_TOKEN

// Servicio para manejo de base de datos Turso
// Por ahora usamos localStorage como fallback hasta configurar Turso

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface UserShow {
  id: string
  userId: string
  showId: string
  type: 'watchlist' | 'watched' | 'favorites'
  addedAt: Date
}

class TursoService {
  private client: any
  private isConnected = false

  constructor() {
    // Intentar conectar a Turso si las variables están configuradas
    if (TURSO_DB_URL && TURSO_DB_TOKEN) {
      try {
        this.client = createClient({
          url: TURSO_DB_URL,
          authToken: TURSO_DB_TOKEN,
        })
        this.isConnected = true
        console.log('✅ Conectado a Turso')
      } catch (error) {
        console.error('❌ Error conectando a Turso:', error)
        this.isConnected = false
      }
    } else {
      console.log('⚠️ Variables de Turso no configuradas, usando localStorage')
      this.isConnected = false
    }
  }

  // Métodos de usuario
  async createUser(email: string, name: string): Promise<User> {
    if (this.isConnected) {
      try {
        const userId = this.generateId()
        const now = new Date().toISOString()

        await this.client.execute({
          sql: 'INSERT INTO users (id, email, name, created_at) VALUES (?, ?, ?, ?)',
          args: [userId, email, name, now],
        })

        const user: User = {
          id: userId,
          email,
          name,
          createdAt: new Date(now),
        }

        // Guardar en localStorage también
        localStorage.setItem('currentUser', JSON.stringify(user))
        return user
      } catch (error) {
        console.error('Error creando usuario en Turso:', error)
        throw error
      }
    } else {
      // Fallback a localStorage
      const user: User = {
        id: this.generateId(),
        email,
        name,
        createdAt: new Date(),
      }

      localStorage.setItem('currentUser', JSON.stringify(user))
      return user
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.isConnected) {
      try {
        const stored = localStorage.getItem('currentUser')
        if (!stored) return null

        const user = JSON.parse(stored)

        // Verificar que el usuario existe en Turso
        const result = await this.client.execute({
          sql: 'SELECT * FROM users WHERE id = ?',
          args: [user.id],
        })

        if (result.rows.length === 0) {
          // Usuario no existe en Turso, eliminarlo de localStorage
          localStorage.removeItem('currentUser')
          return null
        }

        return user
      } catch (error) {
        console.error('Error obteniendo usuario de Turso:', error)
        // Fallback a localStorage
        const stored = localStorage.getItem('currentUser')
        return stored ? JSON.parse(stored) : null
      }
    } else {
      const stored = localStorage.getItem('currentUser')
      return stored ? JSON.parse(stored) : null
    }
  }

  // Métodos de shows del usuario
  async addUserShow(userId: string, showId: string, type: UserShow['type']): Promise<void> {
    if (this.isConnected) {
      try {
        const userShowId = this.generateId()
        const now = new Date().toISOString()

        await this.client.execute({
          sql: 'INSERT OR REPLACE INTO user_shows (id, user_id, show_id, type, added_at) VALUES (?, ?, ?, ?, ?)',
          args: [userShowId, userId, showId, type, now],
        })
      } catch (error) {
        console.error('Error agregando show a Turso:', error)
        throw error
      }
    } else {
      // Fallback a localStorage
      const userShow: UserShow = {
        id: this.generateId(),
        userId,
        showId,
        type,
        addedAt: new Date(),
      }

      const key = `userShow_${userId}_${showId}_${type}`
      localStorage.setItem(key, JSON.stringify(userShow))
    }
  }

  async removeUserShow(userId: string, showId: string, type: UserShow['type']): Promise<void> {
    if (this.isConnected) {
      try {
        await this.client.execute({
          sql: 'DELETE FROM user_shows WHERE user_id = ? AND show_id = ? AND type = ?',
          args: [userId, showId, type],
        })
      } catch (error) {
        console.error('Error removiendo show de Turso:', error)
        throw error
      }
    } else {
      // Fallback a localStorage
      const key = `userShow_${userId}_${showId}_${type}`
      localStorage.removeItem(key)
    }
  }

  async getUserShows(userId: string, type?: UserShow['type']): Promise<UserShow[]> {
    if (this.isConnected) {
      try {
        let sql = 'SELECT * FROM user_shows WHERE user_id = ?'
        let args = [userId]

        if (type) {
          sql += ' AND type = ?'
          args.push(type)
        }

        sql += ' ORDER BY added_at DESC'

        const result = await this.client.execute({ sql, args })

        return result.rows.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          showId: row.show_id,
          type: row.type,
          addedAt: new Date(row.added_at),
        }))
      } catch (error) {
        console.error('Error obteniendo shows de Turso:', error)
        // Fallback a localStorage
        return this.getUserShowsFromLocalStorage(userId, type)
      }
    } else {
      return this.getUserShowsFromLocalStorage(userId, type)
    }
  }

  async isUserShow(userId: string, showId: string, type: UserShow['type']): Promise<boolean> {
    if (this.isConnected) {
      try {
        const result = await this.client.execute({
          sql: 'SELECT COUNT(*) as count FROM user_shows WHERE user_id = ? AND show_id = ? AND type = ?',
          args: [userId, showId, type],
        })

        return result.rows[0].count > 0
      } catch (error) {
        console.error('Error verificando show en Turso:', error)
        // Fallback a localStorage
        const key = `userShow_${userId}_${showId}_${type}`
        return localStorage.getItem(key) !== null
      }
    } else {
      const key = `userShow_${userId}_${showId}_${type}`
      return localStorage.getItem(key) !== null
    }
  }

  // Método para inicializar la base de datos
  async initializeDatabase(): Promise<void> {
    if (!this.isConnected) return

    try {
      // Crear tabla de usuarios
      await this.client.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Crear tabla de shows del usuario
      await this.client.execute(`
        CREATE TABLE IF NOT EXISTS user_shows (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          show_id TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('watchlist', 'watched', 'favorites')),
          added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `)

      console.log('✅ Base de datos Turso inicializada')
    } catch (error) {
      console.error('❌ Error inicializando base de datos:', error)
    }
  }

  // Método para conectar a Turso
  async connect(): Promise<void> {
    if (TURSO_DB_URL && TURSO_DB_TOKEN) {
      try {
        this.client = createClient({
          url: TURSO_DB_URL,
          authToken: TURSO_DB_TOKEN,
        })
        this.isConnected = true
        await this.initializeDatabase()
        console.log('✅ Conectado a Turso')
      } catch (error) {
        console.error('❌ Error conectando a Turso:', error)
        this.isConnected = false
      }
    } else {
      console.log('⚠️ Variables de Turso no configuradas')
      this.isConnected = false
    }
  }

  // Métodos de fallback para localStorage
  private getUserShowsFromLocalStorage(userId: string, type?: UserShow['type']): UserShow[] {
    const shows: UserShow[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`userShow_${userId}_`)) {
        const show = JSON.parse(localStorage.getItem(key)!)
        if (!type || show.type === type) {
          shows.push(show)
        }
      }
    }

    return shows.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
  }

  // Utilidades
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}

export default new TursoService()

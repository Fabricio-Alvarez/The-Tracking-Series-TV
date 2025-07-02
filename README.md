# The Tracking Series TV 📺

Una aplicación moderna para rastrear y gestionar tus series de televisión favoritas, con datos reales de múltiples APIs.

## ✨ Características Principales

### 🎯 **Datos Reales de Series**
- **API de TheTVDB**: Integración completa con la base de datos más grande de series de TV
- **API de TMDB**: Datos adicionales de episodios, temporadas y cast
- **Datos Hardcodeados**: Información real para series populares como fallback
- **Cache Inteligente**: Sistema de cache para optimizar las llamadas a la API

### 🔍 **Búsqueda Avanzada**
- Búsqueda en tiempo real con debounce
- Resultados de múltiples fuentes de datos
- Filtrado por tipo de contenido

### 📋 **Gestión de Listas**
- **Watchlist**: Series que quieres ver
- **Watching**: Series que estás viendo actualmente
- **Watched**: Series que ya terminaste
- **Favorites**: Tus series favoritas

### 📊 **Seguimiento de Episodios**
- Marcado de episodios como vistos
- Progreso por temporada
- Persistencia en localStorage
- Navegación entre temporadas

### 🎨 **Interfaz Moderna**
- Diseño responsive y moderno
- Tema oscuro
- Navegación intuitiva
- Iconos de Ionic

## 🚀 **Nuevo Sistema de Datos Reales**

### **Arquitectura de Datos**

La aplicación ahora utiliza un sistema de múltiples capas para obtener datos reales:

1. **TheTVDB API** (Prioridad 1)
   - Detalles completos de series
   - Temporadas y episodios
   - Géneros y creadores
   - Estado de emisión

2. **TMDB API** (Prioridad 2)
   - Datos adicionales de episodios
   - Imágenes de episodios
   - Información de cast

3. **Datos Hardcodeados** (Prioridad 3)
   - Series populares con datos reales
   - Fallback para series sin datos en APIs

4. **Datos Genéricos** (Prioridad 4)
   - Último recurso para series desconocidas

### **Servicios Implementados**

#### `TVDBService`
```typescript
// Obtener detalles de una serie
const showDetails = await TVDBService.getShowDetails(showId)

// Obtener temporadas
const seasons = await TVDBService.getSeasons(showId)

// Obtener episodios de una temporada
const episodes = await TVDBService.getEpisodes(showId, seasonNumber)
```

#### `RealDataService`
```typescript
// Obtener episodios reales combinando múltiples fuentes
const episodes = await RealDataService.getRealEpisodes(showId, showTitle, seasonNumber)
```

### **Vistas Actualizadas**

#### `SeasonEpisodesView.vue`
- Usa `RealDataService` para obtener episodios reales
- Fallback a datos hardcodeados para series específicas
- Mantiene funcionalidad de marcado de episodios

#### `ShowDetailView.vue`
- Carga datos reales de la API al montar
- Prioriza datos de la API sobre datos hardcodeados
- Muestra géneros, creadores y temporadas reales

#### `ShowWatchView.vue`
- Obtiene temporadas reales de la API
- Usa creadores como cast cuando no hay datos específicos
- Mantiene funcionalidad de progreso

## 🛠️ **Instalación y Configuración**

### **Requisitos**
- Node.js 16+
- npm o yarn

### **Instalación**
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env

# Ejecutar en desarrollo
npm run dev
```

### **Variables de Entorno**
```env
# TheTVDB API (ya configurada)
VITE_TVDB_API_KEY=249d19f5-13f4-4fb7-bebb-15e631a2b67a

# Turso Database (opcional)
VITE_TURSO_DB_URL=your_turso_db_url
VITE_TURSO_DB_TOKEN=your_turso_db_token
```

## 📱 **Uso de la Aplicación**

### **Explorar Series**
1. Ve a la pantalla principal
2. Busca series por nombre
3. Explora series populares y recomendadas
4. Agrega series a tus listas

### **Gestionar Episodios**
1. Selecciona una serie
2. Ve a "Start Watching"
3. Navega entre temporadas
4. Marca episodios como vistos

### **Organizar Listas**
- **Watchlist**: Series pendientes
- **Watching**: Series en progreso
- **Watched**: Series completadas
- **Favorites**: Series favoritas

## 🔧 **Estructura del Proyecto**

```
src/
├── components/          # Componentes reutilizables
├── services/           # Servicios de API y datos
│   ├── tvdbService.ts  # TheTVDB API + RealDataService
│   └── tursoService.ts # Base de datos Turso
├── stores/             # Estado global (Pinia)
├── views/              # Vistas principales
│   ├── SeasonEpisodesView.vue
│   ├── ShowDetailView.vue
│   └── ShowWatchView.vue
└── router/             # Configuración de rutas
```

## 🌟 **Series con Datos Reales**

### **Series Populares**
- Stranger Things
- The Mandalorian
- Peaky Blinders
- The Crown
- Dark
- The Boys
- Better Call Saul
- The Witcher
- Money Heist
- Ozark
- Westworld
- The Office

### **Series Recomendadas**
- Fleabag
- The Marvelous Mrs. Maisel
- Chernobyl
- Mindhunter
- The Expanse
- Succession
- Barry
- The Leftovers
- Atlanta
- The Good Place
- Severance
- Ted Lasso

### **Series Adicionales**
- Breaking Bad
- Game of Thrones
- Y cualquier serie que esté en TheTVDB o TMDB

## 🔄 **Sistema de Cache**

La aplicación implementa un sistema de cache inteligente:

- **Cache de Episodios**: Evita llamadas repetidas a la API
- **Cache de Temporadas**: Almacena información de temporadas
- **Persistencia Local**: Guarda progreso del usuario
- **Invalidación Automática**: Limpia cache cuando es necesario

## 🚀 **Próximas Mejoras**

- [ ] Integración con más APIs (OMDB, IMDb)
- [ ] Sistema de recomendaciones
- [ ] Notificaciones de nuevos episodios
- [ ] Modo offline
- [ ] Exportar/importar datos
- [ ] Estadísticas de visualización

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT.

---

**¡Disfruta rastreando tus series favoritas con datos reales! 🎬**



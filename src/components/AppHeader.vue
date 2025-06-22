<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="app-title">TV Tracker</h1>
      </div>

      <div class="header-right">
        <div class="search-container">
          <div class="search-box">
            <ion-icon name="search-outline" class="search-icon"></ion-icon>
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Buscar series..."
              class="search-input"
            />
            <button @click="handleSearch" class="search-button" :disabled="!searchQuery.trim()">
              <ion-icon name="search-outline"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShowsStore } from '@/stores/shows'

const router = useRouter()
const showsStore = useShowsStore()

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Guardar la query en el store
    showsStore.setSearchQuery(searchQuery.value)

    // Navegar a la vista de búsqueda
    router.push('/search')

    // Limpiar el input
    searchQuery.value = ''
  }
}
</script>

<style scoped>
.app-header {
  background: #1a1a1a;
  border-bottom: 1px solid #333;
  padding: 16px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.header-left {
  flex-shrink: 0;
}

.app-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.header-right {
  flex: 1;
  max-width: 400px;
}

.search-container {
  width: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  background: #2d2d2d;
  border-radius: 25px;
  padding: 4px;
  transition: box-shadow 0.2s;
}

.search-box:focus-within {
  box-shadow: 0 0 0 2px #6c7ae0;
}

.search-icon {
  font-size: 18px;
  color: #888;
  margin-left: 12px;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
  outline: none;
  padding: 8px 12px;
}

.search-input::placeholder {
  color: #888;
}

.search-button {
  background: #6c7ae0;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 4px;
}

.search-button:hover:not(:disabled) {
  background: #5a6bc8;
}

.search-button:disabled {
  background: #555;
  cursor: not-allowed;
}

.search-button ion-icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .app-header {
    padding: 12px 16px;
  }

  .header-content {
    gap: 12px;
  }

  .app-title {
    font-size: 20px;
  }

  .header-right {
    max-width: 300px;
  }

  .search-input {
    font-size: 13px;
    padding: 6px 10px;
  }

  .search-button {
    width: 32px;
    height: 32px;
  }

  .search-button ion-icon {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .header-right {
    max-width: 100%;
  }

  .app-title {
    text-align: center;
  }
}
</style>

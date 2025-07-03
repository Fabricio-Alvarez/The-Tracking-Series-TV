<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="app-title" @click="clearSearchAndGoHome" style="cursor:pointer">TV Tracker</h1>
      </div>

      <div class="header-right">
        <div class="search-container">
          <div class="search-box">
            <button @click="performSearch" class="search-icon-button" :disabled="!searchQuery.trim() || isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              <ion-icon v-else name="search-outline" class="search-icon"></ion-icon>
            </button>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Search"
              class="search-input"
              :disabled="isLoading"
              @keyup.enter="performSearch"
            />
            <button class="contact-button">
              <ion-icon name="person-outline"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useShowsStore } from '@/stores/shows'
import TVDBService from '@/services/tvdbService'

const router = useRouter()
const showsStore = useShowsStore()
const searchQuery = computed({
  get: () => showsStore.searchQuery,
  set: (val: string) => showsStore.setSearchQuery(val)
})
const isLoading = ref(false)
const error = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

let searchTimeout: NodeJS.Timeout | null = null

const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  isLoading.value = true
  error.value = ''
  try {
    await showsStore.searchAll(searchQuery.value)
    showsStore.setSearchQuery(searchQuery.value)
  } catch (err) {
    error.value = 'Error al buscar series o películas.'
    showsStore.setSearchResults([])
  } finally {
    isLoading.value = false
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const clearSearchAndGoHome = () => {
  searchQuery.value = ''
  showsStore.setSearchResults([])
  router.push('/')
}

// Debounce para búsqueda automática
watch(
  () => searchQuery.value,
  (newQuery, oldQuery) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    if (!newQuery.trim()) {
      showsStore.setSearchResults([])
      return
    }
    searchTimeout = setTimeout(() => {
      performSearch()
    }, 1000)
  }
)
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

.search-icon-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0 4px 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}

.search-icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.search-icon {
  font-size: 18px;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #888;
  font-size: 14px;
  outline: none;
  padding: 8px 12px;
}

.search-input::placeholder {
  color: #888;
}

.contact-button {
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

.contact-button:hover {
  background: #5a6bc8;
}

.contact-button ion-icon {
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

  .contact-button ion-icon {
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

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #888;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

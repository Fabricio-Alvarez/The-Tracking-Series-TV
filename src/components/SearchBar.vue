<template>
  <div class="search-container">
    <div class="search-box">
      <input
        v-model="localQuery"
        @input="handleSearch"
        @keyup.enter.prevent
        type="text"
        placeholder="Search"
        class="search-input"
        :disabled="isLoading"
      />
      <button
        @click="performSearch"
        class="search-button"
        :disabled="isLoading || !localQuery.trim()"
      >
        <span v-if="isLoading" class="loading-spinner"></span>
        <span v-else>🔍</span>
      </button>
    </div>

    <div v-if="searchError" class="error-message">
      {{ searchError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useShowsStore } from '@/stores/shows'
import TVDBService from '@/services/tvdbService'

const showsStore = useShowsStore()
const localQuery = ref('')


const isLoading = computed(() => showsStore.isLoading)
const searchError = computed(() => showsStore.searchError)


let searchTimeout: ReturnType<typeof setTimeout> | null = null

const handleSearch = () => {
  showsStore.setSearchQuery(localQuery.value)

  
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  
  searchTimeout = setTimeout(() => {
    if (localQuery.value.trim()) {
      performSearch()
    } else {
      showsStore.setSearchResults([])
    }
  }, 500)
}

const performSearch = async () => {
  if (!localQuery.value.trim()) return
  try {
    showsStore.setLoading(true)
    showsStore.setSearchError('')
    await showsStore.searchAll(localQuery.value)
  } catch (error) {
    showsStore.setSearchError('Error al buscar series o películas. Intenta de nuevo.')
    showsStore.setSearchResults([])
  } finally {
    showsStore.setLoading(false)
  }
}


watch(
  () => showsStore.searchQuery,
  (newQuery) => {
    if (newQuery !== localQuery.value) {
      localQuery.value = newQuery
    }
  },
)
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-box {
  display: flex;
  gap: 8px;
  background: white;
  border-radius: 25px;
  padding: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 20px;
  background: transparent;
}

.search-input::placeholder {
  color: #999;
}

.search-button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover:not(:disabled) {
  background: #0056b3;
}

.search-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
}
</style>

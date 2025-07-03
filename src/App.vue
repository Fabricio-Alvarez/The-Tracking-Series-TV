<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useShowsStore } from '@/stores/shows'
import BottomNavigation from '@/components/BottomNavigation.vue'
import UserLoginForm from '@/components/UserLoginForm.vue'


const showsStore = useShowsStore()
const isLoggedIn = computed(() => showsStore.currentUser !== null)

onMounted(async () => {
  showsStore.initializeFromStorage()
  await showsStore.loadCurrentUser()
})
</script>

<template>
  <div id="app">

    <main class="main-content">
      <UserLoginForm v-if="!isLoggedIn" />
      <router-view v-else />
    </main>
    <BottomNavigation v-if="isLoggedIn" />
  </div>
</template>

<style>
#app {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  background-color: #121212;
  color: #fff;
  min-height: calc(100vh - 80px); 
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-bottom: 80px; 
}


* {
  box-sizing: border-box;
}


::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Transiciones suaves */
* {
  transition:
    color 0.2s,
    background-color 0.2s,
    border-color 0.2s;
}


*:focus-visible {
  outline: 2px solid #6c7ae0;
  outline-offset: 2px;
}


button {
  cursor: pointer;
  font-family: inherit;
}

button:disabled {
  cursor: not-allowed;
}


a {
  color: inherit;
  text-decoration: none;
}


input {
  font-family: inherit;
}


@media (max-width: 768px) {
  .main-content {
    padding-bottom: 70px;
  }
}


#app:has(.user-login-form) ~ #app-header,
#app:has(.user-login-form) #app-header,
#app .user-login-form ~ #app-header {
  display: none !important;
}
</style>

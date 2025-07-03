<template>
  <nav class="bottom-nav">
    <a href="#" class="nav-item" :class="{ active: $route.path === '/' }" @click.prevent="clearSearchAndGoHome">
      <ion-icon name="compass-outline"></ion-icon>
      <span>Explore</span>
    </a>

    <router-link to="/my-shows" class="nav-item" active-class="active">
      <ion-icon name="play-outline"></ion-icon>
      <span>My shows</span>
    </router-link>

    <router-link to="/calendar" class="nav-item" active-class="active">
      <ion-icon name="calendar-outline"></ion-icon>
      <span>Calendar</span>
    </router-link>

    <router-link to="/notifications" class="nav-item" active-class="active">
      <ion-icon name="notifications-outline"></ion-icon>
      <span>Notifications</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useShowsStore } from '@/stores/shows'

const router = useRouter()
const showsStore = useShowsStore()

const clearSearchAndGoHome = () => {
  showsStore.setSearchQuery('')
  showsStore.setSearchResults([])
  router.push('/')
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1a1a1a;
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #888;
  font-size: 12px;
  transition: color 0.2s;
  padding: 4px 8px;
  border-radius: 8px;
}

.nav-item:hover {
  color: #6c7ae0;
}

.nav-item.active {
  color: #6c7ae0;
}

.nav-item ion-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.nav-item span {
  font-weight: 500;
}

@media (max-width: 480px) {
  .nav-item {
    font-size: 11px;
    padding: 2px 4px;
  }

  .nav-item ion-icon {
    font-size: 18px;
  }
}
</style>

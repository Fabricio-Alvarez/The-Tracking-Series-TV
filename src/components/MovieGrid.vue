<template>
  <div class="content-header">
    <div class="count">{{ count }} {{ type }}</div>
    <div class="selection-mode" @click="$emit('selection-mode')">
      <ion-icon name="options-outline"></ion-icon>
      <span>Selection mode</span>
    </div>
  </div>
  <div class="movie-grid">
    <MovieCard
      v-for="movie in movies"
      :key="movie.id"
      :movie="movie"
      :show-rating="false"
      :show-year="true"
      @click="$emit('movie-click', movie)"
    />
  </div>
</template>

<script setup lang="ts">
import MovieCard from './MovieCard.vue'

interface Movie {
  id: string
  title: string
  image: string
  rating?: number
  year?: number
}

interface Props {
  movies: Movie[]
  count: number
  type: string
}

defineProps<Props>()

defineEmits<{
  'selection-mode': []
  'movie-click': [movie: Movie]
}>()
</script>

<style scoped>

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.count {
  font-size: 14px;
  color: #aaa;
}

.selection-mode {
  display: inline-flex;
  align-items: center;
  color: #6c7ae0;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.selection-mode:hover {
  opacity: 0.7;
}

.selection-mode ion-icon {
  font-size: 18px;
  margin-right: 6px;
  color: inherit;
}


.movie-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 16px 16px;
}


@media (min-width: 768px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

@media (min-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;
  }
}

@media (min-width: 1440px) {
  .movie-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .content-header {
    padding: 0 20px;
  }
}

@media (min-width: 1800px) {
  .movie-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>

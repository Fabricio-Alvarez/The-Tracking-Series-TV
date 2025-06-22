<template>
  <div class="section">
    <div class="content-header">
      <div class="content-title">{{ title }}</div>
      <div class="see-all" @click="$emit('see-all')">→</div>
    </div>
    <div class="movie-list">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        :show-rating="showRating"
        :show-year="showYear"
        @click="$emit('movie-click', movie)"
      />
    </div>
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
  title: string
  movies: Movie[]
  showRating?: boolean
  showYear?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRating: true,
  showYear: false,
})

defineEmits<{
  'see-all': []
  'movie-click': [movie: Movie]
}>()
</script>

<style scoped>
/* Sections horizontales */
.section {
  margin-bottom: 24px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.content-title {
  font-size: 18px;
  font-weight: 600;
}

.see-all {
  font-size: 20px;
  color: #aaa;
  cursor: pointer;
  transition: color 0.2s;
}

.see-all:hover {
  color: #fff;
}

.movie-list {
  display: flex;
  overflow-x: auto;
  padding: 0 16px 16px;
  gap: 12px;
  scrollbar-width: none;
}

.movie-list::-webkit-scrollbar {
  display: none;
}

.movie-list .movie-card {
  flex: 0 0 auto;
  width: 120px;
}

/* Responsive */
@media (min-width: 768px) {
  .movie-list .movie-card {
    width: 160px;
  }

  .content-title {
    font-size: 22px;
  }
}

@media (min-width: 1024px) {
  .movie-list .movie-card {
    width: 180px;
  }
}

@media (min-width: 1440px) {
  .content-header {
    padding: 0 20px;
  }
}
</style>

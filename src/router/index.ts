import { createRouter, createWebHistory } from 'vue-router'
import ExploreScreen from '@/views/ExploreScreen.vue'
import MyShowsScreen from '@/views/MyShowsScreen.vue'
import WatchlistView from '@/views/WatchlistView.vue'
import WatchedView from '@/views/WatchedView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import ShowDetailView from '@/views/ShowDetailView.vue'
import ShowWatchView from '@/views/ShowWatchView.vue'
import SeasonEpisodesView from '@/views/SeasonEpisodesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'explore',
      component: ExploreScreen,
    },
    {
      path: '/my-shows',
      name: 'my-shows',
      component: MyShowsScreen,
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: WatchlistView,
    },
    {
      path: '/watched',
      name: 'watched',
      component: WatchedView,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
    },
    {
      path: '/show/:id',
      name: 'show-detail',
      component: ShowDetailView,
      props: true,
    },
    {
      path: '/show/:id/watch',
      name: 'show-watch',
      component: ShowWatchView,
      props: true,
    },
    {
      path: '/show/:id/season/:season',
      name: 'season-episodes',
      component: SeasonEpisodesView,
      props: true,
    },
  ],
})

export default router

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSeriesPeopleMock, getSeriesImagesMock, TVDBService, RealDataService } from '@/services/tvdbService'
import { useShowsStore } from '@/stores/shows'

const route = useRoute()
const router = useRouter()
const showId = String(route.params.id)

const cast = ref<any[]>([])
const images = ref<string[]>([])
const trailers = ref<any[]>([])
const nextEpisode = ref<any>(null)
const seasons = ref<any[]>([])
const showsStore = useShowsStore()

const show = computed(() => showsStore.getShowById(showId))

const showTitle = computed(() => show.value?.title || '')

const isLoading = ref(true)

async function loadRealWatchData() {
  if (!show.value) return
  
  try {
    const realSeasons = await TVDBService.getSeasons(showId)
    if (realSeasons.length > 0) {
      seasons.value = realSeasons.map(season => ({
        number: season.seasonNumber,
        watched: 0,
        total: season.episodeCount
      }))
    }
    try {
      const realCast = await RealDataService.getRealCast(showId, showTitle.value)
      if (realCast.length > 0) {
        cast.value = realCast
      }
    } catch (error) {
      console.log('No se pudo obtener cast de la API')
    }
    try {
      const realImages = await RealDataService.getRealImages(showId, showTitle.value)
      if (realImages.length > 0) {
        images.value = realImages
      }
    } catch (error) {
      console.log('No se pudieron obtener imágenes de la API')
    }
    
  } catch (error) {
    console.error('Error loading real watch data:', error)
  }
}

const seriesWatchData: Record<string, any> = {
  'wednesday': {
     cast: [
      {
        "name": "Jenna Ortega",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Jenna_Ortega_at_2022_MTV_Movie_%26_TV_Awards.png/800px-Jenna_Ortega_at_2022_MTV_Movie_%26_TV_Awards.png"
      },
      {
        "name": "Hunter Doohan",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Hunter_Doohan_2022.png/800px-Hunter_Doohan_2022.png"
      },
      {
        "name": "Percy Hynes White",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Percy_Hynes_White_2022.png/800px-Percy_Hynes_White_2022.png"
      },
      {
        "name": "Emma Myers",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Emma_Myers_2022.png/800px-Emma_Myers_2022.png"
      },
      {
        "name": "Joy Sunday",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Joy_Sunday_2022.png/800px-Joy_Sunday_2022.png"
      }
    ],
    images: [
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/42/WednesdayNetflixPosterEnglish.jpg/1200px-WednesdayNetflixPosterEnglish.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Wednesday_Addams_Netflix.jpg/800px-Wednesday_Addams_Netflix.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Wednesday_-_Netflix_Series.png/800px-Wednesday_-_Netflix_Series.png"
    ],
    trailer: { image: 'https://static.tvmaze.com/uploads/images/original_untouched/425/1064741.jpg', url: 'https://www.youtube.com/watch?v=Q73UhUTs6y0' },
    nextEpisode: { date: 'November 23, 2022', code: 's01e08', name: 'A Murder of Woes' },
    seasons: [
      { number: 1, watched: 8, total: 8 },
    ],
  },
  'stranger things': {
    cast: [
      { name: 'Millie Bobby Brown', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/200/501942.jpg' },
      { name: 'Finn Wolfhard', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/200/501943.jpg' },
      { name: 'David Harbour', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/200/501944.jpg' },
      { name: 'Winona Ryder', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/200/501945.jpg' },
      { name: 'Gaten Matarazzo', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/200/501946.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/200/501947.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/200/501948.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/200/501949.jpg',
    ],
    trailer: { image: 'https://static.tvmaze.com/uploads/images/original_untouched/200/501947.jpg', url: 'https://www.youtube.com/watch?v=b9EkMc79ZSU' },
    nextEpisode: { date: 'July 1, 2022', code: 's04e09', name: 'The Piggyback' },
    seasons: [
      { number: 4, watched: 9, total: 9 },
      { number: 3, watched: 8, total: 8 },
      { number: 2, watched: 9, total: 9 },
      { number: 1, watched: 8, total: 8 },
    ],
  },
  'peaky blinders': {
    cast: [
      { name: 'Cillian Murphy', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Cillian_Murphy_2014.jpg/800px-Cillian_Murphy_2014.jpg' },
      { name: 'Paul Anderson', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Paul_Anderson_%28actor%29.jpg/800px-Paul_Anderson_%28actor%29.jpg' },
      { name: 'Helen McCrory', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Helen_McCrory_2014.jpg/800px-Helen_McCrory_2014.jpg' },
      { name: 'Sophie Rundle', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Sophie_Rundle_2014.jpg/800px-Sophie_Rundle_2014.jpg' },
      { name: 'Tom Hardy', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tom_Hardy_2014.jpg/800px-Tom_Hardy_2014.jpg' },
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Peaky_Blinders_logo.jpg/800px-Peaky_Blinders_logo.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Peaky_Blinders_Season_1.jpg/800px-Peaky_Blinders_Season_1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Peaky_Blinders_Season_2.jpg/800px-Peaky_Blinders_Season_2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Peaky_Blinders_Season_3.jpg/800px-Peaky_Blinders_Season_3.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Peaky_Blinders_Season_4.jpg/800px-Peaky_Blinders_Season_4.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/oVzVdvGIC7U/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=oVzVdvGIC7U' },
    nextEpisode: { date: 'April 3, 2022', code: 's06e06', name: 'Lock and Key' },
    seasons: [
      { number: 6, watched: 6, total: 6 },
      { number: 5, watched: 6, total: 6 },
      { number: 4, watched: 6, total: 6 },
      { number: 3, watched: 6, total: 6 },
      { number: 2, watched: 6, total: 6 },
      { number: 1, watched: 6, total: 6 },
    ],
  },
  'the mandalorian': {
    cast: [
      { name: 'Pedro Pascal', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Pedro_Pascal_2014.jpg/800px-Pedro_Pascal_2014.jpg' },
      { name: 'Gina Carano', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Gina_Carano_2014.jpg/800px-Gina_Carano_2014.jpg' },
      { name: 'Carl Weathers', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Carl_Weathers_2014.jpg/800px-Carl_Weathers_2014.jpg' },
      { name: 'Katee Sackhoff', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Katee_Sackhoff_2014.jpg/800px-Katee_Sackhoff_2014.jpg' },
      { name: 'Giancarlo Esposito', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Giancarlo_Esposito_2014.jpg/800px-Giancarlo_Esposito_2014.jpg' },
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Mandalorian_logo.jpg/800px-The_Mandalorian_logo.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Mandalorian_Season_1.jpg/800px-The_Mandalorian_Season_1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Mandalorian_Season_2.jpg/800px-The_Mandalorian_Season_2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Mandalorian_Season_3.jpg/800px-The_Mandalorian_Season_3.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/aOC8E8z_ifw/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=aOC8E8z_ifw' },
    nextEpisode: { date: 'March 1, 2023', code: 's03e08', name: 'The Return' },
    seasons: [
      { number: 3, watched: 8, total: 8 },
      { number: 2, watched: 8, total: 8 },
      { number: 1, watched: 8, total: 8 },
    ],
  },
  'the crown': {
    cast: [
      { name: 'Olivia Colman', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Olivia_Colman_2014.jpg/800px-Olivia_Colman_2014.jpg' },
      { name: 'Emma Corrin', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Emma_Corrin_2014.jpg/800px-Emma_Corrin_2014.jpg' },
      { name: 'Josh O\'Connor', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Josh_O%27Connor_2014.jpg/800px-Josh_O%27Connor_2014.jpg' },
      { name: 'Tobias Menzies', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tobias_Menzies_2014.jpg/800px-Tobias_Menzies_2014.jpg' },
      { name: 'Helena Bonham Carter', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Helena_Bonham_Carter_2014.jpg/800px-Helena_Bonham_Carter_2014.jpg' },
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Crown_logo.jpg/800px-The_Crown_logo.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Crown_Season_1.jpg/800px-The_Crown_Season_1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Crown_Season_2.jpg/800px-The_Crown_Season_2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Crown_Season_3.jpg/800px-The_Crown_Season_3.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/JWtnJjn6ng0/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=JWtnJjn6ng0' },
    nextEpisode: { date: 'November 9, 2023', code: 's06e10', name: 'Sleep, Dearie Sleep' },
    seasons: [
      { number: 6, watched: 10, total: 10 },
      { number: 5, watched: 10, total: 10 },
      { number: 4, watched: 10, total: 10 },
      { number: 3, watched: 10, total: 10 },
      { number: 2, watched: 10, total: 10 },
      { number: 1, watched: 10, total: 10 },
    ],
  },
  'dark': {
    cast: [
      { name: 'Louis Hofmann', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064746.jpg' },
      { name: 'Lisa Vicari', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064747.jpg' },
      { name: 'Oliver Masucci', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064748.jpg' },
      { name: 'Jördis Triebel', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064749.jpg' },
      { name: 'Maja Schöne', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064750.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064741.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064742.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064743.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064744.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/rrwycJ08PSA/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=rrwycJ08PSA' },
    nextEpisode: { date: 'June 27, 2020', code: 's03e08', name: 'The Paradise' },
    seasons: [
      { number: 3, watched: 8, total: 8 },
      { number: 2, watched: 8, total: 8 },
      { number: 1, watched: 10, total: 10 },
    ],
  },
  'the boys': {
    cast: [
      { name: 'Karl Urban', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064751.jpg' },
      { name: 'Jack Quaid', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064752.jpg' },
      { name: 'Antony Starr', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064753.jpg' },
      { name: 'Erin Moriarty', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064754.jpg' },
      { name: 'Dominique McElligott', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064755.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064756.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064757.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064758.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064759.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/tcrNsIaQkb4/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=tcrNsIaQkb4' },
    nextEpisode: { date: 'June 13, 2024', code: 's04e08', name: 'Assassination Run' },
    seasons: [
      { number: 4, watched: 8, total: 8 },
      { number: 3, watched: 8, total: 8 },
      { number: 2, watched: 8, total: 8 },
      { number: 1, watched: 8, total: 8 },
    ],
  },
  'better call saul': {
    cast: [
      { name: 'Bob Odenkirk', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064760.jpg' },
      { name: 'Rhea Seehorn', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064761.jpg' },
      { name: 'Jonathan Banks', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064762.jpg' },
      { name: 'Michael Mando', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064763.jpg' },
      { name: 'Patrick Fabian', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064764.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064765.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064766.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064767.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064768.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/9q4qzYrHVmI/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=9q4qzYrHVmI' },
    nextEpisode: { date: 'August 15, 2022', code: 's06e13', name: 'Saul Gone' },
    seasons: [
      { number: 6, watched: 13, total: 13 },
      { number: 5, watched: 10, total: 10 },
      { number: 4, watched: 10, total: 10 },
      { number: 3, watched: 10, total: 10 },
      { number: 2, watched: 10, total: 10 },
      { number: 1, watched: 10, total: 10 },
    ],
  },
  'the witcher': {
    cast: [
      { name: 'Henry Cavill', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064769.jpg' },
      { name: 'Anya Chalotra', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064770.jpg' },
      { name: 'Freya Allan', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064771.jpg' },
      { name: 'Joey Batey', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064772.jpg' },
      { name: 'MyAnna Buring', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064773.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064774.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064775.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064776.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064777.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/ndl1W4ltcmg/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=ndl1W4ltcmg' },
    nextEpisode: { date: 'July 27, 2023', code: 's03e08', name: 'The Cost of Chaos' },
    seasons: [
      { number: 3, watched: 8, total: 8 },
      { number: 2, watched: 8, total: 8 },
      { number: 1, watched: 8, total: 8 },
    ],
  },
  'money heist': {
    cast: [
      { name: 'Úrsula Corberó', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Úrsula_Corberó_2019.jpg' },
      { name: 'Álvaro Morte', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Álvaro_Morte_2019.jpg' },
      { name: 'Itziar Ituño', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Itziar_Ituño_2019.jpg' },
      { name: 'Pedro Alonso', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Pedro_Alonso_2019.jpg' },
      { name: 'Miguel Herrán', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Miguel_Herrán_2019.jpg' },
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/7/7e/Money_Heist_logo.png',
      'https://upload.wikimedia.org/wikipedia/en/7/7e/Money_Heist_S1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/7/7e/Money_Heist_S2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/7/7e/Money_Heist_S3.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/htqXL94Rza4/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=htqXL94Rza4' },
    nextEpisode: { date: 'December 3, 2021', code: 's05e10', name: 'A Family Tradition' },
    seasons: [
      { number: 5, watched: 10, total: 10 },
      { number: 4, watched: 8, total: 8 },
      { number: 3, watched: 8, total: 8 },
      { number: 2, watched: 9, total: 9 },
      { number: 1, watched: 13, total: 13 },
    ],
  },
  'ozark': {
    cast: [
      { name: 'Jason Bateman', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064778.jpg' },
      { name: 'Laura Linney', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064779.jpg' },
      { name: 'Julia Garner', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064780.jpg' },
      { name: 'Sofia Hublitz', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064781.jpg' },
      { name: 'Skylar Gaertner', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064782.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064783.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064784.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064785.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064786.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/5hAXVqrljbs/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=5hAXVqrljbs' },
    nextEpisode: { date: 'April 29, 2022', code: 's04e14', name: 'A Hard Way to Go' },
    seasons: [
      { number: 4, watched: 14, total: 14 },
      { number: 3, watched: 10, total: 10 },
      { number: 2, watched: 10, total: 10 },
      { number: 1, watched: 10, total: 10 },
    ],
  },
  'westworld': {
    cast: [
      { name: 'Evan Rachel Wood', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064787.jpg' },
      { name: 'Thandie Newton', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064788.jpg' },
      { name: 'Jeffrey Wright', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064789.jpg' },
      { name: 'Ed Harris', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064790.jpg' },
      { name: 'Anthony Hopkins', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064791.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064792.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064793.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064794.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064795.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/0zZcBvqxODs/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=0zZcBvqxODs' },
    nextEpisode: { date: 'August 14, 2022', code: 's04e08', name: 'Que Será, Será' },
    seasons: [
      { number: 4, watched: 8, total: 8 },
      { number: 3, watched: 8, total: 8 },
      { number: 2, watched: 10, total: 10 },
      { number: 1, watched: 10, total: 10 },
    ],
  },
  'the office': {
    cast: [
      { name: 'Steve Carell', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064796.jpg' },
      { name: 'Rainn Wilson', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064797.jpg' },
      { name: 'John Krasinski', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064798.jpg' },
      { name: 'Jenna Fischer', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064799.jpg' },
      { name: 'Mindy Kaling', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064800.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064801.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064802.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064803.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064804.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/LHOtME2DL4g/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=LHOtME2DL4g' },
    nextEpisode: { date: 'May 16, 2013', code: 's09e23', name: 'Finale' },
    seasons: [
      { number: 9, watched: 25, total: 25 },
      { number: 8, watched: 24, total: 24 },
      { number: 7, watched: 26, total: 26 },
      { number: 6, watched: 26, total: 26 },
      { number: 5, watched: 28, total: 28 },
      { number: 4, watched: 19, total: 19 },
      { number: 3, watched: 25, total: 25 },
      { number: 2, watched: 22, total: 22 },
      { number: 1, watched: 6, total: 6 },
    ],
  },
  'succession': {
    cast: [
      { name: 'Brian Cox', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064805.jpg' },
      { name: 'Jeremy Strong', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064806.jpg' },
      { name: 'Sarah Snook', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064807.jpg' },
      { name: 'Kieran Culkin', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064808.jpg' },
      { name: 'Matthew Macfadyen', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064809.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064810.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064811.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064812.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064813.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/OTdcmJPTzVY/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=OTdcmJPTzVY' },
    nextEpisode: { date: 'May 28, 2023', code: 's04e10', name: 'With Open Eyes' },
    seasons: [
      { number: 4, watched: 10, total: 10 },
      { number: 3, watched: 9, total: 9 },
      { number: 2, watched: 10, total: 10 },
      { number: 1, watched: 10, total: 10 },
    ],
  },
  'la casa de papel': {
    cast: [
      { name: 'Úrsula Corberó', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/%C3%9Arsula_Corber%C3%B3-65339.jpg/800px-%C3%9Arsula_Corber%C3%B3-65339.jpg' },
      { name: 'Álvaro Morte', image: 'https://media.a24.com/p/40fc4e3e3bdb1e612a948278ab94f300/adjuntos/296/imagenes/008/732/0008732336/netflix-profesorpng.png' },
      { name: 'Itziar Ituño', image: 'https://img.asmedia.epimg.net/resizer/v2/IKCM3JOR7JJYDOMDH2WJXVMPV4.jpg?auth=5bb00179609f85520bced8f1769477073fd230a5cf7009b2bce9adc66598e28b&width=1200&height=675&smart=true' },
      { name: 'Pedro Alonso', image: 'https://assets.dev-filo.dift.io/img/2021/12/02/berlin_sq.jpg' },
      { name: 'Miguel Herrán', image: 'https://okdiario.com/img/2021/04/26/miguel-herran-655x368.jpg' },
    ],
    images: [
      'https://okdiario.com/img/2021/04/26/miguel-herran-655x368.jpg',
      'https://cdn.culturagenial.com/es/imagenes/casa-papel-maqueta-fabrica-cke.jpg?class=article',
      'https://cdn.culturagenial.com/es/imagenes/quinta-parte-volumen-dos-cke.jpg?class=article',
      'https://cdn.culturagenial.com/es/imagenes/la-casa-papel-personajes-cke.jpg?class=article',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/htqXL94Rza4/maxresdefault.jpg', url: 'https://youtu.be/a--TYEwTMUY' },
    nextEpisode: { date: 'December 3, 2021', code: 's05e10', name: 'A Family Tradition' },
    seasons: [
      { number: 5, watched: 10, total: 10 },
      { number: 4, watched: 8, total: 8 },
      { number: 3, watched: 8, total: 8 },
      { number: 2, watched: 9, total: 9 },
      { number: 1, watched: 13, total: 13 },
          ],
  },
  'atlanta': {
    cast: [
      { name: 'Donald Glover', image: 'https://ew.com/thmb/En-VOPAwwU4fZg61g40dWCaL7C8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/atl_pilot_0721_114d-2cd61e73fbb2404e8d66914cbdd9fa70.jpg' },
      { name: 'Brian Tyree Henry', image: 'https://static-www.adweek.com/wp-content/uploads/files/news_article/head_5.jpg' },
      { name: 'LaKeith Stanfield', image: 'https://assets.fxnetworks.com/cms-next/production/6a3b37da-be2f-4f4e-a3ed-01390ee5e7bb.jpg?imwidth=605' },
      { name: 'Zazie Beetz', image: 'https://ew.com/thmb/hYdq1u0EskBh9q-rvZQXSHynACE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/atlanta-c7985f38516b4915ba4884a3ee73c41e.jpg' },
    ],
    images: [
      'https://m.media-amazon.com/images/M/MV5BOGVlMWNkNGItNWRhZC00MDdmLWFmMjItODgwMzM4ZGIxYTUyXkEyXkFqcGc@._V1_QL75_UX492_.jpg',
      'https://ew.com/thmb/Ru5Kdv_pRfDTSVvQ18di88fhuGQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/zazie-beetz-55b0f7485fba4f6a9ce4bd8e3a636c90.jpg',
      'https://m.media-amazon.com/images/M/MV5BMjExNjYwMTQtNmI2Yy00MzhkLWFiOTMtNjMyN2RlMmNmMmNlXkEyXkFqcGc@._V1_QL75_UX492_.jpg',
      'https://pics.filmaffinity.com/atlanta-656738701-large.jpg',
      'https://pics.filmaffinity.com/atlanta-829338266-large.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/Phc8U8uM1Yc/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=Phc8U8uM1Yc' },
    nextEpisode: { date: 'November 10, 2022', code: 's04e10', name: 'It Was All a Dream' },
    seasons: [
      { number: 4, watched: 10, total: 10 },
      { number: 3, watched: 10, total: 10 },
      { number: 2, watched: 11, total: 11 },
      { number: 1, watched: 10, total: 10 },
    ],
  },
  'the good place': {
    cast: [
      { name: 'Kristen Bell', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064814.jpg' },
      { name: 'William Jackson Harper', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064815.jpg' },
      { name: 'Jameela Jamil', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064816.jpg' },
      { name: 'Manny Jacinto', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064817.jpg' },
      { name: 'Ted Danson', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064818.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064819.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064820.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064821.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064822.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064823.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/RfBgT5djaQw/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=RfBgT5djaQw' },
    nextEpisode: { date: 'January 30, 2020', code: 's04e13', name: 'Whenever You\'re Ready' },
    seasons: [
      { number: 4, watched: 13, total: 13 },
      { number: 3, watched: 13, total: 13 },
      { number: 2, watched: 13, total: 13 },
      { number: 1, watched: 13, total: 13 },
    ],
  },
  'severance': {
    cast: [
      { name: 'Adam Scott', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064824.jpg' },
      { name: 'Britt Lower', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064825.jpg' },
      { name: 'Patricia Arquette', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064826.jpg' },
      { name: 'John Turturro', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064827.jpg' },
      { name: 'Christopher Walken', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064828.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064829.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064830.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064831.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064832.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/xEQP4VVuyrY/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=xEQP4VVuyrY' },
    nextEpisode: { date: 'TBA', code: 's02e01', name: 'TBA' },
    seasons: [
      { number: 2, watched: 0, total: 10 },
      { number: 1, watched: 9, total: 9 },
    ],
  },
  'ted lasso': {
    cast: [
      { name: 'Jason Sudeikis', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064833.jpg' },
      { name: 'Hannah Waddingham', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064834.jpg' },
      { name: 'Brett Goldstein', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064835.jpg' },
      { name: 'Brendan Hunt', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064836.jpg' },
      { name: 'Nick Mohammed', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064837.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064838.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064839.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064840.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064841.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/3u7EIiohs6U/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=3u7EIiohs6U' },
    nextEpisode: { date: 'May 31, 2023', code: 's03e12', name: 'So Long, Farewell' },
    seasons: [
      { number: 3, watched: 12, total: 12 },
      { number: 2, watched: 12, total: 12 },
      { number: 1, watched: 10, total: 10 },
    ],
  },
  'fleabag': {
    cast: [
      { name: 'Phoebe Waller-Bridge', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064842.jpg' },
      { name: 'Sian Clifford', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064843.jpg' },
      { name: 'Andrew Scott', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064844.jpg' },
      { name: 'Olivia Colman', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064845.jpg' },
      { name: 'Bill Paterson', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064846.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064847.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064848.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064849.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/aXWG-kKD7aA/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=aXWG-kKD7aA' },
    nextEpisode: { date: 'April 8, 2019', code: 's02e06', name: 'Episode 6' },
    seasons: [
      { number: 2, watched: 6, total: 6 },
      { number: 1, watched: 6, total: 6 },
    ],
  },
  'the marvelous mrs. maisel': {
    cast: [
      { name: 'Rachel Brosnahan', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064850.jpg' },
      { name: 'Alex Borstein', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064851.jpg' },
      { name: 'Michael Zegen', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064852.jpg' },
      { name: 'Marin Hinkle', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064853.jpg' },
      { name: 'Tony Shalhoub', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064854.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064855.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064856.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064857.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064858.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064859.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/1nCqRmx3Dnw/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=1nCqRmx3Dnw' },
    nextEpisode: { date: 'May 26, 2023', code: 's05e09', name: 'Four Minutes' },
    seasons: [
      { number: 5, watched: 9, total: 9 },
      { number: 4, watched: 8, total: 8 },
      { number: 3, watched: 8, total: 8 },
      { number: 2, watched: 10, total: 10 },
      { number: 1, watched: 8, total: 8 },
    ],
  },
  'chernobyl': {
    cast: [
      { name: 'Jared Harris', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064860.jpg' },
      { name: 'Stellan Skarsgård', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064861.jpg' },
      { name: 'Emily Watson', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064862.jpg' },
      { name: 'Paul Ritter', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064863.jpg' },
      { name: 'Jessie Buckley', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064864.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064865.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064866.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/s9APLXM9Ei8/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=s9APLXM9Ei8' },
    nextEpisode: { date: 'June 3, 2019', code: 's01e05', name: 'Vichnaya Pamyat' },
    seasons: [
      { number: 1, watched: 5, total: 5 },
    ],
  },
  'mindhunter': {
    cast: [
      { name: 'Jonathan Groff', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064867.jpg' },
      { name: 'Holt McCallany', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064868.jpg' },
      { name: 'Anna Torv', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064869.jpg' },
      { name: 'Cameron Britton', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064870.jpg' },
      { name: 'Hannah Gross', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064871.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064872.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064873.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064874.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/evd3Jc5TGlI/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=evd3Jc5TGlI' },
    nextEpisode: { date: 'August 16, 2019', code: 's02e09', name: 'Episode 9' },
    seasons: [
      { number: 2, watched: 9, total: 9 },
      { number: 1, watched: 10, total: 10 },
    ],
  },
  'the expanse': {
    cast: [
      { name: 'Steven Strait', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064875.jpg' },
      { name: 'Shohreh Aghdashloo', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064876.jpg' },
      { name: 'Dominique Tipper', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064877.jpg' },
      { name: 'Wes Chatham', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064878.jpg' },
      { name: 'Cara Gee', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064879.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064880.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064881.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064882.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064883.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064884.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064885.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064886.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/kQuTAPWJxNo/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=kQuTAPWJxNo' },
    nextEpisode: { date: 'January 14, 2022', code: 's06e06', name: 'Babylon\'s Ashes' },
    seasons: [
      { number: 6, watched: 6, total: 6 },
      { number: 5, watched: 10, total: 10 },
      { number: 4, watched: 10, total: 10 },
      { number: 3, watched: 13, total: 13 },
      { number: 2, watched: 13, total: 13 },
      { number: 1, watched: 10, total: 10 },
    ],
  },
  'barry': {
    cast: [
      { name: 'Bill Hader', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064887.jpg' },
      { name: 'Stephen Root', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064888.jpg' },
      { name: 'Sarah Goldberg', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064889.jpg' },
      { name: 'Glenn Fleshler', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064890.jpg' },
      { name: 'Anthony Carrigan', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064891.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064892.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064893.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064894.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064895.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064896.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/VeW1VObNL10/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=VeW1VObNL10' },
    nextEpisode: { date: 'May 28, 2023', code: 's04e08', name: 'Wow' },
    seasons: [
      { number: 4, watched: 8, total: 8 },
      { number: 3, watched: 8, total: 8 },
      { number: 2, watched: 8, total: 8 },
      { number: 1, watched: 8, total: 8 },
    ],
  },
  'the leftovers': {
    cast: [
      { name: 'Justin Theroux', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064897.jpg' },
      { name: 'Carrie Coon', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064898.jpg' },
      { name: 'Amy Brenneman', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064899.jpg' },
      { name: 'Christopher Eccleston', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064900.jpg' },
      { name: 'Ann Dowd', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/425/1064901.jpg' },
    ],
    images: [
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064902.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064903.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064904.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/425/1064905.jpg',
    ],
    trailer: { image: 'https://i.ytimg.com/vi/0zZcBvqxODs/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=0zZcBvqxODs' },
    nextEpisode: { date: 'June 4, 2017', code: 's03e08', name: 'The Book of Nora' },
    seasons: [
      { number: 3, watched: 8, total: 8 },
      { number: 2, watched: 10, total: 10 },
      { number: 1, watched: 10, total: 10 },
    ],
  },
  // ... Puedes agregar más series aquí siguiendo el mismo formato ...
}

const customData = computed(() => {
  const key = showTitle.value.toLowerCase()
  return seriesWatchData[key] || null
})

// --- NUEVO: Progreso real de episodios vistos por temporada ---
function getSeasonWatchedCount(seasonNumber: number): number {
  const storageKey = `episodes_${showId}_season_${seasonNumber}`
  try {
    const watchedEpisodes = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(watchedEpisodes) ? watchedEpisodes.length : 0
  } catch {
    return 0
  }
}

function isSeasonFullyWatched(season: any): boolean {
  return getSeasonWatchedCount(season.number) === season.total
}

function toggleSeasonWatched(season: any) {
  const storageKey = `episodes_${showId}_season_${season.number}`
  if (isSeasonFullyWatched(season)) {
    // Desmarcar todos los episodios
    localStorage.setItem(storageKey, JSON.stringify([]))
    // Actualizar lastWatched a la temporada actual, episodio 1 (o 0)
    saveLastWatched(season.number, 1)
  } else {
    // Marcar todos los episodios
    const all = Array.from({ length: season.total }, (_, i) => i + 1)
    localStorage.setItem(storageKey, JSON.stringify(all))
    // Actualizar lastWatched a la temporada actual, último episodio
    saveLastWatched(season.number, season.total)
  }
  // Forzar actualización reactiva
  updateSeasonsProgress()
}

function saveLastWatched(season: number, episode: number) {
  const key = `lastWatched_${showId}`
  const data = { season, episode, timestamp: Date.now() }
  localStorage.setItem(key, JSON.stringify(data))
}

function updateSeasonsProgress() {
  if (!seasons.value) return
  seasons.value = seasons.value.map((season: any) => ({
    ...season,
    watched: getSeasonWatchedCount(season.number)
  }))
}

// Actualizar progreso al montar y cuando cambie showId
onMounted(() => {
  fetchData()
  watch(
    () => showId,
    () => {
      fetchData()
      updateSeasonsProgress()
    }
  )
  updateSeasonsProgress()
})

async function fetchData() {
  isLoading.value = true
  console.log('Show title:', showTitle.value)
  console.log('Custom data key:', showTitle.value.toLowerCase())
  console.log('Custom data found:', customData.value)

  if (customData.value) {
    cast.value = customData.value.cast
    images.value = customData.value.images
    trailers.value = [customData.value.trailer]
    nextEpisode.value = customData.value.nextEpisode
    seasons.value = customData.value.seasons

    console.log('Loaded cast:', cast.value)
    console.log('Loaded images:', images.value)
  } else {
    // Intentar cargar datos reales de la API
    await loadRealWatchData()
    
    // Si no se pudieron cargar datos reales, usar datos genéricos
    if (cast.value.length === 0) {
      cast.value = [
        { name: 'Actor 1', image: '/placeholder-poster.jpg' },
        { name: 'Actor 2', image: '/placeholder-poster.jpg' },
        { name: 'Actor 3', image: '/placeholder-poster.jpg' },
        { name: 'Actor 4', image: '/placeholder-poster.jpg' },
      ]
    }
    
    if (images.value.length === 0) {
      images.value = ['/placeholder-poster.jpg']
    }
    
    if (trailers.value.length === 0) {
      trailers.value = [{ image: '/placeholder-poster.jpg', url: '#' }]
    }
    
    if (!nextEpisode.value || !nextEpisode.value.date) {
      nextEpisode.value = { date: 'TBA', code: 'TBA', name: 'TBA' }
    }
    
    if (seasons.value.length === 0) {
      seasons.value = [{ number: 1, watched: 0, total: 10 }]
    }
  }
  isLoading.value = false
}

function navigateToSeason(seasonNumber: number) {
  router.push(`/show/${showId}/season/${seasonNumber}`)
}
</script>

<template>
  <div class="watch-view-container">
    <div class="watch-view">
      <button class="back-btn" @click="router.back()" title="Regresar">
        <ion-icon name="arrow-back-outline"></ion-icon>
      </button>
      <div v-if="isLoading" class="loading">Cargando...</div>
      <template v-else>
        <section class="section">
          <h3>Cast</h3>
          <div class="cast-list">
            <div v-for="actor in cast" :key="actor.id" class="cast-item">
              <img :src="actor.image" :alt="actor.name" class="cast-img" />
              <div class="cast-name">{{ actor.name }}</div>
            </div>
          </div>
        </section>
        <section class="section">
          <h3>Trailers</h3>
          <div class="trailers-list">
            <div v-for="trailer in trailers" :key="trailer.url" class="trailer-item">
              <img :src="trailer.image" class="trailer-img" />
              <div class="trailer-play"><ion-icon name="play-circle" /></div>
            </div>
          </div>
        </section>
        <section class="section">
          <h3>Images</h3>
          <div class="images-list">
            <img v-for="img in images" :key="img" :src="img" class="image-item" />
          </div>
        </section>
        <section class="section">
          <template v-if="show && show.mediaType !== 'movie'">
            <h3>Next Episode</h3>
            <div class="next-episode">
              <div class="next-episode-date">
                <ion-icon name="calendar-outline" />
                <span>{{ nextEpisode.date }}</span>
              </div>
              <div class="next-episode-info">
                {{ nextEpisode.code }}, {{ nextEpisode.name }}
              </div>
            </div>
          </template>
        </section>
        <section class="section">
          <template v-if="show && show.mediaType !== 'movie'">
            <h3>Seasons</h3>
            <div class="seasons-list">
              <div
                v-for="season in seasons"
                :key="season.number"
                class="season-item"
                @click="navigateToSeason(season.number)"
              >
                <input type="checkbox"
                  :checked="isSeasonFullyWatched(season)"
                  @click.stop="toggleSeasonWatched(season)"
                  @change.prevent
                />
                <span>Season {{ season.number }}</span>
                <div class="season-progress">
                  <div class="season-bar" :style="{ width: (getSeasonWatchedCount(season.number)/season.total*100)+'%' }"></div>
                </div>
                <span>{{ getSeasonWatchedCount(season.number) }}/{{ season.total }}</span>
                <ion-icon name="chevron-forward-outline" />
              </div>
            </div>
          </template>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.watch-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 32px 16px 16px 16px;
  box-sizing: border-box;
  width: 100%;
}

.watch-view {
  background: #181a20;
  color: #fff;
  padding: 1.5rem 1rem;
  border-radius: 16px;
  max-width: 420px;
  margin: 2rem auto;
  position: relative;
  padding-top: 44px;
  width: 100%;
}

@media (min-width: 900px) {
  .watch-view {
    max-width: 700px;
    padding: 2.5rem 2.5rem 2.5rem 2.5rem;
  }
  .watch-view-container {
    padding: 48px 0;
  }
}

/* Botón de regreso circular */
.back-btn {
  position: absolute;
  top: 4px;
  left: 18px;
  background: rgba(30,30,30,0.45);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s;
}
.back-btn:hover {
  background: rgba(30,30,30,0.7);
}
.back-btn ion-icon {
  color: #fff;
  font-size: 24px;
}
.section {
  margin-bottom: 2rem;
}
.cast-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}
.cast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
}
.cast-img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 4px;
}
.cast-name {
  font-size: 0.85rem;
  text-align: center;
}
.trailers-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}
.trailer-item {
  position: relative;
  min-width: 180px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
}
.trailer-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.trailer-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  color: #6c7ae0;
  pointer-events: none;
}
.images-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}
.image-item {
  width: 90px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}
.next-episode {
  background: #23243a;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.next-episode-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c7ae0;
  font-weight: 500;
}
.next-episode-info {
  color: #fff;
  font-size: 0.95rem;
}
.seasons-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.season-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #23243a;
  border-radius: 8px;
  padding: 0.5rem 0.7rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.season-item:hover {
  background: #2a2d35;
}
.season-progress {
  flex: 1;
  height: 6px;
  background: #333;
  border-radius: 4px;
  margin: 0 8px;
  overflow: hidden;
}
.season-bar {
  height: 100%;
  background: #6c7ae0;
  border-radius: 4px;
}
.loading {
  text-align: center;
  padding: 2rem;
  color: #aaa;
}
</style>

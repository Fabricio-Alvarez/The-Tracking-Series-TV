<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getSeriesPeopleMock, getSeriesImagesMock } from '@/services/tvdbService'
import { useShowsStore } from '@/stores/shows'

const route = useRoute()
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
      { name: 'Louis Hofmann', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Louis_Hofmann_2014.jpg/800px-Louis_Hofmann_2014.jpg' },
      { name: 'Lisa Vicari', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Lisa_Vicari_2014.jpg/800px-Lisa_Vicari_2014.jpg' },
      { name: 'Oliver Masucci', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Oliver_Masucci_2014.jpg/800px-Oliver_Masucci_2014.jpg' },
      { name: 'Jördis Triebel', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/J%C3%B6rdis_Triebel_2014.jpg/800px-J%C3%B6rdis_Triebel_2014.jpg' },
      { name: 'Maja Schöne', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Maja_Sch%C3%B6ne_2014.jpg/800px-Maja_Sch%C3%B6ne_2014.jpg' },
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_logo.jpg/800px-Dark_logo.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_Season_1.jpg/800px-Dark_Season_1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_Season_2.jpg/800px-Dark_Season_2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_Season_3.jpg/800px-Dark_Season_3.jpg',
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
      { name: 'Karl Urban', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Karl_Urban_2014.jpg/800px-Karl_Urban_2014.jpg' },
      { name: 'Jack Quaid', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Jack_Quaid_2014.jpg/800px-Jack_Quaid_2014.jpg' },
      { name: 'Antony Starr', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Antony_Starr_2014.jpg/800px-Antony_Starr_2014.jpg' },
      { name: 'Erin Moriarty', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Erin_Moriarty_2014.jpg/800px-Erin_Moriarty_2014.jpg' },
      { name: 'Dominique McElligott', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Dominique_McElligott_2014.jpg/800px-Dominique_McElligott_2014.jpg' },
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Boys_logo.jpg/800px-The_Boys_logo.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Boys_Season_1.jpg/800px-The_Boys_Season_1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Boys_Season_2.jpg/800px-The_Boys_Season_2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Boys_Season_3.jpg/800px-The_Boys_Season_3.jpg',
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
      { name: 'Bob Odenkirk', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bob_Odenkirk_2014.jpg/800px-Bob_Odenkirk_2014.jpg' },
      { name: 'Rhea Seehorn', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Rhea_Seehorn_2014.jpg/800px-Rhea_Seehorn_2014.jpg' },
      { name: 'Jonathan Banks', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Jonathan_Banks_2014.jpg/800px-Jonathan_Banks_2014.jpg' },
      { name: 'Michael Mando', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Michael_Mando_2014.jpg/800px-Michael_Mando_2014.jpg' },
      { name: 'Patrick Fabian', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Patrick_Fabian_2014.jpg/800px-Patrick_Fabian_2014.jpg' },
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Better_Call_Saul_logo.jpg/800px-Better_Call_Saul_logo.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Better_Call_Saul_Season_1.jpg/800px-Better_Call_Saul_Season_1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Better_Call_Saul_Season_2.jpg/800px-Better_Call_Saul_Season_2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Better_Call_Saul_Season_3.jpg/800px-Better_Call_Saul_Season_3.jpg',
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
      { name: 'Henry Cavill', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Henry_Cavill_2014.jpg/800px-Henry_Cavill_2014.jpg' },
      { name: 'Anya Chalotra', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Anya_Chalotra_2014.jpg/800px-Anya_Chalotra_2014.jpg' },
      { name: 'Freya Allan', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Freya_Allan_2014.jpg/800px-Freya_Allan_2014.jpg' },
      { name: 'Joey Batey', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Joey_Batey_2014.jpg/800px-Joey_Batey_2014.jpg' },
      { name: 'MyAnna Buring', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/MyAnna_Buring_2014.jpg/800px-MyAnna_Buring_2014.jpg' },
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Witcher_logo.jpg/800px-The_Witcher_logo.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Witcher_Season_1.jpg/800px-The_Witcher_Season_1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Witcher_Season_2.jpg/800px-The_Witcher_Season_2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/The_Witcher_Season_3.jpg/800px-The_Witcher_Season_3.jpg',
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
      { name: 'Jason Bateman', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Jason_Bateman_2014.jpg/800px-Jason_Bateman_2014.jpg' },
      { name: 'Laura Linney', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Laura_Linney_2014.jpg/800px-Laura_Linney_2014.jpg' },
      { name: 'Julia Garner', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Julia_Garner_2014.jpg/800px-Julia_Garner_2014.jpg' },
      { name: 'Sofia Hublitz', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Sofia_Hublitz_2014.jpg/800px-Sofia_Hublitz_2014.jpg' },
      { name: 'Skylar Gaertner', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Skylar_Gaertner_2014.jpg/800px-Skylar_Gaertner_2014.jpg' },
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Ozark_logo.jpg/800px-Ozark_logo.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Ozark_Season_1.jpg/800px-Ozark_Season_1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Ozark_Season_2.jpg/800px-Ozark_Season_2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Ozark_Season_3.jpg/800px-Ozark_Season_3.jpg',
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
      { name: 'Evan Rachel Wood', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Evan_Rachel_Wood_2014.jpg/800px-Evan_Rachel_Wood_2014.jpg' },
      { name: 'Thandie Newton', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Thandie_Newton_2014.jpg/800px-Thandie_Newton_2014.jpg' },
      { name: 'Jeffrey Wright', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Jeffrey_Wright_2014.jpg/800px-Jeffrey_Wright_2014.jpg' },
      { name: 'Ed Harris', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Ed_Harris_2014.jpg/800px-Ed_Harris_2014.jpg' },
      { name: 'Anthony Hopkins', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Anthony_Hopkins_2014.jpg/800px-Anthony_Hopkins_2014.jpg' },
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Westworld_logo.jpg/800px-Westworld_logo.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Westworld_Season_1.jpg/800px-Westworld_Season_1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Westworld_Season_2.jpg/800px-Westworld_Season_2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Westworld_Season_3.jpg/800px-Westworld_Season_3.jpg',
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
      { name: 'Steve Carell', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Steve_Carell_2019.jpg' },
      { name: 'Rainn Wilson', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Rainn_Wilson_2019.jpg' },
      { name: 'John Krasinski', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/John_Krasinski_2019.jpg' },
      { name: 'Jenna Fischer', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Jenna_Fischer_2019.jpg' },
      { name: 'Mindy Kaling', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Mindy_Kaling_2019.jpg' },
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/7/7e/The_Office_US_logo.png',
      'https://upload.wikimedia.org/wikipedia/en/7/7e/The_Office_US_S1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/7/7e/The_Office_US_S2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/7/7e/The_Office_US_S3.jpg',
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
      { name: 'Brian Cox', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Brian_Cox_2014.jpg/800px-Brian_Cox_2014.jpg' },
      { name: 'Jeremy Strong', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Jeremy_Strong_2014.jpg/800px-Jeremy_Strong_2014.jpg' },
      { name: 'Sarah Snook', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Sarah_Snook_2014.jpg/800px-Sarah_Snook_2014.jpg' },
      { name: 'Kieran Culkin', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Kieran_Culkin_2014.jpg/800px-Kieran_Culkin_2014.jpg' },
      { name: 'Matthew Macfadyen', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Matthew_Macfadyen_2014.jpg/800px-Matthew_Macfadyen_2014.jpg' },
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Succession_logo.jpg/800px-Succession_logo.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Succession_Season_1.jpg/800px-Succession_Season_1.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Succession_Season_2.jpg/800px-Succession_Season_2.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Succession_Season_3.jpg/800px-Succession_Season_3.jpg',
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
  'the office (us)': {
    cast: [
      { name: 'Steve Carell', image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/2024/10/steve-carell-as-michael-scott-in-the-office.jpg?q=70&fit=crop&w=1140&h=&dpr=1' },
      { name: 'Rainn Wilson', image: 'https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize,to_auto,s_webp:avif/www.cinemascomics.com/wp-content/uploads/2023/07/Rainn-Wilson-como-Dwight-Schrute-en-The-Office.jpg' },
      { name: 'John Krasinski', image: 'https://www.media.hw-static.com/media/2015/12/john-krasinski-the-office-nbc-111815.jpg' },
      { name: 'Jenna Fischer', image: 'https://ew.com/thmb/6BHl9ETAq9JkPMLFmRm-DU-RYMo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/jenna-fischer-the-office-072424-e23a997947d9405e85c2e59f6319e0b4.jpg' },
      { name: 'Mindy Kaling', image: 'https://www.nbc.com/sites/nbcblog/files/styles/hero_image__large__computer__alt_1_5x/public/2022/08/mindy-kaling-interview2.jpg' },
    ],
    images: [
      'https://forbes.es/wp-content/uploads/2017/05/20155818449_1.jpg',
      'https://fotografias.antena3.com/clipping/cmsimages01/2022/01/26/947E65EF-299D-4E06-8EF4-86F0A13196B4/97.jpg?crop=1228,691,x7,y0&width=1600&height=900&optimize=high&format=webply',
      'https://www.sopitas.com/wp-content/uploads/2024/10/escenas-eliminadas-serie-the-office.jpg',
      'https://www.sopitas.com/wp-content/uploads/2024/04/the-office-nueva-serie-greg-daniel-cast-detalles.jpeg?resize=1024,569',
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
  // ... Puedes agregar más series aquí siguiendo el mismo formato ...
}

const customData = computed(() => {
  const key = showTitle.value.toLowerCase()
  return seriesWatchData[key] || null
})

onMounted(fetchData)

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
    // Mock genérico si no hay datos personalizados
    cast.value = [
      { name: 'Actor 1', image: '/placeholder-poster.jpg' },
      { name: 'Actor 2', image: '/placeholder-poster.jpg' },
      { name: 'Actor 3', image: '/placeholder-poster.jpg' },
      { name: 'Actor 4', image: '/placeholder-poster.jpg' },
    ]
    images.value = ['/placeholder-poster.jpg']
    trailers.value = [{ image: '/placeholder-poster.jpg', url: '#' }]
    nextEpisode.value = { date: '', code: '', name: '' }
    seasons.value = [{ number: 1, watched: 0, total: 10 }]
  }
  isLoading.value = false
}
</script>

<template>
  <div class="watch-view">
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
      </section>
      <section class="section">
        <h3>Seasons</h3>
        <div class="seasons-list">
          <div v-for="season in seasons" :key="season.number" class="season-item">
            <input type="checkbox" :checked="season.watched === season.total" disabled />
            <span>Season {{ season.number }}</span>
            <div class="season-progress">
              <div class="season-bar" :style="{ width: (season.watched/season.total*100)+'%' }"></div>
            </div>
            <span>{{ season.watched }}/{{ season.total }}</span>
            <ion-icon name="chevron-forward-outline" />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.watch-view {
  background: #181a20;
  color: #fff;
  padding: 1.5rem 1rem;
  border-radius: 16px;
  max-width: 420px;
  margin: 2rem auto;
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

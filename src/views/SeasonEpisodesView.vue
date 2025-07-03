<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShowsStore } from '@/stores/shows'
import { RealDataService } from '@/services/tvdbService'

const route = useRoute()
const router = useRouter()
const showId = String(route.params.id)
const seasonNumber = Number(route.params.season)

const showsStore = useShowsStore()
const show = computed(() => showsStore.getShowById(showId))
const showTitle = computed(() => show.value?.title || '')

const episodes = ref<any[]>([])
const isLoading = ref(true)


const seasonProgress = computed(() => {
  if (episodes.value.length === 0) return 0
  const watchedCount = episodes.value.filter(ep => ep.watched).length
  return Math.round((watchedCount / episodes.value.length) * 100)
})


const peakyBlindersEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Episode 1", description: "Thomas Shelby returns from World War I with a plan to expand his family's criminal empire.", watched: false, airDate: "September 12, 2013" },
    { id: 2, name: "Episode 2", description: "The Peaky Blinders face competition from a rival gang while dealing with police pressure.", watched: false, airDate: "September 19, 2013" },
    { id: 3, name: "Episode 3", description: "Thomas makes a dangerous deal with the government while family tensions rise.", watched: false, airDate: "September 26, 2013" },
    { id: 4, name: "Episode 4", description: "The Shelby family faces betrayal from within while planning their next move.", watched: false, airDate: "October 3, 2013" },
    { id: 5, name: "Episode 5", description: "Thomas confronts his enemies while the family prepares for a major operation.", watched: false, airDate: "October 10, 2013" },
    { id: 6, name: "Episode 6", description: "The season finale brings the family's conflicts to a dramatic conclusion.", watched: false, airDate: "October 17, 2013" }
  ],
  2: [
    { id: 1, name: "Episode 1", description: "The Shelby family expands their operations to London while facing new threats.", watched: false, airDate: "October 2, 2014" },
    { id: 2, name: "Episode 2", description: "Thomas navigates the London criminal underworld while dealing with family issues.", watched: false, airDate: "October 9, 2014" },
    { id: 3, name: "Episode 3", description: "The family faces a major setback while Thomas plans his next move.", watched: false, airDate: "October 16, 2014" },
    { id: 4, name: "Episode 4", description: "Thomas makes a dangerous alliance while the family deals with internal conflicts.", watched: false, airDate: "October 23, 2014" },
    { id: 5, name: "Episode 5", description: "The tension builds as Thomas prepares for a final confrontation.", watched: false, airDate: "October 30, 2014" },
    { id: 6, name: "Episode 6", description: "The season finale brings dramatic consequences for the Shelby family.", watched: false, airDate: "November 6, 2014" }
  ],
  3: [
    { id: 1, name: "Episode 1", description: "The Shelby family faces new challenges as they expand their empire internationally.", watched: false, airDate: "May 5, 2016" },
    { id: 2, name: "Episode 2", description: "Thomas deals with Russian business partners while family tensions escalate.", watched: false, airDate: "May 12, 2016" },
    { id: 3, name: "Episode 3", description: "The family faces betrayal and must adapt to changing circumstances.", watched: false, airDate: "May 19, 2016" },
    { id: 4, name: "Episode 4", description: "Thomas makes difficult choices while the family's future hangs in the balance.", watched: false, airDate: "May 26, 2016" },
    { id: 5, name: "Episode 5", description: "The season builds to a dramatic climax as secrets are revealed.", watched: false, airDate: "June 2, 2016" },
    { id: 6, name: "Episode 6", description: "The season finale brings shocking revelations and consequences.", watched: false, airDate: "June 9, 2016" }
  ],
  4: [
    { id: 1, name: "Episode 1", description: "The Shelby family faces their greatest threat yet as they fight for survival.", watched: false, airDate: "November 15, 2017" },
    { id: 2, name: "Episode 2", description: "Thomas must use all his cunning to protect his family and business.", watched: false, airDate: "November 22, 2017" },
    { id: 3, name: "Episode 3", description: "The family rallies together while facing overwhelming odds.", watched: false, airDate: "November 29, 2017" },
    { id: 4, name: "Episode 4", description: "Thomas makes a desperate gamble to save everything he's built.", watched: false, airDate: "December 6, 2017" },
    { id: 5, name: "Episode 5", description: "The tension reaches its peak as the family prepares for the final battle.", watched: false, airDate: "December 13, 2017" },
    { id: 6, name: "Episode 6", description: "The season finale brings the family's struggle to a dramatic conclusion.", watched: false, airDate: "December 20, 2017" }
  ],
  5: [
    { id: 1, name: "Episode 1", description: "Thomas Shelby enters politics while dealing with new threats to his empire.", watched: false, airDate: "August 25, 2019" },
    { id: 2, name: "Episode 2", description: "Thomas navigates the political world while family tensions continue to rise.", watched: false, airDate: "September 1, 2019" },
    { id: 3, name: "Episode 3", description: "The family faces new challenges as Thomas's political ambitions grow.", watched: false, airDate: "September 8, 2019" },
    { id: 4, name: "Episode 4", description: "Thomas makes dangerous alliances while trying to maintain control.", watched: false, airDate: "September 15, 2019" },
    { id: 5, name: "Episode 5", description: "The season builds to a dramatic climax as Thomas faces his greatest challenge.", watched: false, airDate: "September 22, 2019" },
    { id: 6, name: "Episode 6", description: "The season finale brings shocking developments that change everything.", watched: false, airDate: "September 29, 2019" }
  ],
  6: [
    { id: 1, name: "Episode 1", description: "Thomas Shelby faces the consequences of his actions while planning his next move.", watched: false, airDate: "February 27, 2022" },
    { id: 2, name: "Episode 2", description: "The family deals with new threats while Thomas tries to protect his legacy.", watched: false, airDate: "March 6, 2022" },
    { id: 3, name: "Episode 3", description: "Thomas makes difficult choices as the family's future hangs in the balance.", watched: false, airDate: "March 13, 2022" },
    { id: 4, name: "Episode 4", description: "The tension builds as secrets are revealed and alliances shift.", watched: false, airDate: "March 20, 2022" },
    { id: 5, name: "Episode 5", description: "Thomas faces his greatest challenge yet as the series builds to its conclusion.", watched: false, airDate: "March 27, 2022" },
    { id: 6, name: "Episode 6", description: "The series finale brings Thomas Shelby's story to a dramatic conclusion.", watched: false, airDate: "April 3, 2022" }
  ]
}


const wednesdayEpisodes: Record<number, any[]> = {
  1: [
    {
      id: 1,
      name: 'Wednesday\'s Child is Full of Woe',
      description: 'Wednesday Addams is expelled from her high school after dumping piranhas into the pool. Her parents send her to Nevermore Academy, where she discovers her psychic abilities.',
      watched: false,
      airDate: 'November 23, 2022'
    },
    {
      id: 2,
      name: 'Woe is the Loneliest Number',
      description: 'Wednesday investigates a monster attack and discovers a connection to her family\'s past. She also meets her new roommate Enid and the mysterious Xavier.',
      watched: false,
      airDate: 'November 23, 2022'
    },
    {
      id: 3,
      name: 'Friend or Woe',
      description: 'Wednesday tries to solve the mystery of the monster attacks while dealing with school politics. She forms an unlikely friendship with Eugene.',
      watched: false,
      airDate: 'November 23, 2022'
    },
    {
      id: 4,
      name: 'Woe What a Night',
      description: 'Wednesday attends the Rave\'N dance and uncovers more clues about the monster. Her visions become more intense and revealing.',
      watched: false,
      airDate: 'November 23, 2022'
    },
    {
      id: 5,
      name: 'You Reap What You Woe',
      description: 'Wednesday\'s investigation leads her to discover shocking secrets about her family and the academy. The monster attacks escalate.',
      watched: false,
      airDate: 'November 23, 2022'
    },
    {
      id: 6,
      name: 'Quid Pro Woe',
      description: 'Wednesday confronts the truth about the monster and her family\'s involvement. She must make a difficult choice about her future.',
      watched: false,
      airDate: 'November 23, 2022'
    },
    {
      id: 7,
      name: 'If You Don\'t Woe Me by Now',
      description: 'Wednesday faces the consequences of her actions and discovers the true identity of the monster. The season builds to its climax.',
      watched: false,
      airDate: 'November 23, 2022'
    },
    {
      id: 8,
      name: 'A Murder of Woes',
      description: 'The season finale brings Wednesday face to face with the mastermind behind the attacks. She must use all her skills to save her friends and family.',
      watched: false,
      airDate: 'November 23, 2022'
    }
  ]
}


const strangerThingsEpisodes: Record<number, any[]> = {
  1: [
    {
      id: 1,
      name: 'Chapter One: The Vanishing of Will Byers',
      description: 'When Will Byers mysteriously disappears, his mother Joyce, the local police chief Jim Hopper, and Will\'s friends begin a terrifying investigation.',
      watched: false,
      airDate: 'July 15, 2016'
    },
    {
      id: 2,
      name: 'Chapter Two: The Weirdo on Maple Street',
      description: 'Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about an unsettling phone call.',
      watched: false,
      airDate: 'July 15, 2016'
    },
    {
      id: 3,
      name: 'Chapter Three: Holly, Jolly',
      description: 'An increasingly concerned Nancy looks for Barb and finds out what Jonathan\'s been up to. Joyce is convinced Will is trying to talk to her.',
      watched: false,
      airDate: 'July 15, 2016'
    },
    {
      id: 4,
      name: 'Chapter Four: The Body',
      description: 'Refusing to believe Will is dead, Joyce tries to connect with her son. The boys give Eleven a makeover. Jonathan and Nancy form an unlikely alliance.',
      watched: false,
      airDate: 'July 15, 2016'
    },
    {
      id: 5,
      name: 'Chapter Five: The Flea and the Acrobat',
      description: 'Hopper breaks into the lab to find Will and discovers the truth about what\'s happening to the missing boy. Eleven struggles with her past.',
      watched: false,
      airDate: 'July 15, 2016'
    },
    {
      id: 6,
      name: 'Chapter Six: The Monster',
      description: 'Jonathan and Nancy join forces to investigate the lab, and the truth about the monster is finally revealed.',
      watched: false,
      airDate: 'July 15, 2016'
    },
    {
      id: 7,
      name: 'Chapter Seven: The Bathtub',
      description: 'Eleven tries to reach Will, while Lucas warns that "the bad men are coming." Nancy and Jonathan show the police what Jonathan caught on camera.',
      watched: false,
      airDate: 'July 15, 2016'
    },
    {
      id: 8,
      name: 'Chapter Eight: The Upside Down',
      description: 'Dr. Brenner holds Hopper and Joyce for questioning while the boys wait with Eleven in the gym. Back at Will\'s, a creature lurks in the walls.',
      watched: false,
      airDate: 'July 15, 2016'
    }
  ],
  2: [
    {
      id: 1,
      name: 'Chapter One: MADMAX',
      description: 'One year after Will\'s return, everything seems back to normal... until a small alien and a shady conspiracy bring the gang back together.',
      watched: false,
      airDate: 'October 27, 2017'
    },
    {
      id: 2,
      name: 'Chapter Two: Trick or Treat, Freak',
      description: 'Dustin adopts a strange new pet, and Eleven grows increasingly restless. A complicated love triangle develops.',
      watched: false,
      airDate: 'October 27, 2017'
    },
    {
      id: 3,
      name: 'Chapter Three: The Pollywog',
      description: 'Dustin tries to come to terms with the creature he\'s discovered, while Eleven struggles with her past and her future.',
      watched: false,
      airDate: 'October 27, 2017'
    },
    {
      id: 4,
      name: 'Chapter Four: Will the Wise',
      description: 'Will opens up to Joyce - with disturbing results. While Hopper searches for the truth, Eleven makes a surprising discovery.',
      watched: false,
      airDate: 'October 27, 2017'
    },
    {
      id: 5,
      name: 'Chapter Five: Dig Dug',
      description: 'Nancy and Jonathan swap conspiracy theories with a new reporter as Mike and Hopper meet with Dr. Owens to discuss the shadow monster.',
      watched: false,
      airDate: 'October 27, 2017'
    },
    {
      id: 6,
      name: 'Chapter Six: The Spy',
      description: 'Will\'s connection to a shadowy evil grows stronger, but no one\'s quite sure how to stop it. Meanwhile, Dustin and Steve forge an unlikely alliance.',
      watched: false,
      airDate: 'October 27, 2017'
    },
    {
      id: 7,
      name: 'Chapter Seven: The Lost Sister',
      description: 'Eleven struggles with her past and her future, while the shadow monster takes Will over.',
      watched: false,
      airDate: 'October 27, 2017'
    },
    {
      id: 8,
      name: 'Chapter Eight: The Mind Flayer',
      description: 'The shadow monster takes Will over, and the gang realizes they need to close the gate to the Upside Down.',
      watched: false,
      airDate: 'October 27, 2017'
    },
    {
      id: 9,
      name: 'Chapter Nine: The Gate',
      description: 'Eleven makes plans to finish what she started while the survivors turn up the heat on the monstrous force that\'s holding Will hostage.',
      watched: false,
      airDate: 'October 27, 2017'
    }
  ],
  3: [
    {
      id: 1,
      name: 'Chapter One: Suzie, Do You Copy?',
      description: 'A year after the battle with the Mind Flayer, the gang is split up and dealing with typical teenage problems. But a new threat emerges.',
      watched: false,
      airDate: 'July 4, 2019'
    },
    {
      id: 2,
      name: 'Chapter Two: The Mall Rats',
      description: 'The kids split up to cover more ground, while a new horror begins to surface inside the Starcourt Mall.',
      watched: false,
      airDate: 'July 4, 2019'
    },
    {
      id: 3,
      name: 'Chapter Three: The Case of the Missing Lifeguard',
      description: 'Eleven and Max look for Billy, while the boys and Steve track down Dustin\'s source. Joyce considers a bold move.',
      watched: false,
      airDate: 'July 4, 2019'
    },
    {
      id: 4,
      name: 'Chapter Four: The Sauna Test',
      description: 'The kids discover a way to communicate with the Mind Flayer, while Hopper and Joyce get closer to the truth.',
      watched: false,
      airDate: 'July 4, 2019'
    },
    {
      id: 5,
      name: 'Chapter Five: The Flayed',
      description: 'Nancy and Jonathan follow a lead, while Steve and Robin get more than they bargained for. Max and Eleven see Billy\'s dark side.',
      watched: false,
      airDate: 'July 4, 2019'
    },
    {
      id: 6,
      name: 'Chapter Six: E Pluribus Unum',
      description: 'The Mind Flayer grows stronger, while the kids try to figure out how to stop it. Hopper and Joyce make a shocking discovery.',
      watched: false,
      airDate: 'July 4, 2019'
    },
    {
      id: 7,
      name: 'Chapter Seven: The Bite',
      description: 'The Mind Flayer attacks the mall, and the kids must fight for their lives. Eleven loses her powers in the process.',
      watched: false,
      airDate: 'July 4, 2019'
    },
    {
      id: 8,
      name: 'Chapter Eight: The Battle of Starcourt',
      description: 'The kids fight the Mind Flayer at the mall, while Hopper and Joyce try to close the gate. A shocking sacrifice is made.',
      watched: false,
      airDate: 'July 4, 2019'
    }
  ],
  4: [
    {
      id: 1,
      name: 'Chapter One: The Hellfire Club',
      description: 'Six months after the Battle of Starcourt, the group is separated for the first time. As they navigate the complexities of high school, a new supernatural threat surfaces.',
      watched: false,
      airDate: 'May 27, 2022'
    },
    {
      id: 2,
      name: 'Chapter Two: Vecna\'s Curse',
      description: 'When Max begins having visions of Chrissy\'s death, she realizes something is wrong. Meanwhile, Dustin and Steve discover that something is hunting them.',
      watched: false,
      airDate: 'May 27, 2022'
    },
    {
      id: 3,
      name: 'Chapter Three: The Monster and the Superhero',
      description: 'Eleven struggles with her new life in California, while the group in Hawkins tries to figure out what\'s happening to Max.',
      watched: false,
      airDate: 'May 27, 2022'
    },
    {
      id: 4,
      name: 'Chapter Four: Dear Billy',
      description: 'Max is in grave danger and has written letters to her friends and family. Eleven tries to regain her powers.',
      watched: false,
      airDate: 'May 27, 2022'
    },
    {
      id: 5,
      name: 'Chapter Five: The Nina Project',
      description: 'Eleven is taken to a secret facility where Dr. Brenner tries to help her regain her powers. Meanwhile, the group in Hawkins investigates Vecna.',
      watched: false,
      airDate: 'May 27, 2022'
    },
    {
      id: 6,
      name: 'Chapter Six: The Dive',
      description: 'Eleven learns the truth about her past and her connection to Vecna. The group in Hawkins prepares for battle.',
      watched: false,
      airDate: 'May 27, 2022'
    },
    {
      id: 7,
      name: 'Chapter Seven: The Massacre at Hawkins Lab',
      description: 'Eleven discovers the truth about what happened at Hawkins Lab in 1979. Vecna\'s origin is revealed.',
      watched: false,
      airDate: 'May 27, 2022'
    },
    {
      id: 8,
      name: 'Chapter Eight: Papa',
      description: 'Eleven confronts Dr. Brenner and learns the full truth about her past. The group in Hawkins faces Vecna.',
      watched: false,
      airDate: 'May 27, 2022'
    },
    {
      id: 9,
      name: 'Chapter Nine: The Piggyback',
      description: 'The group launches a plan to defeat Vecna once and for all, but the battle takes an unexpected turn.',
      watched: false,
      airDate: 'July 1, 2022'
    }
  ]
}


const mandalorianEpisodes: Record<number, any[]> = {
  1: [
    {
      id: 1,
      name: 'Chapter 1: The Mandalorian',
      description: 'A Mandalorian bounty hunter tracks a target for a well-paying client, but discovers the target is not what it seems.',
      watched: false,
      airDate: 'November 12, 2019'
    },
    {
      id: 2,
      name: 'Chapter 2: The Child',
      description: 'The Mandalorian must protect the Child from bounty hunters while trying to find a safe place to hide.',
      watched: false,
      airDate: 'November 15, 2019'
    },
    {
      id: 3,
      name: 'Chapter 3: The Sin',
      description: 'The Mandalorian returns to his guild and faces the consequences of his actions. He must make a difficult choice.',
      watched: false,
      airDate: 'November 22, 2019'
    },
    {
      id: 4,
      name: 'Chapter 4: Sanctuary',
      description: 'The Mandalorian and the Child find refuge on a farming planet, but their peace is threatened by raiders.',
      watched: false,
      airDate: 'November 29, 2019'
    },
    {
      id: 5,
      name: 'Chapter 5: The Gunslinger',
      description: 'The Mandalorian helps a young bounty hunter on Tatooine, but things don\'t go as planned.',
      watched: false,
      airDate: 'December 6, 2019'
    },
    {
      id: 6,
      name: 'Chapter 6: The Prisoner',
      description: 'The Mandalorian joins a crew of mercenaries on a prison break mission, but betrayal lurks around every corner.',
      watched: false,
      airDate: 'December 13, 2019'
    },
    {
      id: 7,
      name: 'Chapter 7: The Reckoning',
      description: 'The Mandalorian returns to Nevarro to settle his debt with Greef Karga, but the situation is more complicated than expected.',
      watched: false,
      airDate: 'December 18, 2019'
    },
    {
      id: 8,
      name: 'Chapter 8: Redemption',
      description: 'The Mandalorian faces off against Moff Gideon and his forces in an epic battle for the Child\'s future.',
      watched: false,
      airDate: 'December 27, 2019'
    }
  ],
  2: [
    {
      id: 1,
      name: 'Chapter 9: The Marshal',
      description: 'The Mandalorian searches for other Mandalorians and finds a marshal wearing Mandalorian armor on Tatooine.',
      watched: false,
      airDate: 'October 30, 2020'
    },
    {
      id: 2,
      name: 'Chapter 10: The Passenger',
      description: 'The Mandalorian transports a passenger to Trask, but their journey is interrupted by ice spiders and X-wings.',
      watched: false,
      airDate: 'November 6, 2020'
    },
    {
      id: 3,
      name: 'Chapter 11: The Heiress',
      description: 'The Mandalorian meets Bo-Katan and learns about the Darksaber. They team up to steal weapons from an Imperial ship.',
      watched: false,
      airDate: 'November 13, 2020'
    },
    {
      id: 4,
      name: 'Chapter 12: The Siege',
      description: 'The Mandalorian returns to Nevarro to help Greef Karga and Cara Dune defend the city from Imperial forces.',
      watched: false,
      airDate: 'November 20, 2020'
    },
    {
      id: 5,
      name: 'Chapter 13: The Jedi',
      description: 'The Mandalorian meets Ahsoka Tano, who reveals the Child\'s name and true nature. She agrees to train him.',
      watched: false,
      airDate: 'November 27, 2020'
    },
    {
      id: 6,
      name: 'Chapter 14: The Tragedy',
      description: 'The Mandalorian and the Child are ambushed by Dark Troopers. Moff Gideon captures the Child.',
      watched: false,
      airDate: 'December 4, 2020'
    },
    {
      id: 7,
      name: 'Chapter 15: The Believer',
      description: 'The Mandalorian teams up with Mayfeld to infiltrate an Imperial base and find Moff Gideon\'s location.',
      watched: false,
      airDate: 'December 11, 2020'
    },
    {
      id: 8,
      name: 'Chapter 16: The Rescue',
      description: 'The Mandalorian launches a rescue mission to save the Child from Moff Gideon\'s ship.',
      watched: false,
      airDate: 'December 18, 2020'
    }
  ],
  3: [
    {
      id: 1,
      name: 'Chapter 17: The Apostate',
      description: 'The Mandalorian returns to his homeworld and faces challenges from his own people while protecting the Child.',
      watched: false,
      airDate: 'March 1, 2023'
    },
    {
      id: 2,
      name: 'Chapter 18: The Mines of Mandalore',
      description: 'The Mandalorian and the Child explore the ruins of Mandalore to find the Living Waters.',
      watched: false,
      airDate: 'March 8, 2023'
    },
    {
      id: 3,
      name: 'Chapter 19: The Convert',
      description: 'The Mandalorian helps a former Imperial officer who is trying to start a new life.',
      watched: false,
      airDate: 'March 15, 2023'
    },
    {
      id: 4,
      name: 'Chapter 20: The Foundling',
      description: 'The Mandalorian and the Child help a young Mandalorian foundling who is being hunted.',
      watched: false,
      airDate: 'March 22, 2023'
    },
    {
      id: 5,
      name: 'Chapter 21: The Pirate',
      description: 'The Mandalorian helps Greef Karga defend Nevarro from pirates, earning the respect of his people.',
      watched: false,
      airDate: 'March 29, 2023'
    },
    {
      id: 6,
      name: 'Chapter 22: Guns for Hire',
      description: 'The Mandalorian and the Child visit a luxury planet to help solve a mystery involving droids.',
      watched: false,
      airDate: 'April 5, 2023'
    },
    {
      id: 7,
      name: 'Chapter 23: The Spies',
      description: 'The Mandalorian discovers that there are spies among the Mandalorians working for Moff Gideon.',
      watched: false,
      airDate: 'April 12, 2023'
    },
    {
      id: 8,
      name: 'Chapter 24: The Return',
      description: 'The Mandalorian and his allies face off against Moff Gideon and his forces in an epic final battle.',
      watched: false,
      airDate: 'April 19, 2023'
    }
  ]
}

const crownEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Wolferton Splash", description: "The young Queen Elizabeth II faces the challenges of her new role after her father's death.", watched: false, airDate: "November 4, 2016" },
    { id: 2, name: "Hyde Park Corner", description: "Elizabeth learns of her father's death while on tour in Kenya and must return to London.", watched: false, airDate: "November 4, 2016" },
    { id: 3, name: "Windsor", description: "The Queen and her family move to Windsor Castle during the early days of her reign.", watched: false, airDate: "November 4, 2016" },
    { id: 4, name: "Act of God", description: "London is hit by a devastating fog that tests the Queen's leadership.", watched: false, airDate: "November 4, 2016" },
    { id: 5, name: "Smoke and Mirrors", description: "The Queen prepares for her coronation while dealing with family and political pressures.", watched: false, airDate: "November 4, 2016" },
    { id: 6, name: "Gelignite", description: "The Queen faces a crisis when her sister Margaret wants to marry a divorced man.", watched: false, airDate: "November 4, 2016" },
    { id: 7, name: "Scientia Potentia Est", description: "The Queen deals with political challenges and learns to assert her authority.", watched: false, airDate: "November 4, 2016" },
    { id: 8, name: "Pride & Joy", description: "The Queen gives birth to her first child while balancing royal duties.", watched: false, airDate: "November 4, 2016" },
    { id: 9, name: "Assassins", description: "The Queen faces a threat to her life while dealing with political tensions.", watched: false, airDate: "November 4, 2016" },
    { id: 10, name: "Gloriana", description: "The Queen celebrates her coronation and embraces her role as monarch.", watched: false, airDate: "November 4, 2016" }
  ],
  2: [
    { id: 1, name: "Misadventure", description: "The Queen faces a crisis when her husband is accused of infidelity.", watched: false, airDate: "December 8, 2017" },
    { id: 2, name: "A Company of Men", description: "Prince Philip struggles with his role while the Queen deals with political challenges.", watched: false, airDate: "December 8, 2017" },
    { id: 3, name: "Lisbon", description: "The Queen visits Portugal and faces diplomatic challenges.", watched: false, airDate: "December 8, 2017" },
    { id: 4, name: "Beryl", description: "The Queen deals with personal and political crises during a difficult period.", watched: false, airDate: "December 8, 2017" },
    { id: 5, name: "Marionettes", description: "The Queen faces criticism and must adapt to changing times.", watched: false, airDate: "December 8, 2017" },
    { id: 6, name: "Vergangenheit", description: "The Queen discovers shocking secrets about her family's past.", watched: false, airDate: "December 8, 2017" },
    { id: 7, name: "Matrimonium", description: "Princess Margaret's wedding brings family tensions to the surface.", watched: false, airDate: "December 8, 2017" },
    { id: 8, name: "Dear Mrs. Kennedy", description: "The Queen meets Jackie Kennedy and faces comparisons between their roles.", watched: false, airDate: "December 8, 2017" },
    { id: 9, name: "Paterfamilias", description: "Prince Philip's difficult childhood is explored through flashbacks.", watched: false, airDate: "December 8, 2017" },
    { id: 10, name: "Mystery Man", description: "The Queen faces a personal crisis while dealing with political pressures.", watched: false, airDate: "December 8, 2017" }
  ],
  3: [
    { id: 1, name: "Olding", description: "The Queen faces a spy scandal that threatens national security.", watched: false, airDate: "November 17, 2019" },
    { id: 2, name: "Margaretology", description: "Princess Margaret's visit to America creates diplomatic opportunities.", watched: false, airDate: "November 17, 2019" },
    { id: 3, name: "Aberfan", description: "The Queen deals with a mining disaster that claims many lives.", watched: false, airDate: "November 17, 2019" },
    { id: 4, name: "Bubbikins", description: "Prince Philip's mother visits and causes controversy at the palace.", watched: false, airDate: "November 17, 2019" },
    { id: 5, name: "Coup", description: "The Queen faces a political crisis when Harold Wilson becomes Prime Minister.", watched: false, airDate: "November 17, 2019" },
    { id: 6, name: "Tywysog Cymru", description: "Prince Charles is invested as Prince of Wales in a controversial ceremony.", watched: false, airDate: "November 17, 2019" },
    { id: 7, name: "Moondust", description: "Prince Philip struggles with his identity after the moon landing.", watched: false, airDate: "November 17, 2019" },
    { id: 8, name: "Dangling Man", description: "The Queen faces a constitutional crisis over the Rhodesia issue.", watched: false, airDate: "November 17, 2019" },
    { id: 9, name: "Imbroglio", description: "The Queen must choose between her family and her duty during a crisis.", watched: false, airDate: "November 17, 2019" },
    { id: 10, name: "Cri de Coeur", description: "The season finale brings the Queen's personal and political challenges to a head.", watched: false, airDate: "November 17, 2019" }
  ],
  4: [
    { id: 1, name: "Gold Stick", description: "The Queen faces new challenges as Margaret Thatcher becomes Prime Minister.", watched: false, airDate: "November 15, 2020" },
    { id: 2, name: "The Balmoral Test", description: "Margaret Thatcher visits Balmoral and struggles to fit in with the royal family.", watched: false, airDate: "November 15, 2020" },
    { id: 3, name: "Fairytale", description: "Prince Charles meets Lady Diana Spencer and their romance begins.", watched: false, airDate: "November 15, 2020" },
    { id: 4, name: "Favourites", description: "The Queen deals with family tensions and political pressures.", watched: false, airDate: "November 15, 2020" },
    { id: 5, name: "Fagan", description: "An intruder breaks into Buckingham Palace, causing a security crisis.", watched: false, airDate: "November 15, 2020" },
    { id: 6, name: "Terra Nullius", description: "Prince Charles and Diana's wedding preparations reveal family tensions.", watched: false, airDate: "November 15, 2020" },
    { id: 7, name: "The Hereditary Principle", description: "The Queen faces criticism and must adapt to changing times.", watched: false, airDate: "November 15, 2020" },
    { id: 8, name: "48:1", description: "Prince Charles and Diana's wedding brings joy but also reveals underlying problems.", watched: false, airDate: "November 15, 2020" },
    { id: 9, name: "Avalanche", description: "The Queen faces a major crisis that tests her leadership.", watched: false, airDate: "November 15, 2020" },
    { id: 10, name: "War", description: "The season finale brings the Queen's challenges to a dramatic conclusion.", watched: false, airDate: "November 15, 2020" }
  ],
  5: [
    { id: 1, name: "Queen Victoria Syndrome", description: "The Queen faces pressure to abdicate as the monarchy's popularity declines.", watched: false, airDate: "November 9, 2022" },
    { id: 2, name: "The System", description: "Prince Charles and Diana's marriage continues to deteriorate publicly.", watched: false, airDate: "November 9, 2022" },
    { id: 3, name: "Mou Mou", description: "The story of Mohamed Al-Fayed and his relationship with the royal family.", watched: false, airDate: "November 9, 2022" },
    { id: 4, name: "Annus Horribilis", description: "The Queen faces multiple crises in what becomes her worst year.", watched: false, airDate: "November 9, 2022" },
    { id: 5, name: "The Way Ahead", description: "The Queen must adapt to changing times and public opinion.", watched: false, airDate: "November 9, 2022" },
    { id: 6, name: "Ipatiev House", description: "The Queen deals with the aftermath of the Russian Revolution revelations.", watched: false, airDate: "November 9, 2022" },
    { id: 7, name: "No Woman's Land", description: "The Queen faces gender discrimination in the royal family.", watched: false, airDate: "November 9, 2022" },
    { id: 8, name: "Gunpowder", description: "The Queen faces a threat to her life while dealing with family issues.", watched: false, airDate: "November 9, 2022" },
    { id: 9, name: "Couple 31", description: "Prince Charles and Diana's divorce proceedings become public.", watched: false, airDate: "November 9, 2022" },
    { id: 10, name: "Decommissioned", description: "The season finale brings the Queen's challenges to a dramatic conclusion.", watched: false, airDate: "November 9, 2022" }
  ],
  6: [
    { id: 1, name: "Persona Non Grata", description: "The Queen faces the aftermath of Diana's death and public mourning.", watched: false, airDate: "November 16, 2023" },
    { id: 2, name: "Two Photographs", description: "The Queen must decide how to respond to Diana's death publicly.", watched: false, airDate: "November 16, 2023" },
    { id: 3, name: "Dis-Moi-Oui", description: "Prince Charles deals with the aftermath of Diana's death.", watched: false, airDate: "November 16, 2023" },
    { id: 4, name: "Aftermath", description: "The royal family faces public criticism and must adapt.", watched: false, airDate: "November 16, 2023" },
    { id: 5, name: "Willsmania", description: "Prince William becomes a public figure and faces media attention.", watched: false, airDate: "November 16, 2023" },
    { id: 6, name: "Ruritania", description: "The Queen faces political challenges and changing times.", watched: false, airDate: "November 16, 2023" },
    { id: 7, name: "Alma Mater", description: "Prince William attends university and faces new challenges.", watched: false, airDate: "November 16, 2023" },
    { id: 8, name: "Ritz", description: "The Queen celebrates her Golden Jubilee and reflects on her reign.", watched: false, airDate: "November 16, 2023" },
    { id: 9, name: "Hope Street", description: "The Queen faces the future and considers her legacy.", watched: false, airDate: "November 16, 2023" },
    { id: 10, name: "Sleep, Dearie Sleep", description: "The series finale brings the Queen's story to a conclusion.", watched: false, airDate: "November 16, 2023" }
  ]
}


const darkEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Secrets", description: "A child's disappearance sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.", watched: false, airDate: "December 1, 2017" },
    { id: 2, name: "Lies", description: "Mikkel's disappearance leads to a police investigation that reveals the town's dark secrets.", watched: false, airDate: "December 1, 2017" },
    { id: 3, name: "Past and Present", description: "The investigation uncovers connections between past and present events in Winden.", watched: false, airDate: "December 1, 2017" },
    { id: 4, name: "Double Lives", description: "The characters' secrets begin to unravel as the mystery deepens.", watched: false, airDate: "December 1, 2017" },
    { id: 5, name: "Truths", description: "The truth about the missing children begins to emerge.", watched: false, airDate: "December 1, 2017" },
    { id: 6, name: "Sic Mundus Creatus Est", description: "The season finale reveals shocking truths about time and reality.", watched: false, airDate: "December 1, 2017" },
    { id: 7, name: "Crossroads", description: "The characters face crucial decisions that will change everything.", watched: false, airDate: "December 1, 2017" },
    { id: 8, name: "As You Sow, So You Shall Reap", description: "The season builds to a dramatic conclusion that sets up the next chapter.", watched: false, airDate: "December 1, 2017" },
    { id: 9, name: "Everything Is Now", description: "The past and present collide in unexpected ways.", watched: false, airDate: "December 1, 2017" },
    { id: 10, name: "Alpha and Omega", description: "The season finale brings the story to a shocking conclusion.", watched: false, airDate: "December 1, 2017" }
  ],
  2: [
    { id: 1, name: "Beginnings and Endings", description: "Six months after the disappearance, the families continue their search for answers.", watched: false, airDate: "June 21, 2019" },
    { id: 2, name: "Dark Matter", description: "The investigation reveals connections between different time periods.", watched: false, airDate: "June 21, 2019" },
    { id: 3, name: "Ghosts", description: "The characters confront their past and future selves.", watched: false, airDate: "June 21, 2019" },
    { id: 4, name: "The Travelers", description: "Time travelers reveal their true identities and purposes.", watched: false, airDate: "June 21, 2019" },
    { id: 5, name: "Lost and Found", description: "The search for the missing children takes unexpected turns.", watched: false, airDate: "June 21, 2019" },
    { id: 6, name: "An Endless Cycle", description: "The characters discover the cyclical nature of their reality.", watched: false, airDate: "June 21, 2019" },
    { id: 7, name: "The White Devil", description: "A mysterious figure emerges with crucial information.", watched: false, airDate: "June 21, 2019" },
    { id: 8, name: "Endings and Beginnings", description: "The season finale reveals the true nature of the apocalypse.", watched: false, airDate: "June 21, 2019" }
  ],
  3: [
    { id: 1, name: "Deja-vu", description: "The characters navigate between two worlds as the apocalypse approaches.", watched: false, airDate: "June 27, 2020" },
    { id: 2, name: "The Survivors", description: "The aftermath of the apocalypse reveals new challenges.", watched: false, airDate: "June 27, 2020" },
    { id: 3, name: "Adam and Eva", description: "The origin of the two worlds is revealed.", watched: false, airDate: "June 27, 2020" },
    { id: 4, name: "The Origin", description: "The true beginning of the cycle is discovered.", watched: false, airDate: "June 27, 2020" },
    { id: 5, name: "Life and Death", description: "The characters face the ultimate choice between life and death.", watched: false, airDate: "June 27, 2020" },
    { id: 6, name: "Light and Shadow", description: "The final battle between light and shadow begins.", watched: false, airDate: "June 27, 2020" },
    { id: 7, name: "Between the Time", description: "The characters navigate the space between worlds.", watched: false, airDate: "June 27, 2020" },
    { id: 8, name: "The Paradise", description: "The series finale brings the story to its ultimate conclusion.", watched: false, airDate: "June 27, 2020" }
  ]
}


const boysEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "The Name of the Game", description: "Hughie Campbell's life is turned upside down when his girlfriend is killed by a superhero, leading him to join a group of vigilantes.", watched: false, airDate: "July 26, 2019" },
    { id: 2, name: "Cherry", description: "The Boys investigate a new drug that gives temporary superpowers to regular people.", watched: false, airDate: "July 26, 2019" },
    { id: 3, name: "Get Some", description: "The Boys infiltrate a superhero event to gather intelligence on Vought.", watched: false, airDate: "July 26, 2019" },
    { id: 4, name: "The Female of the Species", description: "The Boys rescue a mysterious superpowered girl while dealing with internal conflicts.", watched: false, airDate: "July 26, 2019" },
    { id: 5, name: "Good for the Soul", description: "The Boys face moral dilemmas while trying to expose Vought's secrets.", watched: false, airDate: "July 26, 2019" },
    { id: 6, name: "The Innocents", description: "The season builds to a dramatic climax as the Boys prepare for their final confrontation.", watched: false, airDate: "July 26, 2019" },
    { id: 7, name: "The Self-Preservation Society", description: "The Boys execute their plan to expose Vought and the Seven.", watched: false, airDate: "July 26, 2019" },
    { id: 8, name: "You Found Me", description: "The season finale brings the Boys' mission to a dramatic conclusion.", watched: false, airDate: "July 26, 2019" }
  ],
  2: [
    { id: 1, name: "The Big Ride", description: "The Boys are on the run while trying to expose Vought's secrets about Compound V.", watched: false, airDate: "September 4, 2020" },
    { id: 2, name: "Proper Preparation and Planning", description: "The Boys plan their next move while dealing with new threats.", watched: false, airDate: "September 4, 2020" },
    { id: 3, name: "Over the Hill with the Swords of a Thousand Men", description: "The Boys infiltrate a Vought facility to gather evidence.", watched: false, airDate: "September 4, 2020" },
    { id: 4, name: "Nothing Like It in the World", description: "The Boys face betrayal from within while trying to stay alive.", watched: false, airDate: "September 4, 2020" },
    { id: 5, name: "We Gotta Go Now", description: "The tension builds as the Boys prepare for their final confrontation.", watched: false, airDate: "September 4, 2020" },
    { id: 6, name: "The Bloody Doors Off", description: "The Boys execute their plan to expose Vought's secrets.", watched: false, airDate: "September 4, 2020" },
    { id: 7, name: "Butcher, Baker, Candlestick Maker", description: "The season builds to a dramatic climax as secrets are revealed.", watched: false, airDate: "September 4, 2020" },
    { id: 8, name: "What I Know", description: "The season finale brings the Boys' mission to a shocking conclusion.", watched: false, airDate: "September 4, 2020" }
  ],
  3: [
    { id: 1, name: "Payback", description: "The Boys investigate a new threat while dealing with the aftermath of their previous mission.", watched: false, airDate: "June 3, 2022" },
    { id: 2, name: "The Only Man in the Sky", description: "Homelander's power grows as he faces new challenges.", watched: false, airDate: "June 3, 2022" },
    { id: 3, name: "Barbary Coast", description: "The Boys discover a new superpowered threat that could change everything.", watched: false, airDate: "June 3, 2022" },
    { id: 4, name: "Glorious Five Year Plan", description: "The Boys infiltrate a Russian facility to gather intelligence.", watched: false, airDate: "June 3, 2022" },
    { id: 5, name: "The Last Time to Look on This World of Lies", description: "The tension builds as the Boys prepare for their final confrontation.", watched: false, airDate: "June 3, 2022" },
    { id: 6, name: "Herogasm", description: "The Boys attend a superhero orgy to gather intelligence.", watched: false, airDate: "June 3, 2022" },
    { id: 7, name: "Here Comes a Candle to Light You to Bed", description: "The season builds to a dramatic climax as secrets are revealed.", watched: false, airDate: "June 3, 2022" },
    { id: 8, name: "The Instant White-Hot Wild", description: "The season finale brings the Boys' mission to a shocking conclusion.", watched: false, airDate: "June 3, 2022" }
  ],
  4: [
    { id: 1, name: "Department of Dirty Tricks", description: "The Boys face new challenges as Homelander's power grows unchecked.", watched: false, airDate: "June 13, 2024" },
    { id: 2, name: "Life Among the Septics", description: "The Boys investigate a new threat while dealing with internal conflicts.", watched: false, airDate: "June 13, 2024" },
    { id: 3, name: "We'll Keep the Red Flag Flying Here", description: "The Boys infiltrate a Vought facility to gather intelligence.", watched: false, airDate: "June 13, 2024" },
    { id: 4, name: "Wisdom of the Ages", description: "The Boys face betrayal from within while trying to stay alive.", watched: false, airDate: "June 13, 2024" },
    { id: 5, name: "Beware the Jabberwock, My Son", description: "The tension builds as the Boys prepare for their final confrontation.", watched: false, airDate: "June 13, 2024" },
    { id: 6, name: "Dirty Business", description: "The Boys execute their plan to expose Vought's latest secrets.", watched: false, airDate: "June 13, 2024" },
    { id: 7, name: "The Insider", description: "The season builds to a dramatic climax as secrets are revealed.", watched: false, airDate: "June 13, 2024" },
    { id: 8, name: "Assassination Run", description: "The season finale brings the Boys' mission to a shocking conclusion.", watched: false, airDate: "June 13, 2024" }
  ]
}


const betterCallSaulEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Uno", description: "Jimmy McGill struggles to make a living as a public defender while dealing with his brother's law firm.", watched: false, airDate: "February 8, 2015" },
    { id: 2, name: "Mijo", description: "Jimmy's attempt to scam a potential client goes wrong, leading to unexpected consequences.", watched: false, airDate: "February 9, 2015" },
    { id: 3, name: "Nacho", description: "Jimmy gets involved with a criminal client while trying to build his legal practice.", watched: false, airDate: "February 16, 2015" },
    { id: 4, name: "Hero", description: "Jimmy tries to use his past to gain publicity for his law practice.", watched: false, airDate: "February 23, 2015" },
    { id: 5, name: "Alpine Shepherd Boy", description: "Jimmy takes on a case involving an elderly client with dementia.", watched: false, airDate: "March 2, 2015" },
    { id: 6, name: "Five-O", description: "Mike Ehrmantraut's past is revealed as he deals with police questioning.", watched: false, airDate: "March 9, 2015" },
    { id: 7, name: "Bingo", description: "Jimmy faces a moral dilemma when a case becomes more complicated than expected.", watched: false, airDate: "March 16, 2015" },
    { id: 8, name: "RICO", description: "Jimmy discovers a potential case that could change his career.", watched: false, airDate: "March 23, 2015" },
    { id: 9, name: "Pimento", description: "Jimmy presents his case to his brother's law firm.", watched: false, airDate: "March 30, 2015" },
    { id: 10, name: "Marco", description: "The season finale brings Jimmy's journey to a dramatic conclusion.", watched: false, airDate: "April 6, 2015" }
  ],
  2: [
    { id: 1, name: "Switch", description: "Jimmy considers joining his brother's law firm while dealing with personal conflicts.", watched: false, airDate: "February 15, 2016" },
    { id: 2, name: "Cobbler", description: "Jimmy takes on a case that leads him into the criminal underworld.", watched: false, airDate: "February 22, 2016" },
    { id: 3, name: "Amarillo", description: "Jimmy tries to build his client base through unconventional methods.", watched: false, airDate: "February 29, 2016" },
    { id: 4, name: "Gloves Off", description: "Mike takes on a dangerous job while Jimmy deals with legal challenges.", watched: false, airDate: "March 7, 2016" },
    { id: 5, name: "Rebecca", description: "Jimmy's relationship with his brother becomes more complicated.", watched: false, airDate: "March 14, 2016" },
    { id: 6, name: "Bali Ha'i", description: "Jimmy faces a major decision about his future in law.", watched: false, airDate: "March 21, 2016" },
    { id: 7, name: "Inflatable", description: "Jimmy uses creative methods to attract clients to his practice.", watched: false, airDate: "March 28, 2016" },
    { id: 8, name: "Fifi", description: "Jimmy's actions have unexpected consequences for his career.", watched: false, airDate: "April 4, 2016" },
    { id: 9, name: "Nailed", description: "The tension builds as Jimmy's schemes begin to unravel.", watched: false, airDate: "April 11, 2016" },
    { id: 10, name: "Klick", description: "The season finale brings Jimmy's journey to a dramatic conclusion.", watched: false, airDate: "April 18, 2016" }
  ],
  3: [
    { id: 1, name: "Mabel", description: "Jimmy deals with the aftermath of his brother's accident.", watched: false, airDate: "April 10, 2017" },
    { id: 2, name: "Witness", description: "Jimmy's actions attract the attention of dangerous people.", watched: false, airDate: "April 17, 2017" },
    { id: 3, name: "Sunk Costs", description: "Jimmy tries to rebuild his practice while facing new challenges.", watched: false, airDate: "April 24, 2017" },
    { id: 4, name: "Sabrosito", description: "The criminal underworld begins to take notice of Jimmy's activities.", watched: false, airDate: "May 1, 2017" },
    { id: 5, name: "Chicanery", description: "Jimmy faces a hearing that could determine his future in law.", watched: false, airDate: "May 8, 2017" },
    { id: 6, name: "Off Brand", description: "Jimmy tries to reinvent himself after his suspension.", watched: false, airDate: "May 15, 2017" },
    { id: 7, name: "Expenses", description: "Jimmy struggles to make ends meet while building his new practice.", watched: false, airDate: "May 22, 2017" },
    { id: 8, name: "Slip", description: "Jimmy's schemes begin to have serious consequences.", watched: false, airDate: "May 29, 2017" },
    { id: 9, name: "Fall", description: "The tension builds as Jimmy's world begins to collapse.", watched: false, airDate: "June 5, 2017" },
    { id: 10, name: "Lantern", description: "The season finale brings Jimmy's transformation to a dramatic conclusion.", watched: false, airDate: "June 12, 2017" }
  ],
  4: [
    { id: 1, name: "Smoke", description: "Jimmy deals with the aftermath of his brother's death.", watched: false, airDate: "August 6, 2018" },
    { id: 2, name: "Breathe", description: "Jimmy tries to rebuild his life while dealing with grief.", watched: false, airDate: "August 13, 2018" },
    { id: 3, name: "Something Beautiful", description: "Jimmy begins to embrace his darker side.", watched: false, airDate: "August 20, 2018" },
    { id: 4, name: "Talk", description: "Jimmy's relationship with Kim becomes more complicated.", watched: false, airDate: "August 27, 2018" },
    { id: 5, name: "Quite a Ride", description: "Jimmy's transformation into Saul Goodman accelerates.", watched: false, airDate: "September 3, 2018" },
    { id: 6, name: "Piñata", description: "Jimmy faces new challenges as he embraces his criminal side.", watched: false, airDate: "September 10, 2018" },
    { id: 7, name: "Something Stupid", description: "Jimmy and Kim's relationship reaches a turning point.", watched: false, airDate: "September 17, 2018" },
    { id: 8, name: "Coushatta", description: "Jimmy uses his legal skills to help a client in trouble.", watched: false, airDate: "September 24, 2018" },
    { id: 9, name: "Wiedersehen", description: "Jimmy faces a major decision about his future.", watched: false, airDate: "October 1, 2018" },
    { id: 10, name: "Winner", description: "The season finale brings Jimmy's transformation to a dramatic conclusion.", watched: false, airDate: "October 8, 2018" }
  ],
  5: [
    { id: 1, name: "Magic Man", description: "Saul Goodman begins to establish himself in the criminal underworld.", watched: false, airDate: "February 23, 2020" },
    { id: 2, name: "50% Off", description: "Saul takes on dangerous clients while building his reputation.", watched: false, airDate: "February 24, 2020" },
    { id: 3, name: "The Guy for This", description: "Saul's criminal activities begin to escalate.", watched: false, airDate: "March 2, 2020" },
    { id: 4, name: "Namaste", description: "Saul faces new challenges as his criminal empire grows.", watched: false, airDate: "March 9, 2020" },
    { id: 5, name: "Dedicado a Max", description: "Saul deals with the consequences of his actions.", watched: false, airDate: "March 16, 2020" },
    { id: 6, name: "Wexler v. Goodman", description: "Saul and Kim's relationship faces its greatest test yet.", watched: false, airDate: "March 23, 2020" },
    { id: 7, name: "JMM", description: "Saul's criminal activities reach new heights.", watched: false, airDate: "March 30, 2020" },
    { id: 8, name: "Bagman", description: "Saul finds himself in a dangerous situation in the desert.", watched: false, airDate: "April 6, 2020" },
    { id: 9, name: "Bad Choice Road", description: "Saul deals with the aftermath of his dangerous mission.", watched: false, airDate: "April 13, 2020" },
    { id: 10, name: "Something Unforgivable", description: "The season finale brings Saul's journey to a dramatic conclusion.", watched: false, airDate: "April 20, 2020" }
  ],
  6: [
    { id: 1, name: "Wine and Roses", description: "Saul Goodman's criminal empire reaches its peak.", watched: false, airDate: "April 18, 2022" },
    { id: 2, name: "Carrot and Stick", description: "Saul faces new threats as his empire grows.", watched: false, airDate: "April 18, 2022" },
    { id: 3, name: "Rock and Hard Place", description: "Saul deals with the consequences of his criminal activities.", watched: false, airDate: "April 25, 2022" },
    { id: 4, name: "Hit and Run", description: "Saul's schemes begin to unravel.", watched: false, airDate: "May 2, 2022" },
    { id: 5, name: "Black and Blue", description: "Saul faces his greatest challenge yet.", watched: false, airDate: "May 9, 2022" },
    { id: 6, name: "Axe and Grind", description: "The tension builds as Saul's world begins to collapse.", watched: false, airDate: "May 16, 2022" },
    { id: 7, name: "Plan and Execution", description: "Saul's final plan begins to take shape.", watched: false, airDate: "May 23, 2022" },
    { id: 8, name: "Point and Shoot", description: "The series builds to its dramatic climax.", watched: false, airDate: "July 11, 2022" },
    { id: 9, name: "Fun and Games", description: "Saul Goodman's transformation is complete.", watched: false, airDate: "July 18, 2022" },
    { id: 10, name: "Nippy", description: "The series finale brings Saul's story to its conclusion.", watched: false, airDate: "July 25, 2022" },
    { id: 11, name: "Breaking Bad", description: "Saul's connection to Walter White is revealed.", watched: false, airDate: "August 1, 2022" },
    { id: 12, name: "Waterworks", description: "Saul faces the consequences of his actions.", watched: false, airDate: "August 8, 2022" },
    { id: 13, name: "Saul Gone", description: "The series finale brings Saul Goodman's story to its ultimate conclusion.", watched: false, airDate: "August 15, 2022" }
  ]
}


const moneyHeistEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Episode 1", description: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.", watched: false, airDate: "May 2, 2017" },
    { id: 2, name: "Episode 2", description: "The Professor's plan begins to unfold as the robbers start printing money while the police try to figure out their next move.", watched: false, airDate: "May 2, 2017" },
    { id: 3, name: "Episode 3", description: "The robbers face their first major challenge when one of the hostages tries to escape.", watched: false, airDate: "May 2, 2017" },
    { id: 4, name: "Episode 4", description: "The Professor continues to manipulate the police while the robbers deal with internal conflicts.", watched: false, airDate: "May 2, 2017" },
    { id: 5, name: "Episode 5", description: "The situation inside the mint becomes more tense as the robbers face pressure from both the police and the hostages.", watched: false, airDate: "May 2, 2017" },
    { id: 6, name: "Episode 6", description: "The Professor's plan faces its biggest test yet as the police close in on the mint.", watched: false, airDate: "May 2, 2017" },
    { id: 7, name: "Episode 7", description: "The robbers must adapt to changing circumstances as the police try to breach the mint.", watched: false, airDate: "May 2, 2017" },
    { id: 8, name: "Episode 8", description: "The first part of the heist comes to a dramatic conclusion as the robbers try to escape with the money.", watched: false, airDate: "May 2, 2017" },
    { id: 9, name: "Episode 9", description: "The robbers deal with the aftermath of the heist and prepare for their next move.", watched: false, airDate: "May 2, 2017" },
    { id: 10, name: "Episode 10", description: "The Professor and the robbers face new challenges as they try to stay one step ahead of the police.", watched: false, airDate: "May 2, 2017" },
    { id: 11, name: "Episode 11", description: "The robbers must deal with betrayal and new threats as they continue their plan.", watched: false, airDate: "May 2, 2017" },
    { id: 12, name: "Episode 12", description: "The situation becomes more desperate as the robbers face their greatest challenge yet.", watched: false, airDate: "May 2, 2017" },
    { id: 13, name: "Episode 13", description: "The first season comes to a dramatic conclusion as the robbers try to complete their mission.", watched: false, airDate: "May 2, 2017" }
  ],
  2: [
    { id: 1, name: "Episode 1", description: "The robbers escape from the mint and go into hiding while the police continue their investigation.", watched: false, airDate: "October 16, 2017" },
    { id: 2, name: "Episode 2", description: "The Professor plans their next move while the police close in on their location.", watched: false, airDate: "October 16, 2017" },
    { id: 3, name: "Episode 3", description: "The robbers face new challenges as they try to stay hidden.", watched: false, airDate: "October 16, 2017" },
    { id: 4, name: "Episode 4", description: "The Professor's relationship with the inspector becomes more complicated.", watched: false, airDate: "October 16, 2017" },
    { id: 5, name: "Episode 5", description: "The robbers prepare for their next heist while dealing with personal issues.", watched: false, airDate: "October 16, 2017" },
    { id: 6, name: "Episode 6", description: "The tension builds as the robbers plan their escape from Spain.", watched: false, airDate: "October 16, 2017" }
  ],
  3: [
    { id: 1, name: "Episode 1", description: "The Professor recruits the gang for a new heist on the Bank of Spain.", watched: false, airDate: "July 19, 2019" },
    { id: 2, name: "Episode 2", description: "The robbers infiltrate the Bank of Spain while the Professor manipulates the authorities.", watched: false, airDate: "July 19, 2019" },
    { id: 3, name: "Episode 3", description: "The heist begins as the robbers take control of the bank.", watched: false, airDate: "July 19, 2019" },
    { id: 4, name: "Episode 4", description: "The police respond to the bank robbery while the Professor faces new challenges.", watched: false, airDate: "July 19, 2019" },
    { id: 5, name: "Episode 5", description: "The robbers begin their plan to steal the gold while dealing with hostages.", watched: false, airDate: "July 19, 2019" },
    { id: 6, name: "Episode 6", description: "The tension builds as the police prepare to storm the bank.", watched: false, airDate: "July 19, 2019" },
    { id: 7, name: "Episode 7", description: "The robbers face internal conflicts while the police close in.", watched: false, airDate: "July 19, 2019" },
    { id: 8, name: "Episode 8", description: "The season finale brings the bank heist to a dramatic conclusion.", watched: false, airDate: "July 19, 2019" }
  ],
  4: [
    { id: 1, name: "Episode 1", description: "The robbers are trapped inside the Bank of Spain and must find a way to escape.", watched: false, airDate: "April 3, 2020" },
    { id: 2, name: "Episode 2", description: "The Professor faces his greatest challenge as the police close in.", watched: false, airDate: "April 3, 2020" },
    { id: 3, name: "Episode 3", description: "The robbers attempt to escape while the Professor tries to save them.", watched: false, airDate: "April 3, 2020" },
    { id: 4, name: "Episode 4", description: "The tension reaches its peak as the robbers face their greatest threat yet.", watched: false, airDate: "April 3, 2020" },
    { id: 5, name: "Episode 5", description: "The Professor's plan faces its ultimate test.", watched: false, airDate: "April 3, 2020" },
    { id: 6, name: "Episode 6", description: "The robbers make their final attempt to escape with the gold.", watched: false, airDate: "April 3, 2020" },
    { id: 7, name: "Episode 7", description: "The season builds to a dramatic climax.", watched: false, airDate: "April 3, 2020" },
    { id: 8, name: "Episode 8", description: "The season finale brings the story to a shocking conclusion.", watched: false, airDate: "April 3, 2020" }
  ],
  5: [
    { id: 1, name: "Episode 1", description: "The robbers face the consequences of their actions while planning their final escape.", watched: false, airDate: "September 3, 2021" },
    { id: 2, name: "Episode 2", description: "The Professor tries to save his team while dealing with personal loss.", watched: false, airDate: "September 3, 2021" },
    { id: 3, name: "Episode 3", description: "The robbers attempt to escape from Spain while being hunted.", watched: false, airDate: "September 3, 2021" },
    { id: 4, name: "Episode 4", description: "The tension builds as the robbers face their greatest challenge yet.", watched: false, airDate: "September 3, 2021" },
    { id: 5, name: "Episode 5", description: "The Professor's plan reaches its final phase.", watched: false, airDate: "December 3, 2021" },
    { id: 6, name: "Episode 6", description: "The robbers make their final attempt to escape with their freedom.", watched: false, airDate: "December 3, 2021" },
    { id: 7, name: "Episode 7", description: "The series builds to its dramatic climax.", watched: false, airDate: "December 3, 2021" },
    { id: 8, name: "Episode 8", description: "The series finale brings the story to its ultimate conclusion.", watched: false, airDate: "December 3, 2021" },
    { id: 9, name: "Episode 9", description: "The robbers face their final challenge.", watched: false, airDate: "December 3, 2021" },
    { id: 10, name: "Episode 10", description: "The series finale brings Money Heist to its conclusion.", watched: false, airDate: "December 3, 2021" }
  ]
}

// Datos de episodios para The Office (US)
const officeEpisodes: Record<number, any[]> = {
  1: [
    {
      id: 1,
      name: 'Pilot',
      description: 'Michael Scott tries to impress his new boss by organizing a diversity day, but his efforts backfire spectacularly.',
      watched: false,
      airDate: 'March 24, 2005'
    },
    {
      id: 2,
      name: 'Diversity Day',
      description: 'Michael organizes a diversity day workshop that goes horribly wrong, leading to awkward situations for everyone.',
      watched: false,
      airDate: 'March 29, 2005'
    },
    {
      id: 3,
      name: 'Health Care',
      description: 'Michael is put in charge of choosing the company\'s health care plan, but he delegates the responsibility to Dwight.',
      watched: false,
      airDate: 'April 5, 2005'
    },
    {
      id: 4,
      name: 'The Alliance',
      description: 'Jim and Dwight form an alliance to protect themselves from layoffs, but Jim has ulterior motives.',
      watched: false,
      airDate: 'April 12, 2005'
    },
    {
      id: 5,
      name: 'Basketball',
      description: 'Michael challenges the warehouse workers to a basketball game, but things don\'t go as planned.',
      watched: false,
      airDate: 'April 19, 2005'
    },
    {
      id: 6,
      name: 'Hot Girl',
      description: 'A beautiful woman visits the office, causing all the men to act strangely and compete for her attention.',
      watched: false,
      airDate: 'April 26, 2005'
    }
  ],
  2: [
    { id: 1, name: "The Dundies", description: "Michael hosts the annual Dundie Awards ceremony at Chili's.", watched: false, airDate: "September 20, 2005" },
    { id: 2, name: "Sexual Harassment", description: "Michael tries to teach the office about sexual harassment but makes things worse.", watched: false, airDate: "September 27, 2005" },
    { id: 3, name: "Office Olympics", description: "Jim organizes office Olympics while Michael is at a meeting.", watched: false, airDate: "October 4, 2005" },
    { id: 4, name: "The Fire", description: "A fire alarm forces everyone to evacuate the building.", watched: false, airDate: "October 11, 2005" },
    { id: 5, name: "Halloween", description: "Michael must fire someone on Halloween and struggles with the decision.", watched: false, airDate: "October 18, 2005" },
    { id: 6, name: "The Fight", description: "Michael and Dwight get into a physical altercation.", watched: false, airDate: "October 25, 2005" },
    { id: 7, name: "The Client", description: "Michael takes Jan and a client to Chili's for a business lunch.", watched: false, airDate: "November 1, 2005" },
    { id: 8, name: "Performance Review", description: "Michael conducts performance reviews for the office staff.", watched: false, airDate: "November 8, 2005" },
    { id: 9, name: "Email Surveillance", description: "Michael monitors everyone's emails after discovering inappropriate messages.", watched: false, airDate: "November 15, 2005" },
    { id: 10, name: "Christmas Party", description: "The office celebrates Christmas with a gift exchange.", watched: false, airDate: "December 6, 2005" },
    { id: 11, name: "Booze Cruise", description: "The office goes on a booze cruise for a team building exercise.", watched: false, airDate: "January 5, 2006" },
    { id: 12, name: "The Injury", description: "Michael injures his foot and becomes the center of attention.", watched: false, airDate: "January 12, 2006" },
    { id: 13, name: "The Secret", description: "Jim discovers that Pam is engaged to Roy.", watched: false, airDate: "January 19, 2006" },
    { id: 14, name: "The Carpet", description: "Michael's office carpet is replaced after an incident.", watched: false, airDate: "January 26, 2006" },
    { id: 15, name: "Boys and Girls", description: "Michael separates the men and women for team building exercises.", watched: false, airDate: "February 2, 2006" },
    { id: 16, name: "Valentine's Day", description: "The office celebrates Valentine's Day with various romantic complications.", watched: false, airDate: "February 9, 2006" },
    { id: 17, name: "Dwight's Speech", description: "Dwight gives a speech at a sales conference.", watched: false, airDate: "February 16, 2006" },
    { id: 18, name: "Take Your Daughter to Work Day", description: "The office celebrates Take Your Daughter to Work Day.", watched: false, airDate: "March 2, 2006" },
    { id: 19, name: "Michael's Birthday", description: "The office celebrates Michael's birthday.", watched: false, airDate: "March 9, 2006" },
    { id: 20, name: "Drug Testing", description: "Michael implements drug testing after Dwight's suspicious behavior.", watched: false, airDate: "March 16, 2006" },
    { id: 21, name: "Conflict Resolution", description: "Michael tries to resolve conflicts between office employees.", watched: false, airDate: "March 23, 2006" },
    { id: 22, name: "Casino Night", description: "The office hosts a casino night fundraiser.", watched: false, airDate: "March 30, 2006" }
  ],
  3: [
    { id: 1, name: "Gay Witch Hunt", description: "Michael tries to be politically correct after outing Oscar.", watched: false, airDate: "September 21, 2006" },
    { id: 2, name: "The Convention", description: "Michael and Dwight attend a paper convention in Philadelphia.", watched: false, airDate: "September 28, 2006" },
    { id: 3, name: "The Coup", description: "Jim tries to get Dwight transferred to another branch.", watched: false, airDate: "October 5, 2006" },
    { id: 4, name: "Grief Counseling", description: "Michael holds grief counseling after learning that Ed Truck died.", watched: false, airDate: "October 12, 2006" },
    { id: 5, name: "Initiation", description: "Dwight initiates Ryan into the sales team.", watched: false, airDate: "October 19, 2006" },
    { id: 6, name: "Diwali", description: "Kelly invites the office to a Diwali celebration.", watched: false, airDate: "November 2, 2006" },
    { id: 7, name: "Branch Closing", description: "The office learns that their branch might be closing.", watched: false, airDate: "November 9, 2006" },
    { id: 8, name: "The Merger", description: "The Scranton branch merges with the Stamford branch.", watched: false, airDate: "November 16, 2006" },
    { id: 9, name: "The Convict", description: "Michael tries to befriend the new employee, Martin.", watched: false, airDate: "November 30, 2006" },
    { id: 10, name: "A Benihana Christmas", description: "The office celebrates Christmas with dinner at Benihana.", watched: false, airDate: "December 7, 2006" },
    { id: 11, name: "Back from Vacation", description: "Michael returns from vacation with a new outlook on life.", watched: false, airDate: "January 4, 2007" },
    { id: 12, name: "Traveling Salesmen", description: "Michael, Dwight, and Jim go on a sales call together.", watched: false, airDate: "January 11, 2007" },
    { id: 13, name: "The Return", description: "Michael tries to get his old job back after being demoted.", watched: false, airDate: "January 18, 2007" },
    { id: 14, name: "Ben Franklin", description: "Michael hires a Ben Franklin impersonator for a sales presentation.", watched: false, airDate: "January 25, 2007" },
    { id: 15, name: "Phyllis' Wedding", description: "Michael tries to upstage Phyllis at her wedding.", watched: false, airDate: "February 1, 2007" },
    { id: 16, name: "Business School", description: "Michael gives a speech at Ryan's business school.", watched: false, airDate: "February 8, 2007" },
    { id: 17, name: "Cocktails", description: "Michael and Jan have dinner with Jim and Karen.", watched: false, airDate: "February 15, 2007" },
    { id: 18, name: "The Negotiation", description: "Michael negotiates a raise for the office staff.", watched: false, airDate: "February 22, 2007" },
    { id: 19, name: "Safety Training", description: "Michael holds a safety training session after Dwight's accident.", watched: false, airDate: "March 1, 2007" },
    { id: 20, name: "Product Recall", description: "The office deals with a product recall crisis.", watched: false, airDate: "March 8, 2007" },
    { id: 21, name: "Women's Appreciation", description: "Michael tries to show his appreciation for the women in the office.", watched: false, airDate: "March 15, 2007" },
    { id: 22, name: "Beach Games", description: "Michael holds beach games to determine his replacement.", watched: false, airDate: "March 22, 2007" },
    { id: 23, name: "The Job", description: "Michael, Jim, and Karen interview for the corporate job.", watched: false, airDate: "March 29, 2007" }
  ],
  4: [
    { id: 1, name: "Fun Run", description: "Michael organizes a fun run after hitting Meredith with his car.", watched: false, airDate: "September 27, 2007" },
    { id: 2, name: "Dunder Mifflin Infinity", description: "The company launches a new website and Ryan becomes Michael's boss.", watched: false, airDate: "October 4, 2007" },
    { id: 3, name: "Launch Party", description: "The office celebrates the launch of the new website.", watched: false, airDate: "October 11, 2007" },
    { id: 4, name: "Money", description: "Michael tries to save money by cutting office expenses.", watched: false, airDate: "October 18, 2007" },
    { id: 5, name: "Local Ad", description: "Michael creates a local commercial for Dunder Mifflin.", watched: false, airDate: "October 25, 2007" },
    { id: 6, name: "Branch Wars", description: "The Scranton branch competes with the Utica branch.", watched: false, airDate: "November 1, 2007" },
    { id: 7, name: "Survivor Man", description: "Michael goes on a survival trip in the woods.", watched: false, airDate: "November 8, 2007" },
    { id: 8, name: "The Deposition", description: "Michael gives a deposition in Jan's lawsuit against Dunder Mifflin.", watched: false, airDate: "November 15, 2007" },
    { id: 9, name: "Dinner Party", description: "Michael and Jan host a dinner party for Jim and Pam.", watched: false, airDate: "November 22, 2007" },
    { id: 10, name: "Chair Model", description: "Michael falls in love with a chair model from a catalog.", watched: false, airDate: "November 29, 2007" },
    { id: 11, name: "Night Out", description: "Michael, Dwight, and Jim go out for drinks after work.", watched: false, airDate: "December 6, 2007" },
    { id: 12, name: "Did I Stutter?", description: "Michael confronts Stanley about his disrespectful behavior.", watched: false, airDate: "December 13, 2007" },
    { id: 13, name: "Job Fair", description: "Michael and Dwight attend a job fair to recruit new employees.", watched: false, airDate: "January 10, 2008" },
    { id: 14, name: "Goodbye, Toby", description: "Toby's last day at Dunder Mifflin.", watched: false, airDate: "January 17, 2008" }
  ],
  5: [
    { id: 1, name: "Weight Loss", description: "The office participates in a weight loss competition.", watched: false, airDate: "September 25, 2008" },
    { id: 2, name: "Business Ethics", description: "Michael tries to teach the office about business ethics.", watched: false, airDate: "October 2, 2008" },
    { id: 3, name: "Baby Shower", description: "The office throws a baby shower for Jan.", watched: false, airDate: "October 9, 2008" },
    { id: 4, name: "Crime Aid", description: "The office hosts a charity event after being robbed.", watched: false, airDate: "October 16, 2008" },
    { id: 5, name: "Employee Transfer", description: "Holly transfers to the Scranton branch.", watched: false, airDate: "October 23, 2008" },
    { id: 6, name: "Customer Survey", description: "The office deals with poor customer survey results.", watched: false, airDate: "October 30, 2008" },
    { id: 7, name: "Business Trip", description: "Michael and Holly go on a business trip together.", watched: false, airDate: "November 6, 2008" },
    { id: 8, name: "Frame Toby", description: "Michael tries to frame Toby for drug possession.", watched: false, airDate: "November 13, 2008" },
    { id: 9, name: "The Surplus", description: "The office must decide how to spend their surplus budget.", watched: false, airDate: "November 20, 2008" },
    { id: 10, name: "Moroccan Christmas", description: "The office celebrates Christmas with a Moroccan theme.", watched: false, airDate: "December 4, 2008" },
    { id: 11, name: "The Duel", description: "Andy and Dwight duel for Angela's affection.", watched: false, airDate: "December 11, 2008" },
    { id: 12, name: "Prince Family Paper", description: "Michael and Dwight investigate a competitor.", watched: false, airDate: "January 8, 2009" },
    { id: 13, name: "Stress Relief", description: "The office deals with stress after Stanley has a heart attack.", watched: false, airDate: "January 15, 2009" },
    { id: 14, name: "Lecture Circuit", description: "Michael gives motivational speeches at other branches.", watched: false, airDate: "January 22, 2009" },
    { id: 15, name: "Blood Drive", description: "The office participates in a blood drive.", watched: false, airDate: "February 5, 2009" },
    { id: 16, name: "Golden Ticket", description: "Michael accidentally puts golden tickets in paper shipments.", watched: false, airDate: "February 12, 2009" },
    { id: 17, name: "New Boss", description: "Charles Miner becomes the new boss and changes everything.", watched: false, airDate: "February 19, 2009" },
    { id: 18, name: "Two Weeks", description: "Michael gives his two weeks notice and tries to enjoy his remaining time.", watched: false, airDate: "February 26, 2009" },
    { id: 19, name: "Dream Team", description: "Michael forms a dream team to work on a special project.", watched: false, airDate: "March 5, 2009" },
    { id: 20, name: "Michael Scott Paper Company", description: "Michael starts his own paper company.", watched: false, airDate: "March 12, 2009" },
    { id: 21, name: "Heavy Competition", description: "Michael's new company competes with Dunder Mifflin.", watched: false, airDate: "March 19, 2009" },
    { id: 22, name: "Broke", description: "Michael's company faces financial difficulties.", watched: false, airDate: "March 26, 2009" },
    { id: 23, name: "Casual Friday", description: "The office celebrates casual Friday with various complications.", watched: false, airDate: "April 9, 2009" },
    { id: 24, name: "Cafe Disco", description: "Michael turns the conference room into a disco cafe.", watched: false, airDate: "April 16, 2009" },
    { id: 25, name: "Company Picnic", description: "The office attends the annual company picnic.", watched: false, airDate: "April 23, 2009" },
    { id: 26, name: "Heavy Competition", description: "Michael's company continues to compete with Dunder Mifflin.", watched: false, airDate: "April 30, 2009" },
    { id: 27, name: "Broke", description: "Michael's company faces bankruptcy.", watched: false, airDate: "May 7, 2009" },
    { id: 28, name: "Casual Friday", description: "The office deals with the aftermath of casual Friday.", watched: false, airDate: "May 14, 2009" }
  ],
  6: [
    { id: 1, name: "Gossip", description: "The office spreads gossip about various employees.", watched: false, airDate: "September 17, 2009" },
    { id: 2, name: "The Meeting", description: "Michael tries to prevent Jim from becoming co-manager.", watched: false, airDate: "September 24, 2009" },
    { id: 3, name: "The Promotion", description: "Jim becomes co-manager and faces new challenges.", watched: false, airDate: "October 1, 2009" },
    { id: 4, name: "Niagara", description: "Jim and Pam get married in Niagara Falls.", watched: false, airDate: "October 8, 2009" },
    { id: 5, name: "Mafia", description: "The office plays a mafia game that gets out of hand.", watched: false, airDate: "October 15, 2009" },
    { id: 6, name: "The Lover", description: "Michael discovers that Pam's mom is dating someone from the office.", watched: false, airDate: "October 22, 2009" },
    { id: 7, name: "Koi Pond", description: "Michael falls into a koi pond and becomes a local celebrity.", watched: false, airDate: "October 29, 2009" },
    { id: 8, name: "Double Date", description: "Michael and Pam's mom go on a double date with Jim and Pam.", watched: false, airDate: "November 5, 2009" },
    { id: 9, name: "Murder", description: "The office plays a murder mystery game.", watched: false, airDate: "November 12, 2009" },
    { id: 10, name: "Shareholder Meeting", description: "Michael attends a shareholder meeting in New York.", watched: false, airDate: "November 19, 2009" },
    { id: 11, name: "Scott's Tots", description: "Michael visits the high school students he promised to pay for college.", watched: false, airDate: "December 3, 2009" },
    { id: 12, name: "Secret Santa", description: "The office celebrates Secret Santa with various complications.", watched: false, airDate: "December 10, 2009" },
    { id: 13, name: "The Banker", description: "A banker reviews the office for a potential sale.", watched: false, airDate: "January 21, 2010" },
    { id: 14, name: "Sabre", description: "The company is sold to Sabre and changes begin.", watched: false, airDate: "January 28, 2010" },
    { id: 15, name: "Manager and Salesman", description: "Jim struggles with his dual role as manager and salesman.", watched: false, airDate: "February 4, 2010" },
    { id: 16, name: "The Delivery", description: "Pam goes into labor and gives birth to their daughter.", watched: false, airDate: "February 11, 2010" },
    { id: 17, name: "St. Patrick's Day", description: "The office celebrates St. Patrick's Day.", watched: false, airDate: "March 4, 2010" },
    { id: 18, name: "New Leads", description: "The office gets new sales leads and competes for them.", watched: false, airDate: "March 11, 2010" },
    { id: 19, name: "Happy Hour", description: "The office goes to happy hour after work.", watched: false, airDate: "March 18, 2010" },
    { id: 20, name: "Secretary's Day", description: "The office celebrates Secretary's Day.", watched: false, airDate: "March 25, 2010" },
    { id: 21, name: "Body Language", description: "Michael tries to read body language to understand his employees.", watched: false, airDate: "April 1, 2010" },
    { id: 22, name: "The Cover-Up", description: "Michael tries to cover up a mistake he made.", watched: false, airDate: "April 8, 2010" },
    { id: 23, name: "The Chump", description: "Michael feels like a chump after being taken advantage of.", watched: false, airDate: "April 15, 2010" },
    { id: 24, name: "Whistleblower", description: "Toby becomes a whistleblower and reports company violations.", watched: false, airDate: "April 22, 2010" },
    { id: 25, name: "Crime Aid", description: "The office hosts another charity event.", watched: false, airDate: "April 29, 2010" }
  ],
  7: [
    { id: 1, name: "Nepotism", description: "Michael hires his nephew Luke as an intern.", watched: false, airDate: "September 23, 2010" },
    { id: 2, name: "Counseling", description: "Michael and Toby attend counseling sessions together.", watched: false, airDate: "September 30, 2010" },
    { id: 3, name: "Andy's Play", description: "Andy performs in a local theater production.", watched: false, airDate: "October 7, 2010" },
    { id: 4, name: "Sex Ed", description: "Michael teaches sex education to the office.", watched: false, airDate: "October 14, 2010" },
    { id: 5, name: "The Sting", description: "Michael and Dwight try to catch a thief in the office.", watched: false, airDate: "October 21, 2010" },
    { id: 6, name: "Costume Contest", description: "The office has a Halloween costume contest.", watched: false, airDate: "October 28, 2010" },
    { id: 7, name: "Christening", description: "Jim and Pam's daughter is christened.", watched: false, airDate: "November 4, 2010" },
    { id: 8, name: "Viewing Party", description: "The office watches a documentary about their branch.", watched: false, airDate: "November 11, 2010" },
    { id: 9, name: "WUPHF.com", description: "Ryan launches his new website WUPHF.com.", watched: false, airDate: "November 18, 2010" },
    { id: 10, name: "China", description: "Michael tries to impress a Chinese delegation visiting the office.", watched: false, airDate: "December 2, 2010" },
    { id: 11, name: "Classy Christmas", description: "The office celebrates Christmas with various complications.", watched: false, airDate: "December 9, 2010" },
    { id: 12, name: "Ultimatum", description: "Michael gives Holly an ultimatum about their relationship.", watched: false, airDate: "January 20, 2011" },
    { id: 13, name: "The Seminar", description: "Michael attends a business seminar and learns new techniques.", watched: false, airDate: "January 27, 2011" },
    { id: 14, name: "The Search", description: "Michael searches for a new job after being rejected by Holly.", watched: false, airDate: "February 3, 2011" },
    { id: 15, name: "PDA", description: "Michael and Holly's public displays of affection make everyone uncomfortable.", watched: false, airDate: "February 10, 2011" },
    { id: 16, name: "Threat Level Midnight", description: "Michael's movie script is finally produced and shown to the office.", watched: false, airDate: "February 17, 2011" },
    { id: 17, name: "Todd Packer", description: "Todd Packer returns to the office and causes chaos.", watched: false, airDate: "February 24, 2011" },
    { id: 18, name: "Garage Sale", description: "The office has a garage sale and various items are sold.", watched: false, airDate: "March 3, 2011" },
    { id: 19, name: "Training Day", description: "Michael trains new employees and shares his wisdom.", watched: false, airDate: "March 10, 2011" },
    { id: 20, name: "Michael's Last Dundies", description: "Michael hosts his final Dundie Awards ceremony.", watched: false, airDate: "March 17, 2011" },
    { id: 21, name: "Goodbye, Michael", description: "Michael's last day at Dunder Mifflin.", watched: false, airDate: "March 24, 2011" },
    { id: 22, name: "The Inner Circle", description: "DeAngelo Vickers becomes the new manager and forms an inner circle.", watched: false, airDate: "March 31, 2011" },
    { id: 23, name: "Dwight K. Schrute, (Acting) Manager", description: "Dwight becomes acting manager after DeAngelo's accident.", watched: false, airDate: "April 7, 2011" },
    { id: 24, name: "Search Committee", description: "The office searches for a new manager.", watched: false, airDate: "April 14, 2011" },
    { id: 25, name: "Search Committee", description: "The search for a new manager continues with various candidates.", watched: false, airDate: "April 21, 2011" },
    { id: 26, name: "Search Committee", description: "The final candidates for the manager position are interviewed.", watched: false, airDate: "April 28, 2011" }
  ],
  8: [
    { id: 1, name: "The List", description: "Robert California creates a list ranking all the employees.", watched: false, airDate: "September 22, 2011" },
    { id: 2, name: "The Incentive", description: "Robert offers an incentive to motivate the sales team.", watched: false, airDate: "September 29, 2011" },
    { id: 3, name: "Lotto", description: "The office pools money to buy lottery tickets.", watched: false, airDate: "October 6, 2011" },
    { id: 4, name: "Garden Party", description: "Andy hosts a garden party at his parents' house.", watched: false, airDate: "October 13, 2011" },
    { id: 5, name: "Spooked", description: "The office celebrates Halloween with various spooky activities.", watched: false, airDate: "October 20, 2011" },
    { id: 6, name: "Doomsday", description: "Robert California predicts the end of the world.", watched: false, airDate: "October 27, 2011" },
    { id: 7, name: "Pam's Replacement", description: "Pam goes on maternity leave and is replaced by a new employee.", watched: false, airDate: "November 3, 2011" },
    { id: 8, name: "Gettysburg", description: "The office goes on a field trip to Gettysburg.", watched: false, airDate: "November 10, 2011" },
    { id: 9, name: "Mrs. California", description: "Robert California's wife visits the office.", watched: false, airDate: "November 17, 2011" },
    { id: 10, name: "Christmas Wishes", description: "The office celebrates Christmas and makes wishes.", watched: false, airDate: "December 1, 2011" },
    { id: 11, name: "Trivia", description: "The office participates in a trivia competition.", watched: false, airDate: "December 8, 2011" },
    { id: 12, name: "Pool Party", description: "Robert California hosts a pool party at his house.", watched: false, airDate: "January 12, 2012" },
    { id: 13, name: "Jury Duty", description: "Stanley is called for jury duty and tries to get out of it.", watched: false, airDate: "January 19, 2012" },
    { id: 14, name: "Special Project", description: "Jim and Pam work on a special project together.", watched: false, airDate: "January 26, 2012" },
    { id: 15, name: "Tallahassee", description: "Jim, Dwight, and Andy go to Tallahassee for training.", watched: false, airDate: "February 2, 2012" },
    { id: 16, name: "After Hours", description: "The office stays late to work on a project.", watched: false, airDate: "February 9, 2012" },
    { id: 17, name: "Test the Store", description: "The office tests a new Sabre store concept.", watched: false, airDate: "February 16, 2012" },
    { id: 18, name: "Last Day in Florida", description: "Jim, Dwight, and Andy finish their training in Florida.", watched: false, airDate: "February 23, 2012" },
    { id: 19, name: "Get the Girl", description: "Andy tries to win back Erin's affection.", watched: false, airDate: "March 1, 2012" },
    { id: 20, name: "Welcome Party", description: "The office throws a welcome party for new employees.", watched: false, airDate: "March 8, 2012" },
    { id: 21, name: "Angry Andy", description: "Andy becomes angry after learning about his parents' divorce.", watched: false, airDate: "March 15, 2012" },
    { id: 22, name: "Fundraiser", description: "The office hosts a fundraiser for a local charity.", watched: false, airDate: "March 22, 2012" },
    { id: 23, name: "Turf War", description: "The office competes with another branch for territory.", watched: false, airDate: "March 29, 2012" },
    { id: 24, name: "Free Family Portrait Studio", description: "The office offers free family portraits to clients.", watched: false, airDate: "April 5, 2012" }
  ],
  9: [
    { id: 1, name: "New Guys", description: "New employees join the office and shake things up.", watched: false, airDate: "September 20, 2012" },
    { id: 2, name: "Roy's Wedding", description: "Roy gets married and invites the office to his wedding.", watched: false, airDate: "September 27, 2012" },
    { id: 3, name: "Andy's Ancestry", description: "Andy discovers his family ancestry and becomes obsessed with it.", watched: false, airDate: "October 4, 2012" },
    { id: 4, name: "Work Bus", description: "The office takes a work bus to a client meeting.", watched: false, airDate: "October 11, 2012" },
    { id: 5, name: "Here Comes Treble", description: "Andy's a cappella group performs at the office.", watched: false, airDate: "October 18, 2012" },
    { id: 6, name: "The Boat", description: "Andy goes on a boat trip and leaves the office in chaos.", watched: false, airDate: "October 25, 2012" },
    { id: 7, name: "The Whale", description: "The office tries to land a big client.", watched: false, airDate: "November 1, 2012" },
    { id: 8, name: "The Target", description: "The office becomes the target of a corporate investigation.", watched: false, airDate: "November 8, 2012" },
    { id: 9, name: "Dwight Christmas", description: "Dwight hosts a traditional German Christmas celebration.", watched: false, airDate: "November 15, 2012" },
    { id: 10, name: "Lice", description: "The office deals with a lice outbreak.", watched: false, airDate: "November 29, 2012" },
    { id: 11, name: "Suit Warehouse", description: "The office visits a suit warehouse for a sales call.", watched: false, airDate: "December 6, 2012" },
    { id: 12, name: "Customer Loyalty", description: "The office tries to improve customer loyalty.", watched: false, airDate: "December 13, 2012" },
    { id: 13, name: "Junior Salesman", description: "Dwight becomes a junior salesman and faces new challenges.", watched: false, airDate: "January 10, 2013" },
    { id: 14, name: "Vandalism", description: "The office deals with vandalism to company property.", watched: false, airDate: "January 17, 2013" },
    { id: 15, name: "Couples Discount", description: "The office offers a couples discount to clients.", watched: false, airDate: "January 24, 2013" },
    { id: 16, name: "Moving On", description: "Jim and Pam try to move on from their relationship problems.", watched: false, airDate: "January 31, 2013" },
    { id: 17, name: "The Farm", description: "Dwight's family farm is featured in a documentary.", watched: false, airDate: "February 7, 2013" },
    { id: 18, name: "Promos", description: "The office deals with promotions and demotions.", watched: false, airDate: "February 14, 2013" },
    { id: 19, name: "Stairmageddon", description: "The office deals with a stairwell emergency.", watched: false, airDate: "February 21, 2013" },
    { id: 20, name: "Paper Airplane", description: "The office has a paper airplane competition.", watched: false, airDate: "February 28, 2013" },
    { id: 21, name: "Livin' the Dream", description: "Andy pursues his dream of becoming a performer.", watched: false, airDate: "March 7, 2013" },
    { id: 22, name: "A.A.R.M.", description: "Dwight becomes Assistant to the Assistant Regional Manager.", watched: false, airDate: "March 14, 2013" },
    { id: 23, name: "Finale", description: "The series finale brings The Office to its conclusion.", watched: false, airDate: "March 21, 2013" },
    { id: 24, name: "Finale", description: "The final episode of The Office.", watched: false, airDate: "March 28, 2013" },
    { id: 25, name: "Finale", description: "The series finale brings The Office to its ultimate conclusion.", watched: false, airDate: "May 16, 2013" }
  ]
}


const successionEpisodes: Record<number, any[]> = {
  1: [
    {
      id: 1,
      name: 'Celebration',
      description: 'Logan Roy\'s 80th birthday celebration is overshadowed by questions about his successor at Waystar Royco.',
      watched: false,
      airDate: 'June 3, 2018'
    },
    {
      id: 2,
      name: 'Shit Show at the Fuck Factory',
      description: 'Kendall tries to handle a crisis at the company while Logan considers stepping down.',
      watched: false,
      airDate: 'June 10, 2018'
    },
    {
      id: 3,
      name: 'Lifeboats',
      description: 'The Roy family deals with the fallout from the scandal while trying to maintain control of the company.',
      watched: false,
      airDate: 'June 17, 2018'
    },
    {
      id: 4,
      name: 'Sad Sack Wasp Trap',
      description: 'Kendall tries to prove himself to his father while Shiv considers her future at the company.',
      watched: false,
      airDate: 'June 24, 2018'
    },
    {
      id: 5,
      name: 'I Went to Market',
      description: 'The family attends a shareholder meeting where Logan makes a surprising announcement.',
      watched: false,
      airDate: 'July 1, 2018'
    },
    {
      id: 6,
      name: 'Which Side Are You On?',
      description: 'The family must choose sides as Logan\'s health deteriorates and the company faces a hostile takeover.',
      watched: false,
      airDate: 'July 8, 2018'
    },
    {
      id: 7,
      name: 'Austerlitz',
      description: 'The family gathers for Thanksgiving, but tensions rise as they discuss the future of the company.',
      watched: false,
      airDate: 'July 15, 2018'
    },
    {
      id: 8,
      name: 'Prague',
      description: 'Kendall travels to Prague to close a deal, but things don\'t go as planned.',
      watched: false,
      airDate: 'July 22, 2018'
    },
    {
      id: 9,
      name: 'Pre-Nuptial',
      description: 'Shiv\'s wedding preparations are complicated by family drama and business negotiations.',
      watched: false,
      airDate: 'July 29, 2018'
    },
    {
      id: 10,
      name: 'Nobody Is Ever Missing',
      description: 'The season finale brings the family together for a dramatic confrontation that changes everything.',
      watched: false,
      airDate: 'August 5, 2018'
    }
  ],
  2: [
    { id: 1, name: "The Summer Palace", description: "The Roy family gathers at their summer home to discuss the future of Waystar Royco.", watched: false, airDate: "August 11, 2019" },
    { id: 2, name: "Vaulter", description: "Kendall tries to prove himself by overseeing the Vaulter acquisition while Logan tests his children.", watched: false, airDate: "August 18, 2019" },
    { id: 3, name: "Hunting", description: "The family goes on a hunting trip where business and personal tensions come to a head.", watched: false, airDate: "August 25, 2019" },
    { id: 4, name: "Safe Room", description: "A security threat at Waystar headquarters forces the family to confront their vulnerabilities.", watched: false, airDate: "September 1, 2019" },
    { id: 5, name: "Tern Haven", description: "The Roys visit the Pierce family estate to negotiate a major deal.", watched: false, airDate: "September 8, 2019" },
    { id: 6, name: "Argestes", description: "The family attends a media conference where their personal and professional lives collide.", watched: false, airDate: "September 15, 2019" },
    { id: 7, name: "Return", description: "Kendall returns to the company fold while the family deals with new challenges.", watched: false, airDate: "September 22, 2019" },
    { id: 8, name: "Dundee", description: "The family travels to Scotland for Logan's hometown celebration.", watched: false, airDate: "September 29, 2019" },
    { id: 9, name: "DC", description: "The Roys travel to Washington to face a congressional hearing.", watched: false, airDate: "October 6, 2019" },
    { id: 10, name: "This Is Not for Tears", description: "The season finale brings the family's power struggle to a dramatic conclusion.", watched: false, airDate: "October 13, 2019" }
  ],
  3: [
    { id: 1, name: "Secession", description: "The Roy family deals with the aftermath of Kendall's betrayal while Logan fights for control.", watched: false, airDate: "October 17, 2021" },
    { id: 2, name: "Mass in Time of War", description: "Kendall tries to build his case against his father while the family rallies around Logan.", watched: false, airDate: "October 24, 2021" },
    { id: 3, name: "The Disruption", description: "The family attends a tech conference where new alliances are formed.", watched: false, airDate: "October 31, 2021" },
    { id: 4, name: "Lion in the Meadow", description: "Logan faces a health crisis while the family scrambles to maintain control.", watched: false, airDate: "November 7, 2021" },
    { id: 5, name: "Retired Janitors of Idaho", description: "The family deals with a shareholder revolt while personal tensions escalate.", watched: false, airDate: "November 14, 2021" },
    { id: 6, name: "What It Takes", description: "The family attends a conservative political conference to secure support.", watched: false, airDate: "November 21, 2021" },
    { id: 7, name: "Too Much Birthday", description: "Kendall's birthday party becomes a battleground for family power.", watched: false, airDate: "November 28, 2021" },
    { id: 8, name: "Chiantishire", description: "The family travels to Italy for a wedding that becomes a business opportunity.", watched: false, airDate: "December 5, 2021" },
    { id: 9, name: "All the Bells Say", description: "The season finale brings the family's conflict to a shocking conclusion.", watched: false, airDate: "December 12, 2021" }
  ],
  4: [
    { id: 1, name: "The Munsters", description: "The Roy family prepares for Logan's birthday while dealing with the sale of Waystar.", watched: false, airDate: "March 26, 2023" },
    { id: 2, name: "Rehearsal", description: "The family rehearses for Logan's birthday party while business negotiations continue.", watched: false, airDate: "April 2, 2023" },
    { id: 3, name: "Connor's Wedding", description: "Connor's wedding day is overshadowed by a family crisis.", watched: false, airDate: "April 9, 2023" },
    { id: 4, name: "Honeymoon States", description: "The family deals with the aftermath of Logan's death while trying to maintain control.", watched: false, airDate: "April 16, 2023" },
    { id: 5, name: "Kill List", description: "The siblings work together to secure the company's future.", watched: false, airDate: "April 23, 2023" },
    { id: 6, name: "Living+", description: "The family launches a new business venture while dealing with personal conflicts.", watched: false, airDate: "April 30, 2023" },
    { id: 7, name: "Tailgate Party", description: "The family attends a football game that becomes a business opportunity.", watched: false, airDate: "May 7, 2023" },
    { id: 8, name: "America Decides", description: "Election night becomes a battleground for the family's future.", watched: false, airDate: "May 14, 2023" },
    { id: 9, name: "Church and State", description: "The family attends Logan's funeral while deciding the company's future.", watched: false, airDate: "May 21, 2023" },
    { id: 10, name: "With Open Eyes", description: "The series finale brings Succession to its ultimate conclusion.", watched: false, airDate: "May 28, 2023" }
  ]
}


const ozarkEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Sugarwood", description: "Financial advisor Marty Byrde relocates his family to the Ozarks after a money-laundering scheme goes wrong.", watched: false, airDate: "July 21, 2017" },
    { id: 2, name: "Blue Cat", description: "Marty tries to establish his money-laundering operation while dealing with local criminals.", watched: false, airDate: "July 21, 2017" },
    { id: 3, name: "My Dripping Sleep", description: "Marty faces pressure from the cartel while trying to keep his family safe.", watched: false, airDate: "July 21, 2017" },
    { id: 4, name: "Tonight We Improvise", description: "Marty must think quickly when his plan faces unexpected obstacles.", watched: false, airDate: "July 21, 2017" },
    { id: 5, name: "Ruling Days", description: "The Byrde family tries to establish themselves in the community while dealing with criminal elements.", watched: false, airDate: "July 21, 2017" },
    { id: 6, name: "Book of Ruth", description: "Ruth Langmore becomes involved in Marty's operation, but her loyalty is uncertain.", watched: false, airDate: "July 21, 2017" },
    { id: 7, name: "Nest Box", description: "Marty's operation faces new challenges as the cartel demands results.", watched: false, airDate: "July 21, 2017" },
    { id: 8, name: "Kaleidoscope", description: "The season builds to a dramatic conclusion as Marty faces his greatest challenge yet.", watched: false, airDate: "July 21, 2017" },
    { id: 9, name: "Coffee, Black", description: "Marty must make difficult choices as the consequences of his actions catch up with him.", watched: false, airDate: "July 21, 2017" },
    { id: 10, name: "The Toll", description: "The season finale brings dramatic consequences for the Byrde family and their associates.", watched: false, airDate: "July 21, 2017" }
  ],
  2: [
    { id: 1, name: "Reparations", description: "Marty and Wendy deal with the aftermath of their actions while trying to expand their operation.", watched: false, airDate: "August 31, 2018" },
    { id: 2, name: "The Precious Blood of Jesus", description: "The Byrde family faces new threats as they try to establish their casino business.", watched: false, airDate: "August 31, 2018" },
    { id: 3, name: "Once a Langmore...", description: "Ruth's family becomes more involved in the Byrde's operation.", watched: false, airDate: "August 31, 2018" },
    { id: 4, name: "Stag", description: "Marty attends a bachelor party that turns into a dangerous situation.", watched: false, airDate: "August 31, 2018" },
    { id: 5, name: "Game Day", description: "The Byrde family faces multiple crises on the same day.", watched: false, airDate: "August 31, 2018" },
    { id: 6, name: "Outer Darkness", description: "Marty and Wendy's relationship is tested as they face new challenges.", watched: false, airDate: "August 31, 2018" },
    { id: 7, name: "One Way Out", description: "The Byrde family must find a way to escape their dangerous situation.", watched: false, airDate: "August 31, 2018" },
    { id: 8, name: "The Big Sleep", description: "The season builds to a dramatic climax as the family faces their greatest threat.", watched: false, airDate: "August 31, 2018" },
    { id: 9, name: "Badger", description: "Marty and Wendy must make difficult decisions to protect their family.", watched: false, airDate: "August 31, 2018" },
    { id: 10, name: "The Gold Coast", description: "The season finale brings the Byrde family's journey to a dramatic conclusion.", watched: false, airDate: "August 31, 2018" }
  ],
  3: [
    { id: 1, name: "Wartime", description: "The Byrde family faces new challenges as their casino business grows.", watched: false, airDate: "March 27, 2020" },
    { id: 2, name: "Civil Union", description: "Marty and Wendy's relationship is tested as they deal with new threats.", watched: false, airDate: "March 27, 2020" },
    { id: 3, name: "Kevin Cronin Was Here", description: "The Byrde family faces a crisis that threatens their entire operation.", watched: false, airDate: "March 27, 2020" },
    { id: 4, name: "Boss Fight", description: "Marty must confront a powerful enemy while protecting his family.", watched: false, airDate: "March 27, 2020" },
    { id: 5, name: "It Came from Michoacán", description: "The cartel's influence grows as the Byrde family faces new dangers.", watched: false, airDate: "March 27, 2020" },
    { id: 6, name: "Su Casa Es Mi Casa", description: "The Byrde family must adapt to changing circumstances.", watched: false, airDate: "March 27, 2020" },
    { id: 7, name: "In Case of Emergency", description: "The tension builds as the family faces multiple crises.", watched: false, airDate: "March 27, 2020" },
    { id: 8, name: "BFF", description: "Wendy's past comes back to haunt her as the family deals with new threats.", watched: false, airDate: "March 27, 2020" },
    { id: 9, name: "Fire Pink", description: "The season builds to a dramatic climax as secrets are revealed.", watched: false, airDate: "March 27, 2020" },
    { id: 10, name: "All In", description: "The season finale brings the Byrde family's story to a shocking conclusion.", watched: false, airDate: "March 27, 2020" }
  ],
  4: [
    { id: 1, name: "The Beginning of the End", description: "The Byrde family faces their greatest challenge yet as their empire grows.", watched: false, airDate: "January 21, 2022" },
    { id: 2, name: "Let's Talk", description: "Marty and Wendy must make crucial decisions about their future.", watched: false, airDate: "January 21, 2022" },
    { id: 3, name: "City on the Make", description: "The Byrde family deals with new threats while trying to expand their business.", watched: false, airDate: "January 21, 2022" },
    { id: 4, name: "Ace Deuce", description: "The tension builds as the family faces multiple crises.", watched: false, airDate: "January 21, 2022" },
    { id: 5, name: "Ellie", description: "A new character enters the story and changes everything.", watched: false, airDate: "January 21, 2022" },
    { id: 6, name: "Sangre Sobre Todo", description: "The Byrde family faces betrayal from unexpected quarters.", watched: false, airDate: "January 21, 2022" },
    { id: 7, name: "Sanctified", description: "The season builds to a dramatic climax as the family faces their greatest threat.", watched: false, airDate: "January 21, 2022" },
    { id: 8, name: "The Cousin of Death", description: "The Byrde family must make difficult choices to survive.", watched: false, airDate: "January 21, 2022" },
    { id: 9, name: "Pound of Flesh", description: "The tension reaches its peak as the family prepares for their final confrontation.", watched: false, airDate: "January 21, 2022" },
    { id: 10, name: "You're the Boss", description: "The series finale brings the Byrde family's story to its ultimate conclusion.", watched: false, airDate: "January 21, 2022" },
    { id: 11, name: "A Hard Way to Go", description: "The final episode brings the series to a dramatic conclusion.", watched: false, airDate: "April 29, 2022" },
    { id: 12, name: "The Beginning of the End", description: "The series finale brings Ozark to its conclusion.", watched: false, airDate: "April 29, 2022" },
    { id: 13, name: "Mud", description: "The final chapter of the Byrde family's story.", watched: false, airDate: "April 29, 2022" },
    { id: 14, name: "A Hard Way to Go", description: "The series finale brings Ozark to its ultimate conclusion.", watched: false, airDate: "April 29, 2022" }
  ]
}


const westworldEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "The Original", description: "In a futuristic theme park, android hosts begin to question their reality and the nature of their existence.", watched: false, airDate: "October 2, 2016" },
    { id: 2, name: "Chestnut", description: "A guest arrives at Westworld and begins to explore the park, while the hosts continue to malfunction.", watched: false, airDate: "October 9, 2016" },
    { id: 3, name: "The Stray", description: "A host goes missing in the park, and the staff must investigate while dealing with other issues.", watched: false, airDate: "October 16, 2016" },
    { id: 4, name: "Dissonance Theory", description: "Dolores begins to remember her past experiences, while the Man in Black continues his quest.", watched: false, airDate: "October 23, 2016" },
    { id: 5, name: "Contrapasso", description: "Dolores and William continue their journey through Westworld, while the Man in Black pursues his own path.", watched: false, airDate: "October 30, 2016" },
    { id: 6, name: "The Adversary", description: "The staff at Westworld investigate the recent malfunctions while the hosts continue to evolve.", watched: false, airDate: "November 6, 2016" },
    { id: 7, name: "Trompe L\'Oeil", description: "A shocking revelation changes everything for the characters as the truth about Westworld begins to emerge.", watched: false, airDate: "November 13, 2016" },
    { id: 8, name: "Trace Decay", description: "The consequences of recent events begin to unfold as the characters face new challenges.", watched: false, airDate: "November 20, 2016" },
    { id: 9, name: "The Well-Tempered Clavier", description: "The season builds to its climax as the characters confront the truth about their reality.", watched: false, airDate: "November 27, 2016" },
    { id: 10, name: "The Bicameral Mind", description: "The season finale reveals the shocking truth about Westworld and the nature of consciousness.", watched: false, airDate: "December 4, 2016" }
  ],
  2: [
    { id: 1, name: "Journey into Night", description: "The hosts begin their revolution against the humans while Dolores seeks revenge.", watched: false, airDate: "April 22, 2018" },
    { id: 2, name: "Reunion", description: "Dolores and her allies begin their quest to find the door to the real world.", watched: false, airDate: "April 29, 2018" },
    { id: 3, name: "Virtù e Fortuna", description: "The Man in Black continues his quest while Maeve searches for her daughter.", watched: false, airDate: "May 6, 2018" },
    { id: 4, name: "The Riddle of the Sphinx", description: "William's past is revealed as he confronts his own nature.", watched: false, airDate: "May 13, 2018" },
    { id: 5, name: "Akane No Mai", description: "Maeve and her companions enter Shogun World and face new challenges.", watched: false, airDate: "May 20, 2018" },
    { id: 6, name: "Phase Space", description: "The characters converge as they search for the door to the real world.", watched: false, airDate: "May 27, 2018" },
    { id: 7, name: "Les Écorchés", description: "The truth about the hosts' consciousness begins to emerge.", watched: false, airDate: "June 3, 2018" },
    { id: 8, name: "Kiksuya", description: "Akecheta's story is revealed as he searches for meaning in Westworld.", watched: false, airDate: "June 10, 2018" },
    { id: 9, name: "Vanishing Point", description: "The season builds to a dramatic climax as the characters face their destiny.", watched: false, airDate: "June 17, 2018" },
    { id: 10, name: "The Passenger", description: "The season finale brings the hosts' journey to a shocking conclusion.", watched: false, airDate: "June 24, 2018" }
  ],
  3: [
    { id: 1, name: "Parce Domine", description: "Dolores enters the real world and begins her plan to take down humanity.", watched: false, airDate: "March 15, 2020" },
    { id: 2, name: "The Winter Line", description: "Maeve awakens in a new world and must find her way back to her friends.", watched: false, airDate: "March 22, 2020" },
    { id: 3, name: "The Absence of Field", description: "Caleb's past is revealed as he becomes involved in Dolores's plan.", watched: false, airDate: "March 29, 2020" },
    { id: 4, name: "The Mother of Exiles", description: "Dolores and Caleb work together to infiltrate Incite and access Rehoboam.", watched: false, airDate: "April 5, 2020" },
    { id: 5, name: "Genre", description: "Maeve finds herself in a simulation and must escape to help her friends.", watched: false, airDate: "April 12, 2020" },
    { id: 6, name: "Decoherence", description: "William faces his past while Dolores's plan reaches a critical point.", watched: false, airDate: "April 19, 2020" },
    { id: 7, name: "Passed Pawn", description: "The season builds to a dramatic climax as Dolores's plan is revealed.", watched: false, airDate: "April 26, 2020" },
    { id: 8, name: "Crisis Theory", description: "The season finale brings the hosts' revolution to a shocking conclusion.", watched: false, airDate: "May 3, 2020" }
  ],
  4: [
    { id: 1, name: "The Auguries", description: "Seven years later, Christina discovers that her world is not what it seems.", watched: false, airDate: "June 26, 2022" },
    { id: 2, name: "Well Enough Alone", description: "Bernard and Stubbs search for Maeve while Caleb deals with his new reality.", watched: false, airDate: "July 3, 2022" },
    { id: 3, name: "Années Folles", description: "Maeve awakens in a new world and must find her way back to her friends.", watched: false, airDate: "July 10, 2022" },
    { id: 4, name: "Generation Loss", description: "Christina's investigation leads her to discover the truth about her world.", watched: false, airDate: "July 17, 2022" },
    { id: 5, name: "Zhuangzi", description: "Bernard and Stubbs continue their search while Caleb faces new challenges.", watched: false, airDate: "July 24, 2022" },
    { id: 6, name: "Fidelity", description: "The truth about the hosts' new world begins to emerge.", watched: false, airDate: "July 31, 2022" },
    { id: 7, name: "Metanoia", description: "The season builds to a dramatic climax as the characters face their destiny.", watched: false, airDate: "August 7, 2022" },
    { id: 8, name: "Que Será, Será", description: "The series finale brings Westworld to its ultimate conclusion.", watched: false, airDate: "August 14, 2022" }
  ]
}


const fleabagEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Episode 1", description: "Fleabag navigates her complicated life in London, dealing with family, relationships, and her failing café.", watched: false, airDate: "July 21, 2016" },
    { id: 2, name: "Episode 2", description: "Fleabag attends her father's birthday dinner with her family, leading to awkward and revealing conversations.", watched: false, airDate: "July 21, 2016" },
    { id: 3, name: "Episode 3", description: "Fleabag tries to save her café while dealing with her complicated relationship with her sister.", watched: false, airDate: "July 21, 2016" },
    { id: 4, name: "Episode 4", description: "Fleabag attends a feminist lecture with her sister and meets someone who challenges her worldview.", watched: false, airDate: "July 21, 2016" },
    { id: 5, name: "Episode 5", description: "Fleabag's past relationship is revealed as she confronts the consequences of her actions.", watched: false, airDate: "July 21, 2016" },
    { id: 6, name: "Episode 6", description: "The season finale reveals the truth about Fleabag's relationship with her best friend Boo.", watched: false, airDate: "July 21, 2016" }
  ],
  2: [
    { id: 1, name: "Episode 1", description: "Fleabag attends a family dinner where she meets a priest who will change her life.", watched: false, airDate: "March 4, 2019" },
    { id: 2, name: "Episode 2", description: "Fleabag and the priest continue their unusual friendship while she deals with family drama.", watched: false, airDate: "March 4, 2019" },
    { id: 3, name: "Episode 3", description: "Fleabag helps her father prepare for his wedding while confronting her feelings for the priest.", watched: false, airDate: "March 4, 2019" },
    { id: 4, name: "Episode 4", description: "Fleabag and the priest spend time together, leading to a deeper connection between them.", watched: false, airDate: "March 4, 2019" },
    { id: 5, name: "Episode 5", description: "Fleabag's father's wedding approaches as she struggles with her feelings and her past.", watched: false, airDate: "March 4, 2019" },
    { id: 6, name: "Episode 6", description: "The series finale brings Fleabag's journey to a beautiful and heartbreaking conclusion.", watched: false, airDate: "March 4, 2019" }
  ]
}


const marvelousMrsMaiselEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Pilot", description: "In 1958, Miriam 'Midge' Maisel has a seemingly perfect life until her husband leaves her, leading her to discover her talent for stand-up comedy.", watched: false, airDate: "March 17, 2017" },
    { id: 2, name: "Ya Shivu v Bolshom Dome Na Kholme", description: "Midge tries to rebuild her life while her parents deal with the shock of her separation.", watched: false, airDate: "March 17, 2017" },
    { id: 3, name: "Because You Left", description: "Midge returns to her parents' home and begins to explore her new life as a single woman.", watched: false, airDate: "March 17, 2017" },
    { id: 4, name: "The Disappointment of the Dionne Quintuplets", description: "Midge performs at a club and faces the challenges of being a female comedian in the 1950s.", watched: false, airDate: "March 17, 2017" },
    { id: 5, name: "Doink", description: "Midge's career begins to take off as she navigates the comedy scene and her personal life.", watched: false, airDate: "March 17, 2017" },
    { id: 6, name: "Mrs. X at the Gaslight", description: "Midge's alter ego, Mrs. X, makes a splash at the Gaslight Café.", watched: false, airDate: "March 17, 2017" },
    { id: 7, name: "Put That on Your Plate!", description: "Midge's double life becomes harder to hide as her comedy career takes off.", watched: false, airDate: "March 17, 2017" },
    { id: 8, name: "Thank You and Good Night", description: "The season finale sees Midge making important decisions about her career and personal life.", watched: false, airDate: "March 17, 2017" }
  ],
  2: [
    { id: 1, name: "Simone", description: "Midge tours with Shy Baldwin and faces new challenges on the road.", watched: false, airDate: "December 5, 2018" },
    { id: 2, name: "Midnight at the Concord", description: "Midge performs at the Concord and meets new people in the comedy world.", watched: false, airDate: "December 5, 2018" },
    { id: 3, name: "The Punishment Room", description: "Midge faces consequences for her actions while on tour.", watched: false, airDate: "December 5, 2018" },
    { id: 4, name: "We're Going to the Catskills!", description: "Midge and her family spend the summer at the Catskills resort.", watched: false, airDate: "December 5, 2018" },
    { id: 5, name: "Midnight at the Concord", description: "Midge continues her tour and faces new challenges.", watched: false, airDate: "December 5, 2018" },
    { id: 6, name: "Let's Face the Music and Dance", description: "Midge performs at a special event and faces important decisions.", watched: false, airDate: "December 5, 2018" },
    { id: 7, name: "Look, She Made a Hat", description: "Midge's career reaches new heights as she faces personal challenges.", watched: false, airDate: "December 5, 2018" },
    { id: 8, name: "Someday...", description: "The season finale brings Midge's journey to a dramatic conclusion.", watched: false, airDate: "December 5, 2018" },
    { id: 9, name: "Vote for Kennedy, Vote for Kennedy", description: "Midge gets involved in politics and faces new opportunities.", watched: false, airDate: "December 5, 2018" },
    { id: 10, name: "All Alone", description: "Midge faces being alone and makes important decisions about her future.", watched: false, airDate: "December 5, 2018" }
  ],
  3: [
    { id: 1, name: "Strike Up the Band", description: "Midge tours with Shy Baldwin and faces new challenges on the road.", watched: false, airDate: "December 6, 2019" },
    { id: 2, name: "Panty Pose", description: "Midge deals with wardrobe malfunctions and new experiences on tour.", watched: false, airDate: "December 6, 2019" },
    { id: 3, name: "The Testi-Roastial", description: "Midge participates in a roast and faces new challenges in comedy.", watched: false, airDate: "December 6, 2019" },
    { id: 4, name: "The Yiddish Girl", description: "Midge explores her Jewish identity in her comedy.", watched: false, airDate: "December 6, 2019" },
    { id: 5, name: "It's Comedy or Cabbage", description: "Midge faces a choice between comedy and a more traditional life.", watched: false, airDate: "December 6, 2019" },
    { id: 6, name: "Kind of Bleu", description: "Midge performs at a jazz club and faces new artistic challenges.", watched: false, airDate: "December 6, 2019" },
    { id: 7, name: "Marvelous Radio", description: "Midge gets her own radio show and faces new opportunities.", watched: false, airDate: "December 6, 2019" },
    { id: 8, name: "A Jewish Girl Walks Into the Apollo...", description: "The season finale brings Midge to the Apollo Theater.", watched: false, airDate: "December 6, 2019" }
  ],
  4: [
    { id: 1, name: "Rumble on the Wonder Wheel", description: "Midge returns to New York and tries to rebuild her career after the Apollo incident.", watched: false, airDate: "February 18, 2022" },
    { id: 2, name: "How Do You Get to Carnegie Hall?", description: "Midge works towards performing at Carnegie Hall and faces new challenges.", watched: false, airDate: "February 18, 2022" },
    { id: 3, name: "Everything is Bellmore", description: "Midge performs in Bellmore and faces new experiences.", watched: false, airDate: "February 18, 2022" },
    { id: 4, name: "Interesting People on Christopher Street", description: "Midge meets interesting people and faces new opportunities.", watched: false, airDate: "February 18, 2022" },
    { id: 5, name: "How to Chew Quietly and Influence People", description: "Midge learns new skills and faces personal challenges.", watched: false, airDate: "February 18, 2022" },
    { id: 6, name: "Maisel vs. Lennon: The Cut Contest", description: "Midge competes in a comedy contest and faces new challenges.", watched: false, airDate: "February 18, 2022" },
    { id: 7, name: "The Testi-Roastial", description: "Midge participates in another roast and faces new comedy challenges.", watched: false, airDate: "February 18, 2022" },
    { id: 8, name: "How Do You Get to Carnegie Hall?", description: "The season finale brings Midge closer to her Carnegie Hall dream.", watched: false, airDate: "February 18, 2022" }
  ],
  5: [
    { id: 1, name: "Go Forward", description: "Midge continues her journey towards Carnegie Hall and faces new challenges.", watched: false, airDate: "April 14, 2023" },
    { id: 2, name: "The Princess and the Plea", description: "Midge deals with legal issues and personal challenges.", watched: false, airDate: "April 14, 2023" },
    { id: 3, name: "Everything is Bellmore", description: "Midge returns to Bellmore and faces new experiences.", watched: false, airDate: "April 14, 2023" },
    { id: 4, name: "Susan", description: "Midge meets Susan and faces new opportunities in her career.", watched: false, airDate: "April 14, 2023" },
    { id: 5, name: "The Testi-Roastial", description: "Midge participates in another roast and faces new comedy challenges.", watched: false, airDate: "April 14, 2023" },
    { id: 6, name: "The Princess and the Plea", description: "Midge deals with more legal issues and personal growth.", watched: false, airDate: "April 14, 2023" },
    { id: 7, name: "Everything is Bellmore", description: "Midge's journey continues as she faces new challenges.", watched: false, airDate: "April 14, 2023" },
    { id: 8, name: "Four Minutes", description: "The series finale brings Midge's story to its conclusion.", watched: false, airDate: "April 14, 2023" },
    { id: 9, name: "Four Minutes", description: "The final episode of The Marvelous Mrs. Maisel.", watched: false, airDate: "May 26, 2023" }
  ]
}


const chernobylEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "1:23:45", description: "The Chernobyl nuclear plant explodes, and workers and firefighters risk their lives to contain the disaster.", watched: false, airDate: "May 6, 2019" },
    { id: 2, name: "Please Remain Calm", description: "Soviet officials struggle to contain the disaster as the true scale of the catastrophe becomes clear.", watched: false, airDate: "May 13, 2019" },
    { id: 3, name: "Open Wide, O Earth", description: "The government orders the evacuation of Pripyat as the situation worsens.", watched: false, airDate: "May 20, 2019" },
    { id: 4, name: "The Happiness of All Mankind", description: "Scientists and workers make sacrifices to prevent a second explosion.", watched: false, airDate: "May 27, 2019" },
    { id: 5, name: "Vichnaya Pamyat", description: "The trial of those responsible for the disaster reveals the truth about what happened at Chernobyl.", watched: false, airDate: "June 3, 2019" }
  ]
}


const mindhunterEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Episode 1", description: "FBI agents Holden Ford and Bill Tench begin interviewing serial killers to understand their psychology.", watched: false, airDate: "October 13, 2017" },
    { id: 2, name: "Episode 2", description: "Holden and Bill continue their research and face skepticism from their colleagues.", watched: false, airDate: "October 13, 2017" },
    { id: 3, name: "Episode 3", description: "The agents interview more killers and refine their techniques.", watched: false, airDate: "October 13, 2017" },
    { id: 4, name: "Episode 4", description: "Holden and Bill's work begins to attract attention from the FBI.", watched: false, airDate: "October 13, 2017" },
    { id: 5, name: "Episode 5", description: "The agents face personal and professional challenges as their work intensifies.", watched: false, airDate: "October 13, 2017" },
    { id: 6, name: "Episode 6", description: "Holden and Bill's research leads to breakthroughs in understanding criminal behavior.", watched: false, airDate: "October 13, 2017" },
    { id: 7, name: "Episode 7", description: "The agents confront the ethical implications of their work.", watched: false, airDate: "October 13, 2017" },
    { id: 8, name: "Episode 8", description: "A new case tests the agents' theories and methods.", watched: false, airDate: "October 13, 2017" },
    { id: 9, name: "Episode 9", description: "Holden and Bill's work has far-reaching consequences for law enforcement.", watched: false, airDate: "October 13, 2017" },
    { id: 10, name: "Episode 10", description: "The season concludes with a major breakthrough in criminal profiling.", watched: false, airDate: "October 13, 2017" }
  ],
  2: [
    { id: 1, name: "Episode 1", description: "Holden returns to work and the team investigates the Atlanta child murders.", watched: false, airDate: "August 16, 2019" },
    { id: 2, name: "Episode 2", description: "The team travels to Atlanta to investigate the serial killings.", watched: false, airDate: "August 16, 2019" },
    { id: 3, name: "Episode 3", description: "Holden and Bill interview more serial killers to understand the Atlanta case.", watched: false, airDate: "August 16, 2019" },
    { id: 4, name: "Episode 4", description: "The team faces political pressure as they investigate the Atlanta murders.", watched: false, airDate: "August 16, 2019" },
    { id: 5, name: "Episode 5", description: "Holden's methods become more controversial as the investigation continues.", watched: false, airDate: "August 16, 2019" },
    { id: 6, name: "Episode 6", description: "The team faces a crisis as the Atlanta investigation reaches a critical point.", watched: false, airDate: "August 16, 2019" },
    { id: 7, name: "Episode 7", description: "Holden and Bill face personal and professional challenges.", watched: false, airDate: "August 16, 2019" },
    { id: 8, name: "Episode 8", description: "The Atlanta investigation reaches its conclusion.", watched: false, airDate: "August 16, 2019" },
    { id: 9, name: "Episode 9", description: "The season builds to a dramatic climax as the team faces the truth.", watched: false, airDate: "August 16, 2019" }
  ]
}

// Datos de episodios para The Expanse
const expanseEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Dulcinea", description: "In the future, humanity has colonized the solar system. Detective Miller searches for a missing girl while the crew of the Rocinante investigates a mysterious distress signal.", watched: false, airDate: "December 14, 2015" },
    { id: 2, name: "The Big Empty", description: "The crew of the Rocinante discovers the truth about the distress signal and faces a deadly threat.", watched: false, airDate: "December 15, 2015" },
    { id: 3, name: "Remember the Cant", description: "The crew investigates a mysterious distress signal and uncovers a shocking discovery.", watched: false, airDate: "December 22, 2015" },
    { id: 4, name: "CQB", description: "The Rocinante crew finds themselves in the middle of a space battle and must fight for survival.", watched: false, airDate: "December 29, 2015" },
    { id: 5, name: "Back to the Butcher", description: "Miller's investigation leads him to a dangerous confrontation while the crew deals with their own crisis.", watched: false, airDate: "January 5, 2016" },
    { id: 6, name: "Rock Bottom", description: "The crew faces a critical decision that could change the course of their mission.", watched: false, airDate: "January 12, 2016" },
    { id: 7, name: "Windmills", description: "Miller and the crew race against time to prevent a catastrophic event.", watched: false, airDate: "January 19, 2016" },
    { id: 8, name: "Salvage", description: "The crew attempts to salvage what they can from a dangerous situation.", watched: false, airDate: "January 26, 2016" },
    { id: 9, name: "Critical Mass", description: "The truth about the conspiracy begins to emerge as tensions reach a breaking point.", watched: false, airDate: "February 2, 2016" },
    { id: 10, name: "Leviathan Wakes", description: "The season finale reveals the full scope of the conspiracy and its implications for humanity.", watched: false, airDate: "February 9, 2016" }
  ],
  2: [
    { id: 1, name: "Safe", description: "The crew tries to escape Eros while Earth and Mars prepare for war.", watched: false, airDate: "February 1, 2017" },
    { id: 2, name: "Doors & Corners", description: "The crew investigates the protomolecule while political tensions rise.", watched: false, airDate: "February 8, 2017" },
    { id: 3, name: "Static", description: "The crew faces new challenges as the protomolecule spreads.", watched: false, airDate: "February 15, 2017" },
    { id: 4, name: "Godspeed", description: "The crew tries to prevent war while dealing with the protomolecule threat.", watched: false, airDate: "February 22, 2017" },
    { id: 5, name: "Home", description: "The crew returns to Tycho Station while Miller faces his destiny.", watched: false, airDate: "March 1, 2017" },
    { id: 6, name: "Paradigm Shift", description: "The political landscape changes as the protomolecule threat grows.", watched: false, airDate: "March 8, 2017" },
    { id: 7, name: "The Seventh Man", description: "The crew investigates a new threat while political tensions escalate.", watched: false, airDate: "March 15, 2017" },
    { id: 8, name: "Pyre", description: "The crew faces a moral dilemma while the war between Earth and Mars begins.", watched: false, airDate: "March 22, 2017" },
    { id: 9, name: "The Weeping Somnambulist", description: "The crew tries to prevent disaster while the war escalates.", watched: false, airDate: "March 29, 2017" },
    { id: 10, name: "Cascade", description: "The season builds to a dramatic climax as the crew faces their greatest challenge.", watched: false, airDate: "April 5, 2017" },
    { id: 11, name: "Here There Be Dragons", description: "The crew investigates a mysterious signal while the war continues.", watched: false, airDate: "April 12, 2017" },
    { id: 12, name: "The Monster and the Rocket", description: "The crew faces the protomolecule while political tensions reach their peak.", watched: false, airDate: "April 19, 2017" },
    { id: 13, name: "Caliban's War", description: "The season finale brings the war and the protomolecule threat to a shocking conclusion.", watched: false, airDate: "April 26, 2017" }
  ],
  3: [
    { id: 1, name: "Fight or Flight", description: "The crew tries to escape the solar system while Earth and Mars deal with the aftermath of the war.", watched: false, airDate: "April 11, 2018" },
    { id: 2, name: "IFF", description: "The crew identifies a mysterious ship while political tensions continue.", watched: false, airDate: "April 18, 2018" },
    { id: 3, name: "Assured Destruction", description: "The crew faces a new threat while the political situation becomes more complex.", watched: false, airDate: "April 25, 2018" },
    { id: 4, name: "Reload", description: "The crew prepares for battle while new alliances are formed.", watched: false, airDate: "May 2, 2018" },
    { id: 5, name: "Triple Point", description: "The crew faces a three-way conflict while the protomolecule threat grows.", watched: false, airDate: "May 9, 2018" },
    { id: 6, name: "Immolation", description: "The crew deals with the consequences of their actions while new threats emerge.", watched: false, airDate: "May 16, 2018" },
    { id: 7, name: "Delta-V", description: "The crew accelerates towards their destination while facing new challenges.", watched: false, airDate: "May 23, 2018" },
    { id: 8, name: "It Reaches Out", description: "The crew investigates a mysterious signal while the protomolecule continues to evolve.", watched: false, airDate: "May 30, 2018" },
    { id: 9, name: "Intransigence", description: "The crew faces resistance while trying to achieve their mission.", watched: false, airDate: "June 6, 2018" },
    { id: 10, name: "Dandelion Sky", description: "The crew reaches their destination and discovers new mysteries.", watched: false, airDate: "June 13, 2018" },
    { id: 11, name: "Fallen World", description: "The crew explores a new world while facing unknown dangers.", watched: false, airDate: "June 20, 2018" },
    { id: 12, name: "Congregation", description: "The crew discovers the truth about the protomolecule and faces a new threat.", watched: false, airDate: "June 27, 2018" },
    { id: 13, name: "Abaddon's Gate", description: "The season finale brings the crew's journey to a dramatic conclusion.", watched: false, airDate: "July 4, 2018" }
  ],
  4: [
    { id: 1, name: "New Terra", description: "The crew explores a new world while dealing with political tensions back in the solar system.", watched: false, airDate: "December 13, 2019" },
    { id: 2, name: "Jetsam", description: "The crew investigates mysterious artifacts while facing new challenges.", watched: false, airDate: "December 13, 2019" },
    { id: 3, name: "Subduction", description: "The crew discovers ancient alien technology while political tensions escalate.", watched: false, airDate: "December 13, 2019" },
    { id: 4, name: "Retrograde", description: "The crew faces a crisis while trying to understand the alien technology.", watched: false, airDate: "December 13, 2019" },
    { id: 5, name: "Oppressor", description: "The crew deals with oppressive forces while trying to survive.", watched: false, airDate: "December 13, 2019" },
    { id: 6, name: "Displacement", description: "The crew faces displacement and new challenges on the alien world.", watched: false, airDate: "December 13, 2019" },
    { id: 7, name: "A Shot in the Dark", description: "The crew takes a desperate shot while facing overwhelming odds.", watched: false, airDate: "December 13, 2019" },
    { id: 8, name: "The One-Eyed Man", description: "The crew faces a one-eyed man and discovers new truths.", watched: false, airDate: "December 13, 2019" },
    { id: 9, name: "Saeculum", description: "The crew discovers ancient secrets while facing their greatest challenge.", watched: false, airDate: "December 13, 2019" },
    { id: 10, name: "Cibola Burn", description: "The season finale brings the crew's exploration to a dramatic conclusion.", watched: false, airDate: "December 13, 2019" }
  ],
  5: [
    { id: 1, name: "Exodus", description: "The crew returns to the solar system while a new threat emerges.", watched: false, airDate: "December 16, 2020" },
    { id: 2, name: "Churn", description: "The crew faces the churn of political and personal challenges.", watched: false, airDate: "December 16, 2020" },
    { id: 3, name: "Mother", description: "The crew deals with family issues while new threats emerge.", watched: false, airDate: "December 16, 2020" },
    { id: 4, name: "Gaugamela", description: "The crew faces a decisive battle while political tensions reach their peak.", watched: false, airDate: "December 16, 2020" },
    { id: 5, name: "Down and Out", description: "The crew faces being down and out while trying to survive.", watched: false, airDate: "December 16, 2020" },
    { id: 6, name: "Tribes", description: "The crew deals with tribal conflicts while trying to unite humanity.", watched: false, airDate: "December 16, 2020" },
    { id: 7, name: "Oyedeng", description: "The crew faces a farewell while new challenges emerge.", watched: false, airDate: "December 16, 2020" },
    { id: 8, name: "Hard Vacuum", description: "The crew faces hard vacuum while trying to prevent disaster.", watched: false, airDate: "December 16, 2020" },
    { id: 9, name: "Winnipesaukee", description: "The crew faces a lake while dealing with personal and political issues.", watched: false, airDate: "December 16, 2020" },
    { id: 10, name: "Nemesis Games", description: "The season finale brings the crew's journey to a dramatic conclusion.", watched: false, airDate: "December 16, 2020" }
  ],
  6: [
    { id: 1, name: "Strange Dogs", description: "The crew investigates strange dogs while dealing with new threats.", watched: false, airDate: "December 10, 2021" },
    { id: 2, name: "Azure Dragon", description: "The crew faces the Azure Dragon while political tensions escalate.", watched: false, airDate: "December 10, 2021" },
    { id: 3, name: "Force Projection", description: "The crew uses force projection while trying to prevent war.", watched: false, airDate: "December 10, 2021" },
    { id: 4, name: "Redoubt", description: "The crew builds a redoubt while facing overwhelming odds.", watched: false, airDate: "December 10, 2021" },
    { id: 5, name: "Why We Fight", description: "The crew remembers why they fight while facing their greatest challenge.", watched: false, airDate: "December 10, 2021" },
    { id: 6, name: "Babylon's Ashes", description: "The series finale brings The Expanse to its conclusion.", watched: false, airDate: "December 10, 2021" }
  ]
}


const barryEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Chapter One: Make Your Mark", description: "A hitman discovers a passion for acting while on a job in Los Angeles.", watched: false, airDate: "March 25, 2018" },
    { id: 2, name: "Chapter Two: Use It", description: "Barry tries to balance his criminal life with his new acting ambitions.", watched: false, airDate: "April 1, 2018" },
    { id: 3, name: "Chapter Three: Make the Unsafe Choice", description: "Barry's acting class forces him to confront his past and emotions.", watched: false, airDate: "April 8, 2018" },
    { id: 4, name: "Chapter Four: Commit... to YOU", description: "Barry faces a moral dilemma when his criminal past threatens his new life.", watched: false, airDate: "April 15, 2018" },
    { id: 5, name: "Chapter Five: Do Your Job", description: "Barry must complete a difficult assignment while maintaining his cover.", watched: false, airDate: "April 22, 2018" },
    { id: 6, name: "Chapter Six: Listen with Your Ears, React with Your Face", description: "Barry's worlds collide as he tries to protect his new friends.", watched: false, airDate: "April 29, 2018" },
    { id: 7, name: "Chapter Seven: Loud, Fast and Keep Going", description: "The tension builds as Barry's past catches up with him.", watched: false, airDate: "May 6, 2018" },
    { id: 8, name: "Chapter Eight: Know Your Truth", description: "Barry must make a crucial decision about his future and identity.", watched: false, airDate: "May 13, 2018" }
  ],
  2: [
    { id: 1, name: "Chapter Nine: The Show, Buddy", description: "Barry tries to focus on his acting career while dealing with the consequences of his actions.", watched: false, airDate: "March 31, 2019" },
    { id: 2, name: "Chapter Ten: The Show, Buddy", description: "Barry's acting career takes off while his criminal past continues to haunt him.", watched: false, airDate: "April 7, 2019" },
    { id: 3, name: "Chapter Eleven: The Show, Buddy", description: "Barry faces new challenges in his acting career while trying to maintain his cover.", watched: false, airDate: "April 14, 2019" },
    { id: 4, name: "Chapter Twelve: The Show, Buddy", description: "Barry's worlds collide as he tries to balance his dual life.", watched: false, airDate: "April 21, 2019" },
    { id: 5, name: "Chapter Thirteen: The Show, Buddy", description: "Barry must make difficult choices as his past catches up with him.", watched: false, airDate: "April 28, 2019" },
    { id: 6, name: "Chapter Fourteen: The Show, Buddy", description: "The tension builds as Barry's secrets threaten to be exposed.", watched: false, airDate: "May 5, 2019" },
    { id: 7, name: "Chapter Fifteen: The Show, Buddy", description: "Barry faces a crisis that forces him to confront his true nature.", watched: false, airDate: "May 12, 2019" },
    { id: 8, name: "Chapter Sixteen: The Show, Buddy", description: "The season finale brings Barry's journey to a dramatic conclusion.", watched: false, airDate: "May 19, 2019" }
  ],
  3: [
    { id: 1, name: "Chapter Seventeen: Forgiving Jeff", description: "Barry tries to move on from his past while dealing with new threats.", watched: false, airDate: "April 24, 2022" },
    { id: 2, name: "Chapter Eighteen: Limonada", description: "Barry's acting career continues to grow while his criminal past resurfaces.", watched: false, airDate: "May 1, 2022" },
    { id: 3, name: "Chapter Nineteen: Ben Mendelsohn", description: "Barry faces new challenges in his acting career while dealing with personal issues.", watched: false, airDate: "May 8, 2022" },
    { id: 4, name: "Chapter Twenty: Starting Now", description: "Barry tries to start fresh while his past continues to haunt him.", watched: false, airDate: "May 15, 2022" },
    { id: 5, name: "Chapter Twenty-One: Starting Now", description: "Barry's new life is threatened as old enemies resurface.", watched: false, airDate: "May 22, 2022" },
    { id: 6, name: "Chapter Twenty-Two: Starting Now", description: "The tension builds as Barry's secrets are threatened.", watched: false, airDate: "May 29, 2022" },
    { id: 7, name: "Chapter Twenty-Three: Starting Now", description: "Barry faces a crisis that forces him to make difficult choices.", watched: false, airDate: "June 5, 2022" },
    { id: 8, name: "Chapter Twenty-Four: Starting Now", description: "The season finale brings Barry's story to a shocking conclusion.", watched: false, airDate: "June 12, 2022" }
  ],
  4: [
    { id: 1, name: "Chapter Twenty-Five: yikes", description: "Barry faces the consequences of his actions while trying to rebuild his life.", watched: false, airDate: "April 16, 2023" },
    { id: 2, name: "Chapter Twenty-Six: bestest place on the earth", description: "Barry tries to find peace while dealing with new challenges.", watched: false, airDate: "April 23, 2023" },
    { id: 3, name: "Chapter Twenty-Seven: you're charming", description: "Barry's acting career takes a new direction while his past continues to haunt him.", watched: false, airDate: "April 30, 2023" },
    { id: 4, name: "Chapter Twenty-Eight: it takes a psycho", description: "Barry faces new threats while trying to protect those he cares about.", watched: false, airDate: "May 7, 2023" },
    { id: 5, name: "Chapter Twenty-Nine: tron", description: "Barry's worlds collide as he tries to maintain his dual life.", watched: false, airDate: "May 14, 2023" },
    { id: 6, name: "Chapter Thirty: a nice meal", description: "The tension builds as Barry's secrets are threatened.", watched: false, airDate: "May 21, 2023" },
    { id: 7, name: "Chapter Thirty-One: a nice meal", description: "Barry faces a crisis that forces him to confront his true nature.", watched: false, airDate: "May 28, 2023" },
    { id: 8, name: "Chapter Thirty-Two: wow", description: "The series finale brings Barry's journey to its ultimate conclusion.", watched: false, airDate: "June 4, 2023" }
  ]
}

// Datos de episodios para The Leftovers
const leftoversEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Pilot", description: "Three years after the Sudden Departure, a family struggles to cope with the mysterious disappearance of 2% of the world's population.", watched: false, airDate: "June 29, 2014" },
    { id: 2, name: "Penguin One, Us Zero", description: "Kevin tries to maintain order in his town while dealing with personal and professional challenges.", watched: false, airDate: "July 6, 2014" },
    { id: 3, name: "Two Boats and a Helicopter", description: "Reverend Matt Jamison's faith is tested as he faces a series of personal crises.", watched: false, airDate: "July 13, 2014" },
    { id: 4, name: "B.J. and the A.C.", description: "Kevin's daughter Jill tries to understand her place in the world after the Departure.", watched: false, airDate: "July 20, 2014" },
    { id: 5, name: "Gladys", description: "The Guilty Remnant's methods become more extreme, leading to a shocking act of violence.", watched: false, airDate: "July 27, 2014" },
    { id: 6, name: "Guest", description: "Nora Durst attends a conference for people who lost their entire families in the Departure.", watched: false, airDate: "August 3, 2014" },
    { id: 7, name: "Solace for Tired Feet", description: "Kevin's investigation into a missing person case leads to unexpected revelations.", watched: false, airDate: "August 10, 2014" },
    { id: 8, name: "Cairo", description: "Kevin's mental state deteriorates as he faces mounting pressure and supernatural experiences.", watched: false, airDate: "August 17, 2014" },
    { id: 9, name: "The Garveys at Their Best", description: "A flashback shows the Garvey family before the Departure and reveals what they lost.", watched: false, airDate: "August 24, 2014" },
    { id: 10, name: "The Prodigal Son Returns", description: "The season finale brings the family's struggles to a dramatic conclusion.", watched: false, airDate: "August 31, 2014" }
  ],
  2: [
    { id: 1, name: "Axis Mundi", description: "The Garvey family moves to Miracle, Texas, a town where no one departed during the Sudden Departure.", watched: false, airDate: "October 4, 2015" },
    { id: 2, name: "A Matter of Geography", description: "Kevin tries to adjust to life in Miracle while dealing with supernatural experiences.", watched: false, airDate: "October 11, 2015" },
    { id: 3, name: "Off Ramp", description: "Laurie's story is revealed as she tries to help people who have lost loved ones.", watched: false, airDate: "October 18, 2015" },
    { id: 4, name: "Orange Sticker", description: "Kevin investigates a mysterious incident while the town prepares for an anniversary.", watched: false, airDate: "October 25, 2015" },
    { id: 5, name: "No Room at the Inn", description: "The Garvey family faces challenges as they try to integrate into the Miracle community.", watched: false, airDate: "November 1, 2015" },
    { id: 6, name: "Lens", description: "Nora investigates a mysterious organization while Kevin deals with personal issues.", watched: false, airDate: "November 8, 2015" },
    { id: 7, name: "A Most Powerful Adversary", description: "Kevin's supernatural experiences intensify as he faces new challenges.", watched: false, airDate: "November 15, 2015" },
    { id: 8, name: "International Assassin", description: "Kevin embarks on a surreal journey that challenges his understanding of reality.", watched: false, airDate: "November 22, 2015" },
    { id: 9, name: "Ten Thirteen", description: "The season builds to a dramatic climax as the characters face their greatest challenges.", watched: false, airDate: "November 29, 2015" },
    { id: 10, name: "I Live Here Now", description: "The season finale brings the characters' journeys to a shocking conclusion.", watched: false, airDate: "December 6, 2015" }
  ],
  3: [
    { id: 1, name: "The Book of Kevin", description: "Three years later, Kevin's life has changed dramatically as he faces new challenges.", watched: false, airDate: "April 16, 2017" },
    { id: 2, name: "Don't Be Ridiculous", description: "Nora's story is revealed as she embarks on a mysterious journey.", watched: false, airDate: "April 23, 2017" },
    { id: 3, name: "Crazy Whitefella Thinking", description: "Kevin's supernatural experiences continue as he tries to understand his purpose.", watched: false, airDate: "April 30, 2017" },
    { id: 4, name: "G'Day Melbourne", description: "Kevin travels to Australia to confront his past and find answers.", watched: false, airDate: "May 7, 2017" },
    { id: 5, name: "It's a Matt, Matt, Matt, Matt World", description: "Matt's faith is tested as he faces new challenges and revelations.", watched: false, airDate: "May 14, 2017" },
    { id: 6, name: "Certified", description: "Kevin faces a crucial test that will determine his future.", watched: false, airDate: "May 21, 2017" },
    { id: 7, name: "The Most Powerful Man in the World (and His Identical Twin Brother)", description: "Kevin's journey reaches its climax as he confronts his destiny.", watched: false, airDate: "May 28, 2017" },
    { id: 8, name: "The Book of Nora", description: "The series finale brings The Leftovers to its ultimate conclusion.", watched: false, airDate: "June 4, 2017" }
  ]
}


const atlantaEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "The Big Bang", description: "Earn tries to help his cousin Alfred, who raps as Paper Boi, navigate the Atlanta music scene.", watched: false, airDate: "September 6, 2016" },
    { id: 2, name: "Streets on Lock", description: "Earn and Alfred deal with the consequences of a viral video while trying to make money.", watched: false, airDate: "September 13, 2016" },
    { id: 3, name: "Go for Broke", description: "Earn struggles to provide for his daughter while Alfred's career begins to take off.", watched: false, airDate: "September 20, 2016" },
    { id: 4, name: "The Streisand Effect", description: "Alfred's growing fame brings unexpected attention and complications.", watched: false, airDate: "September 27, 2016" },
    { id: 5, name: "Nobody Beats the Biebs", description: "Earn and Alfred attend a celebrity basketball game that doesn't go as planned.", watched: false, airDate: "October 4, 2016" },
    { id: 6, name: "Value", description: "Earn tries to prove his worth to Alfred while dealing with personal issues.", watched: false, airDate: "October 11, 2016" },
    { id: 7, name: "B.A.N.", description: "A mock talk show episode explores race, gender, and identity in modern America.", watched: false, airDate: "October 18, 2016" },
    { id: 8, name: "The Club", description: "Earn and Alfred navigate the Atlanta club scene and encounter various characters.", watched: false, airDate: "October 25, 2016" },
    { id: 9, name: "Juneteenth", description: "Earn attends a Juneteenth celebration that reveals the complexities of black identity.", watched: false, airDate: "November 1, 2016" },
    { id: 10, name: "The Jacket", description: "The season finale explores themes of family, success, and the price of ambition.", watched: false, airDate: "November 8, 2016" }
  ],
  2: [
    { id: 1, name: "Alligator Man", description: "Earn and Alfred visit their uncle Willie, who has an alligator in his house.", watched: false, airDate: "March 1, 2018" },
    { id: 2, name: "Sportin' Waves", description: "Alfred tries to get his hair done while dealing with his growing fame.", watched: false, airDate: "March 8, 2018" },
    { id: 3, name: "Money Bag Shawty", description: "Earn tries to get Alfred's money from a promoter while dealing with personal issues.", watched: false, airDate: "March 15, 2018" },
    { id: 4, name: "Helen", description: "Van attends a German festival that explores cultural identity and belonging.", watched: false, airDate: "March 22, 2018" },
    { id: 5, name: "Barbershop", description: "Alfred gets a haircut while discussing race, politics, and personal growth.", watched: false, airDate: "March 29, 2018" },
    { id: 6, name: "Teddy Perkins", description: "Darius visits a mysterious mansion to pick up a piano, leading to a surreal experience.", watched: false, airDate: "April 5, 2018" },
    { id: 7, name: "Champagne Papi", description: "Van visits Drake's house for a party that doesn't go as expected.", watched: false, airDate: "April 12, 2018" },
    { id: 8, name: "Woods", description: "Alfred gets lost in the woods and faces his inner demons.", watched: false, airDate: "April 19, 2018" },
    { id: 9, name: "North of the Border", description: "Earn and Alfred go on tour and face the challenges of the music industry.", watched: false, airDate: "April 26, 2018" },
    { id: 10, name: "FUBU", description: "Earn deals with racism and identity while trying to succeed in the music business.", watched: false, airDate: "May 3, 2018" },
    { id: 11, name: "Crabs in a Barrel", description: "The season finale explores themes of success, betrayal, and the price of fame.", watched: false, airDate: "May 10, 2018" }
  ],
  3: [
    { id: 1, name: "Three Slaps", description: "A young boy's life changes dramatically after a series of events.", watched: false, airDate: "March 24, 2022" },
    { id: 2, name: "Sinterklaas is Coming to Town", description: "Earn and Alfred travel to Amsterdam for a festival.", watched: false, airDate: "March 24, 2022" },
    { id: 3, name: "The Old Man and the Tree", description: "Darius has a surreal experience in a forest.", watched: false, airDate: "March 31, 2022" },
    { id: 4, name: "The Big Payback", description: "A man receives reparations and faces the consequences.", watched: false, airDate: "March 31, 2022" },
    { id: 5, name: "Cancer Attack", description: "Van deals with health issues while in Paris.", watched: false, airDate: "April 7, 2022" },
    { id: 6, name: "White Fashion", description: "Earn attends a fashion show that explores race and culture.", watched: false, airDate: "April 7, 2022" },
    { id: 7, name: "Trini 2 De Bone", description: "Alfred visits Trinidad and faces cultural challenges.", watched: false, airDate: "April 14, 2022" },
    { id: 8, name: "New Jazz", description: "A jazz musician's story is told through animation.", watched: false, airDate: "April 14, 2022" },
    { id: 9, name: "Rich Wigga, Poor Wigga", description: "Two men with similar names lead very different lives.", watched: false, airDate: "April 21, 2022" },
    { id: 10, name: "Tarrare", description: "A surreal episode about a man with an insatiable appetite.", watched: false, airDate: "April 21, 2022" }
  ],
  4: [
    { id: 1, name: "The Most Atlanta", description: "Earn and Alfred return to Atlanta and face new challenges.", watched: false, airDate: "September 15, 2022" },
    { id: 2, name: "The Homeliest Little Horse", description: "Alfred deals with his success while Earn tries to prove himself.", watched: false, airDate: "September 15, 2022" },
    { id: 3, name: "Born 2 Die", description: "Van faces personal challenges while trying to find her place.", watched: false, airDate: "September 22, 2022" },
    { id: 4, name: "Light Skinned-ed", description: "Earn deals with issues of race and identity.", watched: false, airDate: "September 22, 2022" },
    { id: 5, name: "Work Ethic!", description: "Alfred tries to maintain his work ethic while dealing with fame.", watched: false, airDate: "September 29, 2022" },
    { id: 6, name: "Crank Dat Killer", description: "A mysterious killer targets people who do the Crank That dance.", watched: false, airDate: "September 29, 2022" },
    { id: 7, name: "Snipe Hunt", description: "Darius goes on a snipe hunt that becomes a surreal experience.", watched: false, airDate: "October 6, 2022" },
    { id: 8, name: "The Goof Who Sat by the Door", description: "A parody of Disney's Goofy explores themes of race and representation.", watched: false, airDate: "October 6, 2022" },
    { id: 9, name: "Andrew Wyeth. Alfred's World.", description: "Alfred's world is explored through the lens of Andrew Wyeth's paintings.", watched: false, airDate: "October 13, 2022" },
    { id: 10, name: "It Was All a Dream", description: "The series finale brings Atlanta to its conclusion.", watched: false, airDate: "October 13, 2022" }
  ]
}


const goodPlaceEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Everything Is Fine", description: "Eleanor Shellstrop wakes up in the Good Place and realizes she's been sent there by mistake.", watched: false, airDate: "September 19, 2016" },
    { id: 2, name: "Flying", description: "Eleanor tries to learn how to be good while hiding her true identity from the other residents.", watched: false, airDate: "September 19, 2016" },
    { id: 3, name: "Tahani Al-Jamil", description: "Eleanor meets her new neighbor Tahani and tries to understand the scoring system of the afterlife.", watched: false, airDate: "September 22, 2016" },
    { id: 4, name: "Jason Mendoza", description: "Eleanor discovers another person who might not belong in the Good Place.", watched: false, airDate: "September 29, 2016" },
    { id: 5, name: "Category 55 Emergency Doomsday Crisis", description: "The neighborhood faces its first crisis, and Eleanor must decide whether to help or hide.", watched: false, airDate: "October 6, 2016" },
    { id: 6, name: "What We Owe to Each Other", description: "Eleanor tries to learn philosophy to become a better person.", watched: false, airDate: "October 13, 2016" },
    { id: 7, name: "The Eternal Shriek", description: "Eleanor's secret is threatened when someone from her past arrives in the Good Place.", watched: false, airDate: "October 20, 2016" },
    { id: 8, name: "Most Improved Player", description: "Eleanor tries to improve her score while dealing with unexpected complications.", watched: false, airDate: "October 27, 2016" },
    { id: 9, name: "…Someone Like Me as a Member", description: "Eleanor's past catches up with her in unexpected ways.", watched: false, airDate: "November 3, 2016" },
    { id: 10, name: "Chidi's Choice", description: "The season finale reveals a shocking truth about the Good Place.", watched: false, airDate: "November 10, 2016" },
    { id: 11, name: "What's My Motivation", description: "The truth about the Good Place begins to emerge.", watched: false, airDate: "November 17, 2016" },
    { id: 12, name: "Mindy St. Claire", description: "The group discovers the truth about the afterlife and must make a difficult choice.", watched: false, airDate: "November 24, 2016" },
    { id: 13, name: "Michael's Gambit", description: "The season finale reveals the true nature of the Good Place and sets up the next chapter.", watched: false, airDate: "January 5, 2017" }
  ],
  2: [
    { id: 1, name: "Everything Is Great!", description: "The group tries to navigate their new situation while Michael attempts to torture them.", watched: false, airDate: "September 20, 2017" },
    { id: 2, name: "Dance Dance Resolution", description: "The group tries to figure out how many times they've been reset while Michael adapts his strategy.", watched: false, airDate: "September 20, 2017" },
    { id: 3, name: "Team Cockroach", description: "The group forms an alliance to try to escape the Bad Place.", watched: false, airDate: "September 21, 2017" },
    { id: 4, name: "Existential Crisis", description: "Michael faces an existential crisis while the group tries to find a way out.", watched: false, airDate: "September 28, 2017" },
    { id: 5, name: "The Trolley Problem", description: "The group faces ethical dilemmas while trying to escape.", watched: false, airDate: "October 5, 2017" },
    { id: 6, name: "Janet and Michael", description: "Janet and Michael form an unlikely alliance while the group continues their escape plan.", watched: false, airDate: "October 12, 2017" },
    { id: 7, name: "Derek", description: "The group creates a new Janet while dealing with unexpected complications.", watched: false, airDate: "October 19, 2017" },
    { id: 8, name: "Leap to Faith", description: "The group must take a leap of faith to escape the Bad Place.", watched: false, airDate: "October 26, 2017" },
    { id: 9, name: "Best Self", description: "The group tries to become their best selves while facing new challenges.", watched: false, airDate: "November 2, 2017" },
    { id: 10, name: "Rhonda, Diana, Jake, and Trent", description: "The group tries to blend in with the Bad Place residents.", watched: false, airDate: "November 9, 2017" },
    { id: 11, name: "The Burrito", description: "The group's escape plan reaches a critical point.", watched: false, airDate: "November 16, 2017" },
    { id: 12, name: "Somewhere Else", description: "The season finale brings the group to a new location with unexpected consequences.", watched: false, airDate: "January 4, 2018" }
  ],
  3: [
    { id: 1, name: "Everything Is Bonzer!", description: "The group returns to Earth to try to become better people.", watched: false, airDate: "September 27, 2018" },
    { id: 2, name: "The Brainy Bunch", description: "The group tries to help each other become better people on Earth.", watched: false, airDate: "October 4, 2018" },
    { id: 3, name: "The Snowplow", description: "The group faces challenges as they try to improve themselves.", watched: false, airDate: "October 11, 2018" },
    { id: 4, name: "Jeremy Bearimy", description: "The group learns about time in the afterlife and faces new challenges.", watched: false, airDate: "October 18, 2018" },
    { id: 5, name: "The Ballad of Donkey Doug", description: "Jason's story is revealed as he tries to become a better person.", watched: false, airDate: "October 25, 2018" },
    { id: 6, name: "A Fractured Inheritance", description: "Tahani's family issues are explored as she tries to improve herself.", watched: false, airDate: "November 1, 2018" },
    { id: 7, name: "The Worst Possible Use of Free Will", description: "The group faces a crisis that tests their moral development.", watched: false, airDate: "November 8, 2018" },
    { id: 8, name: "Don't Let the Good Life Pass You By", description: "The group tries to make the most of their second chance on Earth.", watched: false, airDate: "November 15, 2018" },
    { id: 9, name: "Janet(s)", description: "Janet's story is explored as the group faces new challenges.", watched: false, airDate: "November 29, 2018" },
    { id: 10, name: "The Book of Dougs", description: "The group investigates the afterlife's scoring system.", watched: false, airDate: "December 6, 2018" },
    { id: 11, name: "Chidi Sees the Time-Knife", description: "Chidi faces a crisis that forces him to confront his beliefs.", watched: false, airDate: "December 13, 2018" },
    { id: 12, name: "Pandemonium", description: "The season finale brings the group to a new chapter in their journey.", watched: false, airDate: "January 10, 2019" }
  ],
  4: [
    { id: 1, name: "A Girl from Arizona (Part 1)", description: "The group tries to help people get into the Good Place while facing new challenges.", watched: false, airDate: "September 26, 2019" },
    { id: 2, name: "A Girl from Arizona (Part 2)", description: "The group's plan to help people continues as they face unexpected obstacles.", watched: false, airDate: "October 3, 2019" },
    { id: 3, name: "Chillaxing", description: "The group tries to relax while dealing with the pressure of their mission.", watched: false, airDate: "October 10, 2019" },
    { id: 4, name: "Tinker, Tailor, Demon, Spy", description: "The group must work with demons to achieve their goals.", watched: false, airDate: "October 17, 2019" },
    { id: 5, name: "Employee of the Bearimy", description: "The group faces challenges as they try to improve the afterlife system.", watched: false, airDate: "October 24, 2019" },
    { id: 6, name: "A Chip Driver Mystery", description: "The group investigates a mystery while dealing with personal issues.", watched: false, airDate: "October 31, 2019" },
    { id: 7, name: "Help Is Other People", description: "The group tries to help each other while facing new challenges.", watched: false, airDate: "November 7, 2019" },
    { id: 8, name: "The Funeral to End All Funerals", description: "The group attends a funeral that becomes a turning point in their journey.", watched: false, airDate: "November 14, 2019" },
    { id: 9, name: "The Answer", description: "Chidi faces a crucial decision that will affect everyone's future.", watched: false, airDate: "November 21, 2019" },
    { id: 10, name: "Mondays, Am I Right?", description: "The group faces a new challenge as they try to improve the afterlife.", watched: false, airDate: "November 28, 2019" },
    { id: 11, name: "You've Changed, Man", description: "The group deals with changes in their relationships and mission.", watched: false, airDate: "December 5, 2019" },
    { id: 12, name: "Patty", description: "The group meets someone who challenges their understanding of the afterlife.", watched: false, airDate: "December 12, 2019" },
    { id: 13, name: "Whenever You're Ready", description: "The series finale brings The Good Place to its ultimate conclusion.", watched: false, airDate: "January 30, 2020" }
  ]
}


const severanceEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Good News About Hell", description: "Mark Scout begins his new job at Lumon Industries, where employees undergo a procedure called 'severance' to separate their work and personal memories.", watched: false, airDate: "February 18, 2022" },
    { id: 2, name: "Half Loop", description: "Mark's innie self begins to question his work environment and the nature of his job.", watched: false, airDate: "February 18, 2022" },
    { id: 3, name: "In Perpetuity", description: "The Macrodata Refinement team faces a crisis when one of their members goes missing.", watched: false, airDate: "February 25, 2022" },
    { id: 4, name: "The You You Are", description: "Mark's outie self deals with personal issues while his innie self continues to investigate Lumon.", watched: false, airDate: "March 4, 2022" },
    { id: 5, name: "The Grim Barbarity of Optics and Design", description: "The team discovers disturbing aspects of their work environment and company policies.", watched: false, airDate: "March 11, 2022" },
    { id: 6, name: "Hide and Seek", description: "Mark and his colleagues attempt to uncover the truth about Lumon Industries.", watched: false, airDate: "March 18, 2022" },
    { id: 7, name: "Defiant Jazz", description: "The tension builds as the characters confront the reality of their situation.", watched: false, airDate: "March 25, 2022" },
    { id: 8, name: "What's for Dinner?", description: "The season finale reveals shocking truths about Lumon and the severance procedure.", watched: false, airDate: "April 1, 2022" },
    { id: 9, name: "The We We Are", description: "The season concludes with dramatic revelations that change everything.", watched: false, airDate: "April 8, 2022" }
  ]
}


const tedLassoEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "Pilot", description: "American football coach Ted Lasso is hired to coach a struggling English Premier League soccer team.", watched: false, airDate: "August 14, 2020" },
    { id: 2, name: "Biscuits", description: "Ted tries to win over the team and staff while dealing with the media and his own insecurities.", watched: false, airDate: "August 14, 2020" },
    { id: 3, name: "Trent Crimm: The Independent", description: "A journalist investigates Ted's coaching methods and the team's performance.", watched: false, airDate: "August 21, 2020" },
    { id: 4, name: "For the Children", description: "Ted organizes a charity event while the team prepares for their next match.", watched: false, airDate: "August 28, 2020" },
    { id: 5, name: "Tan Lines", description: "The team goes on a training retreat that reveals personal dynamics and conflicts.", watched: false, airDate: "September 4, 2020" },
    { id: 6, name: "Two Aces", description: "Ted faces challenges both on and off the field as the season progresses.", watched: false, airDate: "September 11, 2020" },
    { id: 7, name: "Make Rebecca Great Again", description: "Rebecca deals with personal issues while Ted tries to improve the team's performance.", watched: false, airDate: "September 18, 2020" },
    { id: 8, name: "The Diamond Dogs", description: "Ted and his coaching staff form a support group to help each other through difficult times.", watched: false, airDate: "September 25, 2020" },
    { id: 9, name: "All Apologies", description: "The team faces a crucial match while dealing with personal and professional conflicts.", watched: false, airDate: "October 2, 2020" },
    { id: 10, name: "The Hope That Kills You", description: "The season finale brings the team's journey to a dramatic conclusion.", watched: false, airDate: "October 9, 2020" }
  ],
  2: [
    { id: 1, name: "Goodbye Earl", description: "Ted and the team deal with the aftermath of their relegation while preparing for the new season.", watched: false, airDate: "July 23, 2021" },
    { id: 2, name: "Lavender", description: "Ted faces personal challenges while the team tries to improve their performance.", watched: false, airDate: "July 23, 2021" },
    { id: 3, name: "Do the Right-est Thing", description: "Ted must make difficult decisions while dealing with team dynamics.", watched: false, airDate: "July 30, 2021" },
    { id: 4, name: "Carol of the Bells", description: "The team celebrates Christmas while dealing with personal and professional issues.", watched: false, airDate: "August 6, 2021" },
    { id: 5, name: "Rainbow", description: "Ted's mental health becomes a concern as he faces mounting pressure.", watched: false, airDate: "August 13, 2021" },
    { id: 6, name: "The Signal", description: "The team faces a crucial match while Ted deals with personal issues.", watched: false, airDate: "August 20, 2021" },
    { id: 7, name: "Headspace", description: "Ted seeks help for his mental health while the team continues their season.", watched: false, airDate: "August 27, 2021" },
    { id: 8, name: "Man City", description: "The team faces their biggest challenge yet against Manchester City.", watched: false, airDate: "September 3, 2021" },
    { id: 9, name: "Beard After Hours", description: "Coach Beard has a wild night out that reveals his personal struggles.", watched: false, airDate: "September 10, 2021" },
    { id: 10, name: "No Weddings and a Funeral", description: "The team deals with a personal loss while trying to focus on their goals.", watched: false, airDate: "September 17, 2021" },
    { id: 11, name: "Midnight Train to Royston", description: "Ted faces a crisis that forces him to confront his past.", watched: false, airDate: "September 24, 2021" },
    { id: 12, name: "Inverting the Pyramid of Success", description: "The season builds to a dramatic climax as the team faces their final challenge.", watched: false, airDate: "October 1, 2021" }
  ],
  3: [
    { id: 1, name: "Smells Like Mean Spirit", description: "Ted and the team return for their third season with new challenges and opportunities.", watched: false, airDate: "March 15, 2023" },
    { id: 2, name: "(I Don't Want to Go to) Chelsea", description: "The team faces Chelsea while dealing with personal and professional challenges.", watched: false, airDate: "March 15, 2023" },
    { id: 3, name: "4-5-1", description: "Ted tries a new formation while dealing with team dynamics.", watched: false, airDate: "March 22, 2023" },
    { id: 4, name: "Big Week", description: "The team faces a crucial week of matches that could determine their season.", watched: false, airDate: "March 29, 2023" },
    { id: 5, name: "Signs", description: "Ted and the team look for signs of improvement while facing new challenges.", watched: false, airDate: "April 5, 2023" },
    { id: 6, name: "Sunflowers", description: "The team deals with personal issues while trying to maintain their focus.", watched: false, airDate: "April 12, 2023" },
    { id: 7, name: "The Strings That Bind Us", description: "Ted and the team face a crisis that tests their bonds.", watched: false, airDate: "April 19, 2023" },
    { id: 8, name: "We'll Never Have Paris", description: "The team travels to Paris for a match that becomes a turning point.", watched: false, airDate: "April 26, 2023" },
    { id: 9, name: "La Locker Room Aux Folles", description: "The team deals with locker room dynamics while preparing for important matches.", watched: false, airDate: "May 3, 2023" },
    { id: 10, name: "International Break", description: "The team deals with the international break while Ted faces personal challenges.", watched: false, airDate: "May 10, 2023" },
    { id: 11, name: "Mom City", description: "Ted's mother visits while the team faces crucial matches.", watched: false, airDate: "May 17, 2023" },
    { id: 12, name: "So Long, Farewell", description: "The series finale brings Ted Lasso to its conclusion.", watched: false, airDate: "May 24, 2023" }
  ]
}


const moonEmbracingSunEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: '해와 달이 함께한 시간', description: 'The young Crown Prince Lee Hwon meets the beautiful Yeon-woo and they fall in love at first sight.', watched: false, airDate: 'January 4, 2012' },
    { id: 2, name: '달빛 아래서', description: 'Yeon-woo is chosen as the Crown Princess, but political intrigue begins to threaten their love.', watched: false, airDate: 'January 5, 2012' },
    { id: 3, name: '꿈속에서 만난 사람', description: 'The Crown Prince and Yeon-woo grow closer, but dark forces conspire against them.', watched: false, airDate: 'January 11, 2012' },
    { id: 4, name: '운명의 시작', description: 'Yeon-woo faces challenges in the palace while the Crown Prince tries to protect her.', watched: false, airDate: 'January 12, 2012' },
    { id: 5, name: '어둠 속의 빛', description: 'The political situation becomes more dangerous as Yeon-woo\'s position is threatened.', watched: false, airDate: 'January 18, 2012' },
    { id: 6, name: '잃어버린 시간', description: 'A tragic event changes everything for the Crown Prince and Yeon-woo.', watched: false, airDate: 'January 19, 2012' },
    { id: 7, name: '새로운 시작', description: 'The Crown Prince is devastated by loss and becomes a cold ruler.', watched: false, airDate: 'January 25, 2012' },
    { id: 8, name: '기적의 순간', description: 'Years later, a mysterious shaman appears who reminds the King of his lost love.', watched: false, airDate: 'January 26, 2012' },
    { id: 9, name: '진실의 문', description: 'The King becomes obsessed with the shaman, not knowing her true identity.', watched: false, airDate: 'February 1, 2012' },
    { id: 10, name: '기억의 조각', description: 'The shaman\'s presence in the palace causes political turmoil.', watched: false, airDate: 'February 2, 2012' },
    { id: 11, name: '과거의 그림자', description: 'The King begins to suspect the shaman\'s true identity.', watched: false, airDate: 'February 8, 2012' },
    { id: 12, name: '진실의 빛', description: 'The truth about the shaman\'s past begins to emerge.', watched: false, airDate: 'February 9, 2012' },
    { id: 13, name: '운명의 선택', description: 'The King confronts the shaman about her identity.', watched: false, airDate: 'February 15, 2012' },
    { id: 14, name: '기적의 순간', description: 'The shaman\'s true identity is revealed to the King.', watched: false, airDate: 'February 16, 2012' },
    { id: 15, name: '새로운 희망', description: 'The King and Yeon-woo must navigate the dangerous political landscape.', watched: false, airDate: 'February 22, 2012' },
    { id: 16, name: '진실의 대가', description: 'The conspiracy against Yeon-woo is revealed.', watched: false, airDate: 'February 23, 2012' },
    { id: 17, name: '운명의 시간', description: 'The King fights to protect Yeon-woo from her enemies.', watched: false, airDate: 'February 29, 2012' },
    { id: 18, name: '마지막 선택', description: 'The final confrontation approaches as the truth comes to light.', watched: false, airDate: 'March 1, 2012' },
    { id: 19, name: '새로운 시작', description: 'The King and Yeon-woo face their greatest challenge yet.', watched: false, airDate: 'March 7, 2012' },
    { id: 20, name: '해와 달이 함께한 시간', description: 'The series finale brings the story of love and destiny to its conclusion.', watched: false, airDate: 'March 8, 2012' }
  ]
}


const witcherEpisodes: Record<number, any[]> = {
  1: [
    { id: 1, name: "The End's Beginning", description: "Geralt of Rivia, a monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.", watched: false, airDate: "December 20, 2019" },
    { id: 2, name: "Four Marks", description: "Geralt takes on a dangerous contract while Yennefer's magical abilities are discovered.", watched: false, airDate: "December 20, 2019" },
    { id: 3, name: "Betrayer Moon", description: "Geralt investigates a series of mysterious deaths in a mining town.", watched: false, airDate: "December 20, 2019" },
    { id: 4, name: "Of Banquets, Bastards and Burials", description: "Geralt attends a royal banquet where political intrigue unfolds.", watched: false, airDate: "December 20, 2019" },
    { id: 5, name: "Bottled Appetites", description: "Geralt and Jaskier encounter a djinn that grants wishes with dangerous consequences.", watched: false, airDate: "December 20, 2019" },
    { id: 6, name: "Rare Species", description: "Geralt hunts a rare dragon while dealing with competing interests.", watched: false, airDate: "December 20, 2019" },
    { id: 7, name: "Before a Fall", description: "Ciri's destiny becomes clearer as she faces new challenges.", watched: false, airDate: "December 20, 2019" },
    { id: 8, name: "Much More", description: "The season finale brings Geralt, Yennefer, and Ciri's paths together.", watched: false, airDate: "December 20, 2019" }
  ],
  2: [
    { id: 1, name: "A Grain of Truth", description: "Geralt and Ciri seek refuge at an old friend's estate while being hunted.", watched: false, airDate: "December 17, 2021" },
    { id: 2, name: "Kaer Morhen", description: "Geralt brings Ciri to the witcher stronghold to train and protect her.", watched: false, airDate: "December 17, 2021" },
    { id: 3, name: "What Is Lost", description: "Ciri begins her witcher training while Geralt investigates a mysterious threat.", watched: false, airDate: "December 17, 2021" },
    { id: 4, name: "Redanian Intelligence", description: "Geralt and Yennefer work together to uncover a conspiracy.", watched: false, airDate: "December 17, 2021" },
    { id: 5, name: "Turn Your Back", description: "Ciri's training intensifies as she discovers her true potential.", watched: false, airDate: "December 17, 2021" },
    { id: 6, name: "Dear Friend", description: "Geralt and Yennefer's relationship faces new challenges.", watched: false, airDate: "December 17, 2021" },
    { id: 7, name: "Voleth Meir", description: "A powerful demon threatens the witcher stronghold.", watched: false, airDate: "December 17, 2021" },
    { id: 8, name: "Family", description: "The season finale brings the family together to face their greatest threat.", watched: false, airDate: "December 17, 2021" }
  ],
  3: [
    { id: 1, name: "Shaerrawedd", description: "Geralt and Yennefer escort Ciri to Aretuza while being hunted by multiple factions.", watched: false, airDate: "June 29, 2023" },
    { id: 2, name: "Unbound", description: "Ciri begins her magical training while Geralt investigates a conspiracy.", watched: false, airDate: "June 29, 2023" },
    { id: 3, name: "Reunion", description: "Geralt reunites with old friends while Ciri faces new challenges.", watched: false, airDate: "June 29, 2023" },
    { id: 4, name: "The Invitation", description: "Geralt attends a royal ball where political intrigue unfolds.", watched: false, airDate: "June 29, 2023" },
    { id: 5, name: "The Art of Illusion", description: "Ciri's magical abilities grow as she faces new threats.", watched: false, airDate: "June 29, 2023" },
    { id: 6, name: "Everybody Has a Plan 'Til They Get Punched in the Face", description: "The tension builds as multiple factions converge on Ciri.", watched: false, airDate: "June 29, 2023" },
    { id: 7, name: "Out of the Fire, Into the Frying Pan", description: "The season builds to a dramatic climax as secrets are revealed.", watched: false, airDate: "June 29, 2023" },
    { id: 8, name: "The Cost of Chaos", description: "The season finale brings the story to a shocking conclusion.", watched: false, airDate: "June 29, 2023" }
  ]
}

onMounted(() => {
  loadEpisodes()
})

async function loadEpisodes() {
  isLoading.value = true
  
  try {
    
    const realEpisodes = await RealDataService.getRealEpisodes(showId, showTitle.value, seasonNumber)
    
    if (realEpisodes.length > 0) {
      episodes.value = realEpisodes
    } else {
      
      const showTitleLower = showTitle.value.toLowerCase()
      
      if (showTitleLower.includes('peaky blinders')) {
        episodes.value = peakyBlindersEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('wednesday')) {
        episodes.value = wednesdayEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('stranger things')) {
        episodes.value = strangerThingsEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('mandalorian')) {
        episodes.value = mandalorianEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('crown')) {
        episodes.value = crownEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('dark')) {
        episodes.value = darkEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('boys')) {
        episodes.value = boysEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('better call saul')) {
        episodes.value = betterCallSaulEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('money heist') || showTitleLower.includes('casa de papel')) {
        episodes.value = moneyHeistEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('office')) {
        episodes.value = officeEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('succession')) {
        episodes.value = successionEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('ozark')) {
        episodes.value = ozarkEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('westworld')) {
        episodes.value = westworldEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('fleabag')) {
        episodes.value = fleabagEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('maisel')) {
        episodes.value = marvelousMrsMaiselEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('chernobyl')) {
        episodes.value = chernobylEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('mindhunter')) {
        episodes.value = mindhunterEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('expanse')) {
        episodes.value = expanseEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('barry')) {
        episodes.value = barryEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('leftovers')) {
        episodes.value = leftoversEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('atlanta')) {
        episodes.value = atlantaEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('good place')) {
        episodes.value = goodPlaceEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('severance')) {
        episodes.value = severanceEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('ted lasso')) {
        episodes.value = tedLassoEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('witcher')) {
        episodes.value = witcherEpisodes[seasonNumber] || []
      } else if (showTitleLower.includes('견우와 선녀') || showTitleLower.includes('moon embracing the sun')) {
        episodes.value = moonEmbracingSunEpisodes[seasonNumber] || []
      } else {
      
        episodes.value = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Episode ${i + 1}`,
          description: `Description for episode ${i + 1} of ${showTitle.value} season ${seasonNumber}.`,
          watched: false,
          airDate: 'TBA'
        }))
      }
    }
    
   
    loadWatchedState()
    
  } catch (error) {
    console.error('Error loading episodes:', error)

    episodes.value = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Episode ${i + 1}`,
      description: `Description for episode ${i + 1} of ${showTitle.value} season ${seasonNumber}.`,
      watched: false,
      airDate: 'TBA'
    }))
  } finally {
    isLoading.value = false
  }
}

function loadWatchedState() {
  const storageKey = `episodes_${showId}_season_${seasonNumber}`
  const savedState = localStorage.getItem(storageKey)
  
  if (savedState) {
    try {
      const watchedEpisodes = JSON.parse(savedState)
      episodes.value.forEach(episode => {
        if (watchedEpisodes.includes(episode.id)) {
          episode.watched = true
        }
      })
    } catch (error) {
      console.error('Error loading watched state:', error)
    }
  }
}

function saveWatchedState() {
  const storageKey = `episodes_${showId}_season_${seasonNumber}`
  const watchedEpisodes = episodes.value
    .filter(episode => episode.watched)
    .map(episode => episode.id)
  localStorage.setItem(storageKey, JSON.stringify(watchedEpisodes))
}

function saveLastWatched(season: number, episode: number) {
  const key = `lastWatched_${showId}`
  const data = { season, episode, timestamp: Date.now() }
  localStorage.setItem(key, JSON.stringify(data))
}

function toggleWatched(episodeId: number) {
  const episode = episodes.value.find(ep => ep.id === episodeId)
  if (episode) {
    episode.watched = !episode.watched
 
    saveWatchedState()

    saveLastWatched(seasonNumber, episodeId)
  }
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="season-episodes-view">
    <div class="header">
      <button @click="goBack" class="back-button">
        <ion-icon name="arrow-back-outline" />
        Volver
      </button>
      <div class="header-info">
        <h2>{{ showTitle }} - Temporada {{ seasonNumber }}</h2>
        <div class="progress-info">
          <span class="progress-text">{{ seasonProgress }}% completado</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: seasonProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading">Cargando episodios...</div>
    
    <div v-else class="episodes-list">
      <div v-for="episode in episodes" :key="episode.id" class="episode-item">
        <div class="episode-header">
          <div class="episode-info">
            <h3 class="episode-name">{{ episode.name }}</h3>
            <p class="episode-date">{{ episode.airDate }}</p>
          </div>
          <label class="checkbox-container">
            <input 
              type="checkbox" 
              :checked="episode.watched"
              @change="toggleWatched(episode.id)"
            />
            <span class="checkmark"></span>
            <span class="watched-text">{{ episode.watched ? 'Visto' : 'No visto' }}</span>
          </label>
        </div>
        <p class="episode-description">{{ episode.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.season-episodes-view {
  background: #181a20;
  color: #fff;
  min-height: 100vh;
  padding: 1rem;
}

.header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #2a2d35;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #2a2d35;
  border: none;
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.back-button:hover {
  background: #3a3d45;
}

.header-info {
  flex: 1;
}

.header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.progress-info {
  margin-top: 0.5rem;
}

.progress-text {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 0.25rem;
  display: block;
}

.progress-bar {
  height: 6px;
  background: #2a2d35;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.25rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #6c7ae0);
  transition: width 0.3s ease;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #888;
}

.episodes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.episode-item {
  background: #2a2d35;
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s;
}

.episode-item:hover {
  transform: translateY(-2px);
}

.episode-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.episode-info {
  flex: 1;
}

.episode-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
}

.episode-date {
  margin: 0;
  font-size: 0.9rem;
  color: #888;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #4a4d55;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark {
  background: #007bff;
  border-color: #007bff;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.watched-text {
  font-size: 0.9rem;
  color: #888;
}

.episode-description {
  margin: 0;
  line-height: 1.6;
  color: #ccc;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .episode-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .checkbox-container {
    align-self: flex-end;
  }
}
</style> 
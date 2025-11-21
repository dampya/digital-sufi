import { createRouter, createWebHistory } from 'vue-router'
import Main from './../components/Main.vue'
import Games from './../components/Games.vue'
import Legal from './../components/Legal.vue'
import Scoundrel from './../components/scoundrel/Scoundrel.vue'
import Snake from './../components/snake/Snake.vue'
import Minesweeper from './../components/minesweeper/Minesweeper.vue'

const routes= [
  { path: '/', name: 'main', component: Main },
  { path: '/legal', name: 'legal', component: Legal },
  { path: '/games', name: 'games', component: Games },
  { path: '/games/scoundrel', name: 'scoundrel', component: Scoundrel},
  { path: '/games/snake', name: 'snake', component: Snake },
  { path: '/games/minesweeper', name: 'minesweeper', component: Minesweeper},
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router



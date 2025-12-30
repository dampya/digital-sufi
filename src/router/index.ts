import { createRouter, createWebHistory } from 'vue-router'
import Main from './../components/main/Main.vue'
import Games from '../components/games/Games.vue'
import Legal from './../components/main/Legal.vue'
import Scoundrel from './../components/games/scoundrel/Scoundrel.vue'
import Snake from './../components/games/snake/Snake.vue'
import Minesweeper from './../components/games/minesweeper/Minesweeper.vue'
import Whiteboard from './../components/tools/whiteboard/Whiteboard.vue'

const routes= [
  { path: '/', name: 'main', component: Main },
  { path: '/legal', name: 'legal', component: Legal },
  { path: '/games', name: 'games', component: Games },
  { path: '/games/scoundrel', name: 'scoundrel', component: Scoundrel},
  { path: '/games/snake', name: 'snake', component: Snake },
  { path: '/games/minesweeper', name: 'minesweeper', component: Minesweeper},
  { path: '/tools/whiteboard', name: 'whiteboard', component: Whiteboard},
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router



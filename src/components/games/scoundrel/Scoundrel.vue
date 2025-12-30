<style scoped src="../../../styles/games/scoundrel/scoundrel.css"></style>

<template>
  <div class="page">
    <main class="content">
      <div class="game">
        <div v-if="!gameStarted" class="start-game">
          <h3>Loading...</h3>
        </div>
        <div v-else>
          <div class="room-header">
            <div>
              <button @click="newGame"><h2>> Dungeon</h2></button>
              <ul class="metrics">
                <li>Health: {{ snapshot.health }}</li>
                <li>Deck: {{ snapshot.deckCount }}</li>
                <li>Discard: {{ snapshot.discardCount }}</li>
                <li>Room: {{ snapshot.turnNumber }}</li>
              </ul>
            </div>

            <div class="actions">
              <button @click="avoidRoom" :disabled="snapshot.previousAvoided || snapshot.room.length < 4 || snapshot.gameOver">
                Skip Room
              </button>
            </div>
          </div>

          <div class="room">
            <div class="card-container" v-for="(c, idx) in snapshot.room" :key="c.id">
              <div :class="['card', c.suit]">
                <div class="card-value">{{ c.label }}</div>
                <div class="card-suit">{{ suitSymbol(c.suit) }}</div>
              </div>

              <div class="actions">
                <template v-if="isMonster(c)">
                  <button @click="pick(idx, 'weapon')" :disabled="!canUseWeapon(c) || snapshot.gameOver || !hasWeapon">
                    Weapon
                  </button>
                  <button @click="pick(idx, 'bare')" :disabled="snapshot.gameOver">
                    Barehand
                  </button>
                </template>

                <template v-else-if="isWeapon(c)">
                  <button @click="pick(idx)" :disabled="snapshot.gameOver">Equip</button>
                </template>

                <template v-else-if="isPotion(c)">
                  <button @click="pick(idx)" :disabled="snapshot.gameOver">Heal</button>
                </template>

                <template v-else>
                  <button @click="pick(idx)" :disabled="snapshot.gameOver">Take</button>
                </template>
              </div>
            </div>
          </div>

          <div class="weapon-detail" v-if="snapshot.equipped">
            <h3>Equipped Weapon</h3>
            <div class="card">
              <div class="card-value">{{ snapshot.equipped.card.label }}</div>
              <div class="card-suit">♦</div>
            </div>

            <div class="weapon-stack">
              <div>Monsters on weapon: {{ snapshot.equipped.monsters.length }}</div>
              <ol>
                <li v-for="m in snapshot.equipped.monsters" :key="m.id">{{ m.label }} ({{ m.value }}) - {{ suitSymbol(m.suit) }}</li>
              </ol>
              <div v-if="snapshot.equipped.lastSlainValue !== null">Last slain value: {{ snapshot.equipped.lastSlainValue }}</div>
            </div>
          </div>

          <div class="gameover" v-if="snapshot.gameOver">
            <h2>Game Over</h2>
            <div v-if="snapshot.score !== undefined">
              <div v-if="snapshot.score! < 0">You died. Score: {{ snapshot.score }}</div>
              <div v-else>Dungeon cleared. Score: {{ snapshot.score }}</div>
            </div>
            <button @click="startGame">Restart</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted, onUnmounted } from 'vue';
import { Scoundrel, canUseWeaponOn, isMonster, isWeapon, isPotion } from './scoundrel';
import type { Suit, Card } from './scoundrel';

let game: Scoundrel | null = null;
const state = reactive({ snapshot: null as any });
const gameStarted = ref(false);

function refresh() {
  if (game) state.snapshot = game.snapshot();
}

function startGame() {
  if (game) game.reset(true);
  else game = new Scoundrel(true);

  gameStarted.value = true;
  refresh();
}

function newGame() {
  startGame();
}

function avoidRoom() {
  if (!game) return;
  if (game.avoidRoom()) refresh();
}

function pick(index: number, method?: 'bare' | 'weapon') {
  if (!game) return;
  const res = game.pickFromRoom(index, method ? { fightMethod: method } : undefined);
  if (!res.ok) console.warn('Pick failed:', (res as any).reason);
  refresh();
}

const snapshot = computed(() => state.snapshot || {});
const hasWeapon = computed(() => !!snapshot.value?.equipped);

function canUseWeapon(c: Card) {
  return canUseWeaponOn(snapshot.value?.equipped || null, c);
}

function suitSymbol(s: Suit) {
  switch (s) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
  }
}

onMounted(() => startGame());

onUnmounted(() => {
  game = null;
});
</script>


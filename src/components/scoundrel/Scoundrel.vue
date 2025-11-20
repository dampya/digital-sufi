<style scoped src="./../../styles/scoundrel/scoundrel.css"></style>

<template>
  <div class="page">
    <main class="content">

      <section>
        <h1>Scoundrel</h1>
        <h3>A solitaire rogue-like card game by Zach Gage and Kurt Bieg.</h3>

        <h2>Rules</h2>
        <p>Fight through a dungeon built from a standard deck of cards, managing health, weapons, and monsters.</p>
        <ul>
          <li>Deck setup: remove Jokers, all red face cards (J/Q/K Diamonds/Hearts), and red Aces (A Diamonds/Hearts). Shuffle the rest.</li>
          <li>Card roles: Clubs/Spades are Monsters (value 2–14), Diamonds are Weapons (value 2–10), Hearts are Potions (value 2–10).</li>
          <li>Room: reveal until 4 face up. You may avoid (place all 4 on bottom). You cannot avoid twice in a row.</li>
          <li>Turn: if you don’t avoid, you must resolve exactly 3 of the 4 cards, one by one, leaving 1 for next Room.</li>
          <li>Weapons: binding; equipping discards the previous weapon and all monsters stacked on it.</li>
          <li>Potions: heal up to 20; only one per turn. A second potion that turn is discarded with no effect.</li>
          <li>Combat with weapon: stack the monster on the weapon. You take max(0, monster − weapon) damage.</li>
          <li>Weapon restriction: after a weapon slays a monster of value X, it can only be used on monsters of value ≤ X next.</li>
          <li>Game end: when health ≤ 0 or you reach the end of the dungeon.</li>
          <li>Scoring on death: subtract the values of all remaining monsters in deck and room from your current health (result is negative score).</li>
          <li>Scoring on success: your life is your score, except if your life is 20 and your last card was a heart, add that potion’s value.</li>
        </ul>
        <p>Great video explanation by youtuber Rulies. <a href="https://www.youtube.com/watch?v=Gt2tYzM93h4" target="_blank">[Link]</a></p>
      </section>

      <br />

      <div class="game">
        <div v-if="!gameStarted" class="start-game">
          <h3 @click="startGame">[Start]</h3>
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
import { reactive, computed, ref } from 'vue';
import { Scoundrel, canUseWeaponOn, isMonster, isWeapon, isPotion } from './scoundrel';
import type { Suit, Card } from './scoundrel';

const game = new Scoundrel(true);
const state = reactive({ snapshot: game.snapshot() });

const gameStarted = ref(false);

function refresh() {
  state.snapshot = game.snapshot();
}

function startGame() {
  gameStarted.value = true;
  game.reset(true);
  refresh();
}

function newGame() {
  startGame();
}

function avoidRoom() {
  if (game.avoidRoom()) refresh();
}

function pick(index: number, method?: 'bare' | 'weapon') {
  const res = game.pickFromRoom(index, method ? { fightMethod: method } : undefined);
  if (!res.ok) console.warn('Pick failed:', (res as any).reason);
  refresh();
}

const snapshot = computed(() => state.snapshot);
const hasWeapon = computed(() => !!snapshot.value.equipped);

function canUseWeapon(c: Card) {
  return canUseWeaponOn(snapshot.value.equipped || null, c);
}

function suitSymbol(s: Suit) {
  switch (s) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
  }
}

refresh();
</script>


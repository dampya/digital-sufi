<style scoped src="../../styles/minesweeper/minesweeper.css"></style>

<template>
  <div class="page">
    <main class="content">
      <div class="minesweeper-wrapper">
        <div class="minesweeper-game">
          <div class="minesweeper-gameover-wrapper">
            <div v-if="state.gameOver || state.gameWon" class="minesweeper-gameover">
              <h1 v-if="state.gameOver">Game Over</h1>
              <h1 v-if="state.gameWon">Victory</h1>
              <h3 @click="restartGame">[Restart]</h3>
            </div>
          </div>
          <canvas
            ref="canvas"
            class="minesweeper-canvas"
            :class="{ 'game-over': state.gameOver }"
          ></canvas>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { initMinesweeperGame, MinesweeperState } from "./minesweeper";

const canvas = ref<HTMLCanvasElement | null>(null);
const state = reactive<MinesweeperState>({
  cells: [],
  gameOver: false,
  gameWon: false,
  rows: 10,
  cols: 10,
});

let cleanup: (() => void) | null = null;

function startGame() {
  state.gameOver = false;
  state.gameWon = false;
  if (cleanup) cleanup();
  cleanup = initMinesweeperGame(canvas.value!, state);
}

function restartGame() {
  startGame();
}

onMounted(() => {
  startGame();
});

onUnmounted(() => {
  if (cleanup) cleanup();
});
</script>


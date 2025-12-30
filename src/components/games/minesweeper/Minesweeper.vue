<style scoped src="../../../styles/games/minesweeper/minesweeper.css"></style>

<template>
  <div class="page">
    <main class="content">
      <div class="minesweeper-wrapper">
        <div class="minesweeper-game">
          <div v-if="!state.gameWon" class="minesweeper-status">
            <span>Mines: {{ totalMines }}</span>
            <span>Flags: {{ flagsPlaced }}</span>
            <span>Revealed: {{ revealedCells }}</span>
            <span>Remaining: {{ remainingCells }}</span>
          </div>
          <canvas
            ref="canvas"
            class="minesweeper-canvas"
            :class="{ 'game-over': state.gameOver }"
          ></canvas>
          <div class="minesweeper-gameover-wrapper">
            <div v-if="state.gameOver || state.gameWon" class="minesweeper-gameover">
              <h1 v-if="state.gameOver">Game Over</h1>
              <h1 v-if="state.gameWon">Victory</h1>
              <h3 @click="restartGame">[Restart]</h3>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
import { initMinesweeperGame } from "./minesweeper";
import type { MinesweeperState } from "./minesweeper";

const canvas = ref<HTMLCanvasElement | null>(null);
const state = reactive<MinesweeperState>({
  cells: [],
  gameOver: false,
  gameWon: false,
  rows: 10,
  cols: 10,
});

let cleanup: (() => void) | null = null;

// Computed stats
const totalMines = computed(() => {
  if (!state.cells || state.cells.length === 0) return 0;
  let count = 0;
  for (const row of state.cells) {
    if (row) {
      for (const cell of row) {
        if (cell && cell.isMine) count++;
      }
    }
  }
  return count;
});

const flagsPlaced = computed(() => {
  if (!state.cells || state.cells.length === 0) return 0;
  let count = 0;
  for (const row of state.cells) {
    if (row) {
      for (const cell of row) {
        if (cell && cell.isFlagged) count++;
      }
    }
  }
  return count;
});

const revealedCells = computed(() => {
  if (!state.cells || state.cells.length === 0) return 0;
  let count = 0;
  for (const row of state.cells) {
    if (row) {
      for (const cell of row) {
        if (cell && cell.isRevealed) count++;
      }
    }
  }
  return count;
});

const remainingCells = computed(() => {
  if (!state.cells || state.cells.length === 0) return 0;
  const total = state.rows * state.cols;
  return total - revealedCells.value - totalMines.value;
});

// Force re-render stats when state changes
watch(() => state.cells, () => {
  // Trigger reactivity
}, { deep: true });

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


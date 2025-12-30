<style scoped src="../../../styles/games/snake/snake.css"></style>

<template>
  <div class="page">
    <main class="content">
      <div class="snake-wrapper">
        <div class="snake-game">
          <div v-if="!gameStarted && !state.gameOver" class="snake-gameover">
            <h3 @click="startGame">[Start]</h3>
          </div>
          <div v-if="state.gameOver" class="snake-gameover">
            <h1>Score: {{ state.length }}</h1>
            <h3 @click="restartGame">[Restart]</h3>
          </div>
          <div v-if="gameStarted" class="snake-status">
            <span>&nbsp X: {{ state.headX }}</span>
            <span>Y: {{ state.headY }}</span>
            <span>Speed: {{ currentSpeed }}</span>
            <span>Length: {{ state.length }}</span>
          </div>
          <canvas ref="canvas" class="snake-canvas"></canvas>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { initSnakeGame } from "./snake";
import type { SnakeState } from "./snake";

const canvas = ref<HTMLCanvasElement | null>(null);
const state = reactive<SnakeState>({
  headX: 0,
  headY: 0,
  length: 0,
  gameOver: false
});

const gameStarted = ref(false);
const initialSpeed = 10;
const currentSpeed = ref(initialSpeed);

let cleanup: (() => void) | null = null;

// Automatically adjust speed based on length
watch(
  () => state.length,
  (len) => {
    const newSpeed = Math.min(initialSpeed + Math.floor(len / 5), 15);
    currentSpeed.value = newSpeed;
  }
);

function startGame() {
  gameStarted.value = true;
  currentSpeed.value = initialSpeed;

  if (cleanup) cleanup();
  cleanup = initSnakeGame(canvas.value!, state, currentSpeed.value);
}

function restartGame() {
  startGame();
}
</script>


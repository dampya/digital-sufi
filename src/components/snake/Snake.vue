<style scoped src="../../styles/snake/snake.css"></style>

<template>
  <div class="page">
    <main class="content">
      <h1>Snake</h1>
      <p>Eat apples to grow bigger. Control with arrow keys.</p>

      <br />
      <br />
      <div class="snake-wrapper">
        <div class="snake-game">
          <div v-if="gameStarted" class="snake-status">
            <span>&nbsp X: {{ state.headX }}</span>
            <span>Y: {{ state.headY }}</span>
            <span>Speed: {{ currentSpeed }}</span>
          </div>

          <canvas ref="canvas" class="snake-canvas"></canvas>

          <div v-if="!gameStarted" class="snake-gameover">
            <button @click="startGame">Start</button>
          </div>

          <div v-if="state.gameOver && gameStarted" class="snake-gameover">
            <h1>Score: {{ state.length }}</h1>
            <button @click="startGame">Restart</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted, watch } from "vue";
import { initSnakeGame, SnakeState } from "./snake";

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

onUnmounted(() => {
  if (cleanup) cleanup();
});
</script>


<style scoped src="../../../styles/tools/whiteboard/whiteboard.css"></style>

<template>
  <div class="whiteboard-page">
    <div class="whiteboard-wrapper">
      <canvas
        ref="canvas"
        class="whiteboard-canvas"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { initWhiteboard } from "./whiteboard";
import type { WhiteboardState } from "./whiteboard";

const canvas = ref<HTMLCanvasElement | null>(null);
const state = reactive<WhiteboardState>({
  cells: [],
  rows: 0,
  cols: 0,
  cellSize: 12,
});

let cleanup: (() => void) | null = null;

function startWhiteboard() {
  if (cleanup) cleanup();
  if (canvas.value) {
    cleanup = initWhiteboard(canvas.value, state);
  }
}

onMounted(() => {
  startWhiteboard();
});

onUnmounted(() => {
  if (cleanup) cleanup();
});
</script>


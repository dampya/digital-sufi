<style scoped src="../../styles/tools/tools.css"></style>

<template>
  <div class="page">
    <main class="content">
      <h1>Tools</h1>
      <br />
      <section>
        <h2>
          <router-link to="/tools/whiteboard">Whiteboard</router-link>
        </h2>
        <p>
          An interactive grid-based whiteboard that allows freeform drawing and erasing directly in the browser.
        </p>
        <h3>Controls</h3>
        <ul>
          <li><strong>Left Click</strong> — Draw on the grid</li>
          <li><strong>Right Click</strong> — Erase cells from the grid</li>
          <li>Drawing snaps to grid cells for precision</li>
          <li>Supports continuous drawing by dragging the mouse</li>
          <li>Right-click erasing works the same way for fast corrections</li>
          <li>Designed for quick sketches, diagrams, and problem-solving</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "Tools",
};
</script>



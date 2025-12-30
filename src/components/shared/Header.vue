<style scoped src="../../styles/shared/header.css"></style>

<template>
  <div class="tree-container">
    <span class="tree-root" @click="toggleMenu">
      {{ isOpen ? '<' : '>' }}
    </span>
    <div v-if="isOpen" class="tree">
      <div class="tree-branch">
        <router-link to="/" class="tree-node">@ main</router-link>
        <div class="tree-leaf">
          <span class="tree-connector">└─</span>
          <router-link to="/legal">legal</router-link>
        </div>
      </div>
      <div class="tree-branch">
        <router-link to="/projects" class="tree-node">@ projects</router-link>
        <div class="tree-leaf">
          <span class="tree-connector">├─</span>
          <router-link to="/projects/ragc">ragc</router-link>
        </div>
        <div class="tree-leaf">
          <span class="tree-connector">├─</span>
          <router-link to="/projects/voip">voip</router-link>
        </div>
        <div class="tree-leaf">
          <span class="tree-connector">└─</span>
          <router-link to="/projects/irc">irc</router-link>
        </div>
      </div>
      <div class="tree-branch">
        <router-link to="/tools" class="tree-node">@ tools</router-link>
        <div class="tree-leaf">
          <span class="tree-connector">└─</span>
          <router-link to="/tools/whiteboard">whiteboard</router-link>
        </div>
      </div>
      <div class="tree-branch">
        <router-link to="/games" class="tree-node">@ games</router-link>
        <div class="tree-leaf">
          <span class="tree-connector">├─</span>
          <router-link to="/games/scoundrel">scoundrel</router-link>
        </div>
        <div class="tree-leaf">
          <span class="tree-connector">├─</span>
          <router-link to="/games/snake">snake</router-link>
        </div>
        <div class="tree-leaf">
          <span class="tree-connector">└─</span>
          <router-link to="/games/minesweeper">minesweeper</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      isOpen: window.innerWidth >= 800,
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    handleResize() {
      if (window.innerWidth < 800 && this.isOpen) {
        this.isOpen = false;
      } else if (window.innerWidth >= 800 && !this.isOpen) {
        this.isOpen = true;
      }
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>


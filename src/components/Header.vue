<style scoped src="./../styles/shared/header.css"></style>

<template>
  <ul class="menu">
    <span @click="toggleMenu">
      {{ isOpen ? '<' : '>' }}
    </span>
    <ul v-if="isOpen">
      <li>
        <router-link to="/">@ main</router-link>
      </li>
      <li>
        <router-link to="/legal">[_ legal</router-link>
      </li>
    </ul>
    <ul v-if="isOpen">
      <li>
        <router-link to="/games">@ games</router-link>
      </li>
      <li>
        <router-link to="/games/scoundrel">[_ scoundrel</router-link>
      </li>
      <li>
        <router-link to="/games/snake">[__ snake</router-link>
      </li>
      <li>
        <router-link to="/games/minesweeper">[___ minesweeper</router-link>
      </li>
    </ul>
  </ul>
  <br v-if="isOpen">
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
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
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
  }
};
</script>


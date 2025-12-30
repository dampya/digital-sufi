<style src="./styles/shared/base.css"></style>

<template>
  <Header />
  <router-view />
  <Footer />
</template>

<script setup lang="ts">
  import Header from './components/shared/Header.vue'
  import Footer from './components/shared/Footer.vue'
</script>

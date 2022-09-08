<script setup lang="ts"></script>

<template>
  <section>
    <h1 class="mb-4">Camera / PWA / Vue</h1>
    <div class="m-4 text-center">
      <h2>video approach</h2>
      <router-link to="/camera" type="button" class="btn btn-primary">Start Camera</router-link>
    </div>
    <div class="m-4 text-center">
      <h2>input/capture approach</h2>
      <router-link to="/capture" type="button" class="btn btn-primary">Start Camera</router-link>
    </div>
  </section>
</template>

<style scoped>
section {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

section p {
  width: 100%;
  text-align: center;
}
</style>

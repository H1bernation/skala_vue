<script setup>
const welcomeMessage = 'Welcome to SKALA-Vue'
</script>

<template>
  <div>
    <h2>{{ welcomeMessae }}</h2>
    <p>{{ welcomeMessage.toUpperCase() }}</p>
    <p>
      {{ 'Random number : ' + Math.ceil(Math.random() * 100) }}
    </p>
  </div>
</template>

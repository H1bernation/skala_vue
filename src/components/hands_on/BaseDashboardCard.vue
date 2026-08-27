<script setup></script>

<template>
  <section class="dashboard-card">
    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  background: #f7f8fa;
  border: 1px solid #e3e5e9;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 16px;
}
</style>

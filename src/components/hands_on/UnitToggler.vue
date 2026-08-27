<script setup>
import { useConfigStore } from '../../stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <button class="unit-toggler" @click="configStore.toggleUnit">
    단위 : {{ configStore.unitSymbol }}
  </button>
</template>

<style scoped>
.unit-toggler {
  padding: 6px 14px;
  border: 1px solid #d5d8dd;
  border-radius: 999px;
  background: #ffffff;
  color: #2b2f36;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.unit-toggler:hover {
  background: #f2f4f7;
}
</style>

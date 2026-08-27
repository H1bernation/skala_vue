<script setup>
const props = defineProps({
  hotThreshold: {
    type: Number,
    required: true,
  },
  hotCityCount: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update-threshold'])
const sendToParent = (newValue) => {
  console.log('[HotThresholdControl] 온도를 변경했습니다.:', newValue)
  emit('update-threshold', newValue)
}
</script>

<template>
  <div class="threshold-section">
    <label class="threshold-label">
      더운 도시 기준
      <span class="threshold-input-wrap">
        <input
          type="number"
          class="threshold-input"
          :value="hotThreshold"
          @input="sendToParent(Number($event.target.value))"
        />
        <span class="threshold-unit">°C</span>
      </span>
    </label>
    <p class="threshold-result">
      현재 기준 이상 도시 <strong>{{ hotCityCount }}개</strong>
    </p>
  </div>
</template>

<style scoped>
.threshold-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.threshold-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #2b2f36;
}

.threshold-input-wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #d5d8dd;
  border-radius: 8px;
  padding: 4px 10px;
}

.threshold-input {
  width: 52px;
  border: none;
  outline: none;
  font-size: 14px;
  text-align: center;
  color: #2b2f36;
  background: transparent;
}

.threshold-input-wrap:focus-within {
  border-color: #7aa5ff;
}

.threshold-unit {
  font-size: 13px;
  color: #6b7078;
}

.threshold-result {
  font-size: 13px;
  color: #6b7078;
  margin: 0;
}

.threshold-result strong {
  color: #b5560a;
  font-weight: 700;
}

@media (max-width: 420px) {
  .threshold-section {
    justify-content: flex-start;
  }

  .threshold-result {
    width: 100%;
  }
}
</style>

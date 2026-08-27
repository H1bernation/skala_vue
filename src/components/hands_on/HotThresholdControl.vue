<script setup>
// "더운 도시 기준" 입력 영역. 기준 온도를 입력받고, 그 기준 이상인 도시 수를 보여준다.
//
// 변경 이력
// - UI 개선: 숫자 input을 el-input-number로 교체(단방향 바인딩 구조는 그대로 유지)
defineProps({
  // hotThreshold: 부모가 관리하는 현재 기준 온도(선택된 단위 기준 숫자)
  hotThreshold: {
    type: Number,
    required: true,
  },
  // hotCityCount: 기준 온도 이상인 도시 개수
  hotCityCount: {
    type: Number,
    required: true,
  },
  // unitSymbol: 현재 단위 기호(°C/°F). configStore.unit에 따라 부모가 내려준다.
  unitSymbol: {
    type: String,
    default: '°C',
  },
})

const emit = defineEmits([
  // update-threshold: 기준 온도 입력값이 바뀔 때 새 값을 부모에 전달
  'update-threshold',
])
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
        <el-input-number
          class="threshold-input"
          :model-value="hotThreshold"
          :controls="false"
          size="small"
          @input="sendToParent"
        />
        <span class="threshold-unit">{{ unitSymbol }}</span>
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
}

.threshold-input {
  width: 80px;
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

<script setup>
import { useConfigStore } from '../../stores/configStore'

// 섭씨/화씨 단위를 전환하는 스위치. Navigation Bar 옆에 배치되어
// configStore의 unitSymbol을 표시하고 클릭 시 toggleUnit을 호출한다.
//
// 변경 이력
// - UI 개선: 버튼을 el-switch로 교체(토글 로직은 기존 toggleUnit 그대로 사용)
const configStore = useConfigStore()
</script>

<template>
  <el-switch
    class="unit-toggler"
    :model-value="configStore.unit === 'fahrenheit'"
    active-text="℉"
    inactive-text="℃"
    @change="configStore.toggleUnit"
  />
</template>

<style scoped>
.unit-toggler {
  --el-switch-on-color: #2a6fd6;
}
</style>

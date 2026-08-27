<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

const count = ref(0)
let timerId = null

// 생성 단계
console.log('1. 생성 단계 - setup() 호출 -- DOM 접근 불가능')

// 부착 단계
onMounted(() => {
  console.log('2. 부착 단계 - onMounted() 호출 -- DOM 접근 가능')
  timerId = setInterval(() => {
    count.value++
  }, 3000)
})

// 갱신 단계, count 값이 변경 -> 화면이 리렌더링 될 때마다 매번 실행
onUpdated(() => {
  console.log(
    `3. [onUpdated] 갱신 단계 - onUpdated() 호출로 화면을 새로 그렸습니다. (현재 count : ${count.value})`,
  )
})

//소멸 단계 : 이 컴포넌트가 화면에서 완전히 파괴되어 사라짐

onUnmounted(() => {
  clearInterval(timerId)
  console.log('4. 컴포넌트가 소멸했습니다. 타이머 청소 완료!')
})
</script>

<template>
  <div class="lifecycle-explorer">
    <h3>⏱️ 라이프사이클 훅 흐름 탐색기</h3>
    <div class="timer-box">
      <p class="timer-count">실시간 타이머 카운트: {{ count }}</p>
      <button class="increase-button" @click="count++">수동으로 숫자 올리기</button>
    </div>
  </div>
</template>

<style scoped>
.lifecycle-explorer {
  text-align: left;
}

.lifecycle-explorer h3 {
  margin: 0 0 12px;
  font-size: 16px;
}

.timer-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px;
  border-radius: 8px;
  background: #d9f2f0;
}

.timer-count {
  margin: 0;
  font-size: 15px;
  color: #1f2937;
}

.increase-button {
  padding: 8px 16px;
  border: 1px solid #c7ccd3;
  border-radius: 6px;
  background: #eef0f3;
  color: #2b2f36;
  font-size: 14px;
  cursor: pointer;
}

.increase-button:hover {
  background: #e2e5ea;
}
</style>

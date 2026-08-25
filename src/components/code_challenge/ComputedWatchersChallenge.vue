<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// computed 가 실제로 의존하는 값
const count = ref(0)

const dummy = ref(0)

const getMethodResult = () => {
  console.log('일반 함수 실행')
  return count.value * 2
}

// computed 실습용
const doubleCount = computed(() => {
  console.log('computed 실행')
  return count.value * 2
})

// watch 실습용
const currentCity = ref('서울')
const logMessage = ref('아직 변경되지 않았습니다.')

watch(currentCity, (newValue, oldValue) => {
  logMessage.value = `${oldValue} -> ${newValue}로 변경되었습니다. `

  console.log(`[watch 실행] ${oldValue}에서 ${newValue}로 변경됨`)
})

// 3. 전체 감시 vs 특정 속성 감시
const user = ref({
  name: '홍길동',
  age: 20,
})

const deepLog = ref('변경 없음')
const ageLog = ref('변경 없음')

// 3-1. 객체 내부 전체 감시
watch(
  user,
  (newValue) => {
    console.log('🔍 deep watch 실행')

    deepLog.value = `현재 이름 : ${newValue.name}, 나이 :${newValue.age}`
  },
  { deep: true },
)

watch(
  // 3-2. 특정 변수 감시
  () => user.value.age,
  (newAge, oldAge) => {
    ageLog.value = `${oldAge}세 → ${newAge}세`
    console.log(`🎯 age watch 실행: ${oldAge} → ${newAge}`)
  },
)

const username = ref('홍길동')
const age = ref(20)
const effectLog = ref('대기중...')

watchEffect(() => {
  effectLog.value = `이름 : ${username.value}. 나이 : ${age.value}세`

  console.log(`[watchEffect 실행] ${username.value} / ${age.value}세`)
})
</script>

<template>
  <section>
    <h2>Computed & Watchers Challenge</h2>

    <h3>1. computed()</h3>

    <p>count : {{ count }} / dummy : {{ dummy }}</p>

    <button @click="count++">count 증가</button>

    <button @click="dummy++">dummy 증가</button>

    <p>일반 함수 결과 : {{ getMethodResult() }}</p>

    <p>Computed 결과 : {{ doubleCount }}</p>

    <h3>2. watch()</h3>

    <p>현재 도시: {{ currentCity }}</p>

    <button @click="currentCity = '서울'">서울</button>

    <button @click="currentCity = '수원'">수원</button>

    <button @click="currentCity = '부산'">부산</button>

    <p>{{ logMessage }}</p>

    <h3>3. 객체 watch()</h3>

    <p>이름: {{ user.name }} / 나이: {{ user.age }}</p>

    <button @click="user.name = '이순신'">이름 변경</button>

    <button @click="user.age++">나이 증가</button>

    <p>전체 감시: {{ deepLog }}</p>
    <p>나이 감시: {{ ageLog }}</p>

    <h3>4. watchEffect()</h3>

    <p>이름: {{ username }} / 나이: {{ age }}</p>

    <button @click="username = '이순신'">이름 변경</button>

    <button @click="age++">나이 증가</button>

    <p>{{ effectLog }}</p>
  </section>
</template>

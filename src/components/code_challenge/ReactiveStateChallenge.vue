<script setup>
import { ref, reactive } from 'vue'

// ====================
// 1. ref() 실습
// ====================

const count = ref(0)
const name = ref('홍길동')
const isActive = ref(true)

const itemsRef = ref(['사과', '배'])

const userRef = ref({
  name: '이순신',
  age: 30,
})

const increaseRef = () => {
  count.value++
}

const changeUserName = () => {
  userRef.value.name = '장보고'
}

// ====================
// 2. reactive() 실습
// ====================

const userReactive = reactive({
  name: '이순신',
  age: 30,
})

const itemsReactive = reactive(['사과', '바나나'])

const celebrateReactive = () => {
  userReactive.age++
}

const addItem = () => {
  itemsReactive.push(`과일 ${itemsReactive.length + 1}`)
}

const removeItem = (index) => {
  itemsReactive.splice(index, 1)
}
</script>

<template>
  <section>
    <h2>Reactive State Challenge</h2>

    <hr />

    <h3>1. ref()</h3>

    <p>
      Count:
      <strong>{{ count }}</strong>
    </p>

    <p>
      이름:
      <input v-model="name" />
      {{ name }}
    </p>

    <p>
      활성 상태:
      {{ isActive ? '활성' : '비활성' }}
    </p>

    <p>
      과일 목록:
      {{ itemsRef.join(', ') }}
    </p>

    <p>
      사용자 정보:
      {{ userRef.name }} / {{ userRef.age }}세
    </p>

    <button @click="increaseRef">Count 증가</button>

    <button @click="isActive = !isActive">활성 상태 토글</button>

    <button @click="itemsRef.push('귤')">과일 추가</button>

    <button @click="changeUserName">사용자 이름 변경</button>

    <hr />

    <h3>2. reactive()</h3>

    <p>이름: {{ userReactive.name }} / 나이: {{ userReactive.age }}세</p>

    <button @click="celebrateReactive">나이 한 살 추가</button>

    <h4>과일 목록</h4>

    <ul>
      <li v-for="(item, index) in itemsReactive" :key="index">
        {{ item }}

        <button @click="removeItem(index)">삭제</button>
      </li>
    </ul>

    <button @click="addItem">과일 추가</button>
  </section>
</template>

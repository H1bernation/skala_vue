<script setup>
import { ref } from 'vue'

// v-model 사용값
const text1 = ref('')

// v-model의 내부 원리를 확인할 값
const text2 = ref('')

//HTML Form 요소에 따른 값 확인
const comment = ref('')
const isAgreed = ref(false)
const favoriteFruits = ref([])
const gender = ref('')
const selectedCar = ref('')
</script>

<template>
  <div>
    <h1>Vue Form Handling Code Challenge</h1>

    <h2>1. v-model 양방향 데이터 바인딩</h2>

    <h3>v-model 사용</h3>

    <input type="text" v-model="text1" placeholder="여기에 입력하세요" />

    <p>입력된 값 : {{ text1 }}</p>
    <h3>v-model 내부 원리</h3>

    <input
      type="text2"
      :value="text2"
      @input="(e) => (text2 = e.target.value)"
      placeholder="원리 확인용"
    />

    <p>입력된 값 : {{ text2 }}</p>

    <hr />

    <h2>2. HTML Form 요소와 v-model</h2>

    <h3>Textarea</h3>
    <textarea v-model="comment" placeholder="의견을 남겨주세요"></textarea>
    <p>데이터 상태: {{ comment }}</p>
  </div>
</template>

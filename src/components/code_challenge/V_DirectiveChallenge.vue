<script setup>
import { ref } from 'vue'
// v-html
const rawHtmlData =
  '이 글자는 <span style = "color : red; font-weight: bold;"> 빨간색 굵은 글자</span>이다.'
// v-text
const content = '안녕하세요! <strong>Skala-Vue</strong> 강의입니다.'
const dynamicUrl = 'https://www.naver.com'
const logoImgSrc = 'https://vuejs.org/images/logo.png'
const isButtonDisabled = ref(true)
</script>

<template>
  <div>
    <!-- ==================== v-html ==================== -->
    <h2>v-html 실습</h2>

    <h3>1. 일반 Text Interpolation</h3>
    <p>{{ rawHtmlData }}</p>

    <h3>2. v-html</h3>
    <p v-html="rawHtmlData"></p>

    <hr />

    <!-- ==================== v-text ==================== -->
    <h2>v-text 실습</h2>

    <h3>1. 일반 Text Interpolation</h3>
    <p>출력 : {{ content }}</p>

    <h3>2. v-text</h3>
    <p v-html="content"></p>

    <hr />

    <!-- ==================== v-bind ==================== -->
    <h2>v-bind 실습</h2>

    <h3>1. 링크 주소 동적 연결</h3>
    <a :href="dynamicUrl">네이버 이동</a>

    <h3>2. 이미지 주소 동적 연결</h3>
    <img :src="logoImgSrc" alt="Vue 로고" width="100" />

    <h3>3. 버튼 비활성화 제어</h3>
    <p>현재 버튼 사용 불가능 상태 : {{ isButtonDisabled }}</p>
    <button :disabled="isButtonDisabled">클릭 가능한 버튼</button>
    <button @click="isButtonDisabled = !isButtonDisabled">잠금 상태 변경</button>

    <hr />

    <button @click="showAlert">알림 띄우기</button>
  </div>
</template>

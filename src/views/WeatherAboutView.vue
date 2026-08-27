<script setup></script>

<template>
  <main class="about-page">
    <h1>서비스 소개</h1>
    <p class="about-text">
      Weather Dashboard는 도시별 날씨 정보를 검색하고, 기준 온도를 직접 설정해 더운 도시를
      한눈에 확인할 수 있는 날씨 대시보드 서비스입니다.
    </p>
    <RouterLink to="/" class="back-link">← 대시보드로 돌아가기</RouterLink>
  </main>
</template>

<style scoped>
.about-page {
  max-width: 480px;
  margin: 0 auto;
  padding: 32px 20px 60px;
  text-align: center;
  color: #2b2f36;
}

.about-page h1 {
  font-size: 24px;
  margin: 0 0 16px;
}

.about-text {
  font-size: 14px;
  line-height: 1.6;
  color: #6b7078;
  margin: 0 0 24px;
}

.back-link {
  font-size: 14px;
  color: #2b5fb3;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>

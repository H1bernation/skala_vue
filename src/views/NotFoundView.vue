<script setup></script>

<template>
  <main class="not-found-page">
    <h1>404</h1>
    <p class="not-found-text">요청하신 페이지를 찾을 수 없습니다.</p>
    <RouterLink to="/" class="back-link">← 대시보드로 돌아가기</RouterLink>
  </main>
</template>

<style scoped>
.not-found-page {
  max-width: 480px;
  margin: 0 auto;
  padding: 60px 20px;
  text-align: center;
  color: #2b2f36;
}

.not-found-page h1 {
  font-size: 48px;
  margin: 0 0 12px;
}

.not-found-text {
  font-size: 14px;
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

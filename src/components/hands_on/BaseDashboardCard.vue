<script setup>
// 검색, 기준 온도, 날씨 목록 등 여러 대시보드 영역에서 공통으로 쓰는 카드형 레이아웃.
// 자체 상태 없이 slot으로 받은 내용을 그대로 감싸서 보여준다.
</script>

<template>
  <section class="dashboard-card">
    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  background: #f7f8fa;
  border: 1px solid #e3e5e9;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 16px;
}
</style>

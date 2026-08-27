<script setup>
import { useRouter } from 'vue-router'

// 정의되지 않은 모든 경로(catch-all)에서 보여주는 404 화면.
//
// 변경 이력
// - UI 개선: el-result로 화면 구성 교체
const router = useRouter()
</script>

<template>
  <main class="not-found-page">
    <el-result icon="warning" title="404" sub-title="요청하신 페이지를 찾을 수 없습니다.">
      <template #extra>
        <el-button type="primary" @click="router.push('/')">메인으로 이동</el-button>
      </template>
    </el-result>
  </main>
</template>

<style scoped>
.not-found-page {
  max-width: 480px;
  margin: 0 auto;
  padding: 60px 20px;
}
</style>

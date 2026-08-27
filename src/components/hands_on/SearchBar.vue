<script setup>
// 도시 검색 input과 "입력한 도시" 안내 문구를 담당한다.
// 검색어 상태는 부모가 갖고 있고, 이 컴포넌트는 값을 받아 보여주고 입력 이벤트만 올려보낸다.
//
// 변경 이력
// - UI 개선: 기본 input을 el-input으로 교체(단방향 바인딩 구조는 그대로 유지)
// - UI 개선: 카드 전체 폭까지 늘어나던 레이아웃을 폭 제한 + 세로 배치로 정돈, 돋보기 아이콘 추가
defineProps({
  // query: 부모가 관리하는 현재 검색어
  query: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  // update-query: 입력값이 바뀔 때 새 검색어를 부모에 전달
  'update-query',
])
const sendToParent = (newValue) => {
  console.log('[SearchBar] 검색어 변경 이벤트를 보냈습니다:', newValue)
  emit('update-query', newValue)
}
</script>

<template>
  <div class="search-bar">
    <!-- el-input으로 바꿔도 :model-value + @input은 기존과 같은 단방향 바인딩이다(v-model 아님). -->
    <el-input
      class="search-input"
      :model-value="query"
      @input="sendToParent"
      placeholder="도시 또는 지역을 검색하세요 (예: 서울)"
      clearable
    >
      <template #prefix><span class="search-icon">⌕</span></template>
    </el-input>
    <p class="search-result">입력한 도시 : {{ query }}</p>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* el-input의 폭은 --el-input-width로 결정되므로 이 변수를 직접 덮어써서 고정한다. */
.search-input {
  --el-input-width: 420px;
  width: 420px;
  max-width: 100%;
}

/* prefix 아이콘에 고정 너비를 줘야 el-input이 입력창 안쪽 여백을 정확히 계산한다. */
.search-icon {
  display: inline-flex;
  width: 18px;
  align-items: center;
  justify-content: center;
  color: #8a97a8;
  font-size: 15px;
}

.search-result {
  font-size: 13px;
  color: #6b7078;
  margin: 0;
}
</style>

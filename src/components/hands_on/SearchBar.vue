<script setup>
// 도시 검색 input과 "입력한 도시" 안내 문구를 담당한다.
// 검색어 상태는 부모가 갖고 있고, 이 컴포넌트는 값을 받아 보여주고 입력 이벤트만 올려보낸다.
const props = defineProps({
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
    <input
      class="search-input"
      :value="query"
      @input="sendToParent($event.target.value)"
      placeholder="도시를 입력하세요 (예: 서울)"
    />
    <p class="search-result">입력한 도시 : {{ query }}</p>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 10px 12px;
  border: 1px solid #d5d8dd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #7aa5ff;
}

.search-result {
  font-size: 13px;
  color: #6b7078;
  margin: 0;
}
</style>

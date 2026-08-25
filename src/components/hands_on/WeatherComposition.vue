<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

const searchQuery = ref('')
const selectedCityInfo = ref('')
const hotThreshold = ref(30)
const filteredWeatherList = computed(() => {
  return weatherList.value.filter((weather) => weather.name.includes(searchQuery.value))
})
const showDetail = (humidity) => {
  alert(`현재 습도는 ${humidity}%입니다.`)
}
watch(selectedCityInfo, (newValue, oldValue) => {
  console.log(`선택 도시 변경: ${oldValue} -> ${newValue}`)
})

watch(hotThreshold, (newValue, oldValue) => {
  console.log(`기준 온도 변경: ${oldValue}도 -> ${newValue}도`)
})

watchEffect(() => {
  console.log(`검색어 : ${searchQuery.value}`)
})

const hotCityCount = computed(() => {
  return weatherList.value.filter((weather) => weather.temp >= hotThreshold.value).length
})
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 31, status: '맑음', emoji: '☀️', humidity: 70 },
  { id: 'city_02', name: '강릉', temp: 27, status: '구름', emoji: '☁️', humidity: 50 },
  { id: 'city_03', name: '부산', temp: 29, status: '소나기', emoji: '🌦️', humidity: 80 },
  { id: 'city_04', name: '제주', temp: 26, status: '비', emoji: '🌧️', humidity: 84 },
  { id: 'city_05', name: '대구', temp: 37, status: '맑음', emoji: '☀️', humidity: 30 },
])
</script>

<template>
  <main class="weather-page">
    <header class="weather-header">
      <h1>날씨 현황</h1>
      <span class="summary-badge">🔥 더운 도시 {{ hotCityCount }}개</span>
    </header>

    <section class="search-section">
      <input
        class="search-input"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="도시를 입력하세요 (예: 서울)"
      />
      <p class="search-result">입력한 도시 : {{ searchQuery }}</p>
    </section>

    <section class="threshold-section">
      <label class="threshold-label">
        더운 도시 기준
        <span class="threshold-input-wrap">
          <input type="number" class="threshold-input" v-model.number="hotThreshold" />
          <span class="threshold-unit">°C</span>
        </span>
      </label>
      <p class="threshold-result">현재 기준 이상 도시 <strong>{{ hotCityCount }}개</strong></p>
    </section>

    <div class="selected-status">
      선택된 도시 : <strong>{{ selectedCityInfo || '없음' }}</strong>
    </div>

    <section class="weather-list">
      <div v-if="filteredWeatherList.length == 0" class="empty-state">
        <span class="empty-icon">🔍</span>
        <p class="empty-message">검색 결과와 일치하는 도시가 없습니다.</p>
      </div>
      <div
        v-for="weather in filteredWeatherList"
        :key="weather.id"
        class="weather-card"
        @click="selectedCityInfo = weather.name"
      >
        <div class="weather-info">
          <span class="weather-emoji">{{ weather.emoji }}</span>
          <h2 class="weather-city">{{ weather.name }}</h2>
          <p class="weather-temp">{{ weather.temp }}°C</p>
          <p class="weather-status">{{ weather.status }}</p>
        </div>

        <p v-if="weather.temp >= 34" class="weather-condition condition-danger">위험해요</p>
        <p v-else-if="weather.temp >= 30" class="weather-condition condition-hot">더워요</p>
        <p v-else-if="weather.temp >= 25" class="weather-condition condition-good">괜찮아요</p>
        <p v-else class="weather-condition condition-cool">선선해요</p>

        <button class="detail-button" @click.stop="showDetail(weather.humidity)">상세보기</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.weather-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px 60px;
  color: #2b2f36;
}

.weather-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.weather-header h1 {
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  margin: 0;
}

.summary-badge {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: #b5560a;
  background: #fdf0e2;
  border-radius: 999px;
  padding: 4px 12px;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7f8fa;
  border: 1px solid #e3e5e9;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.threshold-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #f7f8fa;
  border: 1px solid #e3e5e9;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.threshold-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #2b2f36;
}

.threshold-input-wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #d5d8dd;
  border-radius: 8px;
  padding: 4px 10px;
}

.threshold-input {
  width: 52px;
  border: none;
  outline: none;
  font-size: 14px;
  text-align: center;
  color: #2b2f36;
  background: transparent;
}

.threshold-input-wrap:focus-within {
  border-color: #7aa5ff;
}

.threshold-unit {
  font-size: 13px;
  color: #6b7078;
}

.threshold-result {
  font-size: 13px;
  color: #6b7078;
  margin: 0;
}

.threshold-result strong {
  color: #b5560a;
  font-weight: 700;
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

.selected-status {
  background: #eef4ff;
  border: 1px solid #d7e3ff;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  margin-bottom: 24px;
}

.weather-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 48px 20px;
  background: #fafbfc;
  border: 1px dashed #d5d8dd;
  border-radius: 12px;
  color: #6b7078;
}

.empty-icon {
  font-size: 30px;
  margin-bottom: 8px;
  opacity: 0.6;
}

.empty-message {
  font-size: 14px;
  margin: 0;
}

.weather-card {
  flex: 1 1 200px;
  max-width: 220px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  text-align: center;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.weather-card:hover {
  border-color: #c7d2fe;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.weather-info {
  margin-bottom: 12px;
}

.weather-emoji {
  display: block;
  font-size: 32px;
  margin-bottom: 6px;
}

.weather-city {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 4px;
}

.weather-temp {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 2px;
}

.weather-status {
  font-size: 13px;
  color: #6b7078;
  margin: 0;
}

.weather-condition {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  margin: 0 0 14px;
}

.condition-danger {
  color: #b3261e;
  background: #fdecea;
}

.condition-hot {
  color: #b5560a;
  background: #fdf0e2;
}

.condition-good {
  color: #0f7a5b;
  background: #e4f6ef;
}

.condition-cool {
  color: #2b5fb3;
  background: #e8f0fe;
}

.detail-button {
  display: block;
  width: 100%;
  padding: 8px 0;
  border: 1px solid #d5d8dd;
  border-radius: 8px;
  background: #ffffff;
  color: #2b2f36;
  font-size: 13px;
  cursor: pointer;
}

.detail-button:hover {
  background: #f2f4f7;
}

@media (max-width: 420px) {
  .threshold-section {
    justify-content: flex-start;
  }

  .threshold-result {
    width: 100%;
  }
}
</style>

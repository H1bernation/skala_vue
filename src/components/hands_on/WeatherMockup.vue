<script setup>
import { ref } from 'vue'
const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    temp: 31,
    status: '맑음',
    emoji: '☀️',
    humidity: 70,
  },
  {
    id: 'city_02',
    name: '강릉',
    temp: 27,
    status: '구름',
    emoji: '☁️',
    humidity: 50,
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 29,
    status: '소나기',
    emoji: '🌦️',
    humidity: 80,
  },
  {
    id: 'city_04',
    name: '제주',
    temp: 26,
    status: '비',
    emoji: '🌧️',
    humidity: 84,
  },
  {
    id: 'city_05',
    name: '대구',
    temp: 37,
    status: '맑음',
    emoji: '☀️',
    humidity: 30,
  },
])
const searchCity = ref('')
const selectedCity = ref('')
const showDetail = (humidity) => {
  alert(`현재 습도는 ${humidity}%입니다.`)
}
</script>

<template>
  <main class="weather-page">
    <header class="weather-header">
      <h1>날씨 현황</h1>
    </header>

    <section class="search-section">
      <input
        class="search-input"
        :value="searchCity"
        @input="(e) => (searchCity = e.target.value)"
        placeholder="도시를 입력하세요 (예: 서울)"
      />
      <p class="search-result">입력한 도시 : {{ searchCity }}</p>
    </section>

    <div class="selected-status">
      선택된 도시 : <strong>{{ selectedCity || '없음' }}</strong>
    </div>

    <section class="weather-list">
      <div
        v-for="weather in weatherList"
        :key="weather.id"
        class="weather-card"
        @click="selectedCity = weather.name"
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

.weather-header h1 {
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 24px;
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
  margin-bottom: 28px;
}

.weather-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
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
}

.weather-card:hover {
  border-color: #c7d2fe;
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
</style>

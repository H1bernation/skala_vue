<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from '../stores/configStore'
import { useFavoriteStore } from '../stores/favoriteStore'

const route = useRoute()
const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

// WeatherHomeView와 동일한 도시 목록 Mock Data
const weatherList = [
  { id: 'city_01', name: '서울', temp: 31, status: '맑음', emoji: '☀️', humidity: 70 },
  { id: 'city_02', name: '강릉', temp: 27, status: '구름', emoji: '☁️', humidity: 50 },
  { id: 'city_03', name: '부산', temp: 29, status: '소나기', emoji: '🌦️', humidity: 80 },
  { id: 'city_04', name: '제주', temp: 26, status: '비', emoji: '🌧️', humidity: 84 },
  { id: 'city_05', name: '대구', temp: 37, status: '맑음', emoji: '☀️', humidity: 30 },
]

const city = ref(null)

// URL의 cityId를 기준으로 상세 화면에 표시할 도시를 Mount 시점에 선택한다.
onMounted(() => {
  city.value = weatherList.find((weather) => weather.id === route.params.cityId)
})

// city는 Mount 이후에만 값이 채워지므로, 아직 없거나 못 찾은 경우를 먼저 처리한다.
const displayTemp = computed(() => {
  if (!city.value) return null
  if (configStore.unit === 'fahrenheit') {
    return Math.round((city.value.temp * 9) / 5 + 32)
  }
  return city.value.temp
})
</script>

<template>
  <main class="weather-detail-page">
    <RouterLink to="/" class="back-link">← 대시보드로 돌아가기</RouterLink>

    <section v-if="city" class="detail-card">
      <button
        class="favorite-button"
        :class="{ 'favorite-button--active': favoriteStore.isFavorite(city.id) }"
        @click="favoriteStore.toggleFavorite(city.id)"
      >
        {{ favoriteStore.isFavorite(city.id) ? '★' : '☆' }}
      </button>

      <span class="weather-emoji">{{ city.emoji }}</span>
      <h1 class="city-name">{{ city.name }}</h1>
      <p class="city-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <p class="city-status">{{ city.status }}</p>
      <p class="city-humidity">습도 {{ city.humidity }}%</p>
    </section>

    <section v-else class="detail-card">
      <p class="not-found-message">해당 도시 정보를 찾을 수 없습니다.</p>
    </section>
  </main>
</template>

<style scoped>
.weather-detail-page {
  max-width: 480px;
  margin: 0 auto;
  padding: 32px 20px 60px;
  color: #2b2f36;
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 14px;
  color: #2b5fb3;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.detail-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px 20px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.favorite-button {
  position: absolute;
  top: 14px;
  right: 14px;
  border: none;
  background: none;
  font-size: 24px;
  line-height: 1;
  color: #c7ccd4;
  cursor: pointer;
}

.favorite-button--active {
  color: #f5a524;
}

.weather-emoji {
  display: block;
  font-size: 48px;
  margin-bottom: 10px;
}

.city-name {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 8px;
}

.city-temp {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px;
}

.city-status {
  font-size: 14px;
  color: #6b7078;
  margin: 0 0 4px;
}

.city-humidity {
  font-size: 14px;
  color: #6b7078;
  margin: 0;
}

.not-found-message {
  font-size: 14px;
  color: #6b7078;
  margin: 0;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from '../stores/configStore'
import { useFavoriteStore } from '../stores/favoriteStore'
import { useWeatherStore } from '../stores/weatherStore'
import { useActivityStore } from '../stores/activityStore'

// '/weather/:cityId' 경로의 상세 날씨 화면. 동적 세그먼트로 받은 cityId로 도시를 찾아 보여준다.
//
// 변경 이력
// - 과제 4: 최초 작성, cityId 기준으로 도시를 찾아 표시
// - 과제 5: 단위 설정과 즐겨찾기 상태를 Home과 공유하도록 연동
// - 과제 6: Mock 데이터 대신 weatherStore(OpenWeatherMap)에서 도시를 조회하도록 변경
// - 과제 6: OpenWeatherMap Air Pollution API로 미세먼지/초미세먼지/대기질 상태 표시 추가
// - 과제 6: Open-Meteo 기반 야외활동 지수 표시 추가
const route = useRoute()
const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()
const weatherStore = useWeatherStore()
const activityStore = useActivityStore()

const city = ref(null)

// Home을 거치지 않고 이 페이지로 바로 들어오거나 새로고침한 경우를 대비해,
// weatherStore가 비어 있으면 여기서도 직접 불러온다. 야외활동 지수도 같은 방식으로 처리한다.
onMounted(async () => {
  if (weatherStore.weatherList.length === 0) {
    await weatherStore.fetchWeatherList()
  }
  city.value = weatherStore.weatherList.find((weather) => weather.id === route.params.cityId)

  if (activityStore.activityList.length === 0) {
    activityStore.fetchActivityList()
  }
})

// weatherStore와 activityStore는 같은 sidoCoordinates의 id를 공유하므로 id로 바로 매칭한다.
const cityActivity = computed(() => {
  if (!city.value) return null
  return activityStore.activityList.find((item) => item.id === city.value.id)
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
      <p class="city-air">미세먼지 {{ city.pm10 }}μg/m³ · 초미세먼지 {{ city.pm25 }}μg/m³</p>
      <p class="city-air-status">대기질 {{ city.airQuality }}</p>

      <!-- 야외활동 지수 (Open-Meteo 기반) -->
      <div v-if="cityActivity" class="activity-box">
        <p class="activity-score">야외활동 지수 {{ cityActivity.score }}점</p>
        <p class="activity-message">{{ cityActivity.message }}</p>
        <p class="activity-sub">UV 지수 {{ cityActivity.uvIndex }} · 풍속 {{ cityActivity.windSpeed }}km/h</p>
      </div>
      <p v-else-if="activityStore.isLoading" class="activity-loading">야외활동 지수를 불러오는 중...</p>
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
  margin: 0 0 4px;
}

.city-air {
  font-size: 14px;
  color: #6b7078;
  margin: 0 0 4px;
}

.city-air-status {
  font-size: 14px;
  font-weight: 600;
  color: #2b2f36;
  margin: 0;
}

.not-found-message {
  font-size: 14px;
  color: #6b7078;
  margin: 0;
}

.activity-box {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eef0f2;
}

.activity-score {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 2px;
}

.activity-message {
  font-size: 13px;
  color: #6b7078;
  margin: 0 0 4px;
}

.activity-sub {
  font-size: 12px;
  color: #8a8f98;
  margin: 0;
}

.activity-loading {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eef0f2;
  font-size: 13px;
  color: #6b7078;
}
</style>

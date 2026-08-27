<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/hands_on/BaseDashboardCard.vue'
import SearchBar from '../components/hands_on/SearchBar.vue'
import WeatherCard from '../components/hands_on/WeatherCard.vue'
import HotThresholdControl from '../components/hands_on/HotThresholdControl.vue'
import { useFavoriteStore } from '../stores/favoriteStore'
import { useConfigStore } from '../stores/configStore'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const configStore = useConfigStore()

const searchQuery = ref('')
const selectedCityInfo = ref('')
const hotThreshold = ref(30)
const showFavoritesOnly = ref(false)
const filteredWeatherList = computed(() => {
  return weatherList.value
    .filter((weather) => weather.name.includes(searchQuery.value))
    .filter((weather) => !showFavoritesOnly.value || favoriteStore.isFavorite(weather.id))
})
const handleUpdateQuery = (newQuery) => {
  console.log('[WeatherHomeView] 검색어 변경 이벤트를 받았습니다:', newQuery)
  searchQuery.value = newQuery
}
const handleSelectCard = (cityName) => {
  console.log('[WeatherHomeView] 카드 선택 이벤트를 받았습니다:', cityName)
  selectedCityInfo.value = cityName
}
const handleClickDetail = (cityId) => {
  console.log('[WeatherHomeView] 상세보기 이벤트를 받았습니다:', cityId)
  router.push('/weather/' + cityId)
}
const handleUpdateThreshold = (newThreshold) => {
  console.log('[WeatherHomeView] 기준 온도 변경 이벤트를 받았습니다:', newThreshold)
  hotThreshold.value = newThreshold
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

// hotThreshold는 현재 선택된 단위(configStore.unit) 기준 숫자이므로,
// 항상 섭씨로 저장된 weather.temp와 비교하려면 먼저 섭씨로 환산해야 한다.
const hotCityCount = computed(() => {
  const thresholdInCelsius =
    configStore.unit === 'fahrenheit' ? ((hotThreshold.value - 32) * 5) / 9 : hotThreshold.value
  return weatherList.value.filter((weather) => weather.temp >= thresholdInCelsius).length
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

    <BaseDashboardCard>
      <SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
      <label class="favorite-filter">
        <input type="checkbox" v-model="showFavoritesOnly" />
        ⭐ 즐겨찾기만 보기
      </label>
    </BaseDashboardCard>

    <BaseDashboardCard>
      <HotThresholdControl
        :hot-threshold="hotThreshold"
        :hot-city-count="hotCityCount"
        :unit-symbol="configStore.unitSymbol"
        @update-threshold="handleUpdateThreshold"
      />
    </BaseDashboardCard>

    <div class="selected-status">
      선택된 도시 : <strong>{{ selectedCityInfo || '없음' }}</strong>
    </div>

    <BaseDashboardCard>
      <section class="weather-list">
        <div v-if="filteredWeatherList.length == 0" class="empty-state">
          <span class="empty-icon">🔍</span>
          <p class="empty-message">검색 결과와 일치하는 도시가 없습니다.</p>
        </div>
        <WeatherCard
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :weather="weather"
          @select-card="handleSelectCard"
          @click-detail="handleClickDetail"
        />
      </section>
    </BaseDashboardCard>
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

.favorite-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 13px;
  color: #6b7078;
  cursor: pointer;
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
</style>

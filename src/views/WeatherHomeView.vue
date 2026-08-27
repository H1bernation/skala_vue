<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/hands_on/BaseDashboardCard.vue'
import SearchBar from '../components/hands_on/SearchBar.vue'
import WeatherCard from '../components/hands_on/WeatherCard.vue'
import HotThresholdControl from '../components/hands_on/HotThresholdControl.vue'
import { useFavoriteStore } from '../stores/favoriteStore'
import { useConfigStore } from '../stores/configStore'
import { useWeatherStore } from '../stores/weatherStore'

// '/' 경로의 날씨 대시보드. 과제 3까지의 WeatherParents 역할을 이어받아
// 검색, 기준 온도 필터, 카드 목록, 상세보기 이동을 담당한다.
//
// 변경 이력
// - 과제 4: WeatherParents의 상태/로직을 이전, alert 대신 router.push로 상세 페이지 이동
// - 과제 5: 단위 설정(configStore)과 즐겨찾기(favoriteStore) 연동, 즐겨찾기 필터 추가
// - 과제 6: Mock 데이터 대신 weatherStore(OpenWeatherMap)로 17개 시도 실시간 날씨를 불러오도록 변경
const router = useRouter()
const favoriteStore = useFavoriteStore()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const searchQuery = ref('')
const selectedCityInfo = ref('')
const hotThreshold = ref(30)
const showFavoritesOnly = ref(false)
const filteredWeatherList = computed(() => {
  return weatherStore.weatherList
    .filter(
      (weather) =>
        weather.name.includes(searchQuery.value) || weather.alias.includes(searchQuery.value),
    )
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
  return weatherStore.weatherList.filter((weather) => weather.temp >= thresholdInCelsius).length
})

// 이미 불러온 데이터가 있으면(예: Detail에서 돌아온 경우) 다시 호출하지 않는다.
onMounted(() => {
  if (weatherStore.weatherList.length === 0) {
    weatherStore.fetchWeatherList()
  }
})
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
        <p v-if="weatherStore.isLoading" class="status-message">날씨 데이터를 불러오는 중...</p>
        <p v-else-if="weatherStore.error" class="status-message status-message--error">
          {{ weatherStore.error }}
        </p>
        <template v-else>
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
        </template>
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

.status-message {
  width: 100%;
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: #6b7078;
}

.status-message--error {
  color: #b3261e;
}
</style>

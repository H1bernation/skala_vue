<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/hands_on/BaseDashboardCard.vue'
import SearchBar from '../components/hands_on/SearchBar.vue'
import WeatherCard from '../components/hands_on/WeatherCard.vue'
import HotThresholdControl from '../components/hands_on/HotThresholdControl.vue'
import KoreaMap from '../components/hands_on/KoreaMap.vue'
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
// - UI 개선: 대한민국 지도(KoreaMap) + 선택 지역 패널 추가, Element Plus 기반 레이아웃 정돈
const router = useRouter()
const favoriteStore = useFavoriteStore()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const searchQuery = ref('')
const selectedCityInfo = ref('')
const hotThreshold = ref(30)
const favoriteFilter = ref('all')
const showFavoritesOnly = computed(() => favoriteFilter.value === 'favorite')
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

// 지도 클릭(KoreaMap select-region)과 카드 클릭(WeatherCard select-card)이 같은 selectedCityInfo를 갱신하므로,
// "선택 지역" 패널은 이름으로 weatherList에서 도시를 다시 찾기만 하면 된다.
const selectedCity = computed(() =>
  weatherStore.weatherList.find((weather) => weather.name === selectedCityInfo.value) || null,
)
const selectedCityDisplayTemp = computed(() => {
  if (!selectedCity.value) return null
  if (configStore.unit === 'fahrenheit') {
    return Math.round((selectedCity.value.temp * 9) / 5 + 32)
  }
  return selectedCity.value.temp
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
    <!-- 페이지 제목 + 실제 데이터 갱신 시각 -->
    <header class="weather-header">
      <h1>오늘의 전국 날씨</h1>
      <p v-if="weatherStore.lastUpdatedAt" class="updated-at">
        {{ weatherStore.lastUpdatedAt.toLocaleString('ko-KR') }} 기준
      </p>
    </header>

    <!-- 전국 현황: 지도 + 선택 지역 정보 패널 -->
    <BaseDashboardCard>
      <h2 class="section-title">전국 현황</h2>
      <p v-if="weatherStore.isLoading" class="status-message">날씨 데이터를 불러오는 중...</p>
      <el-alert
        v-else-if="weatherStore.error"
        :title="weatherStore.error"
        type="error"
        show-icon
        :closable="false"
      />
      <div v-else class="overview-grid">
        <KoreaMap
          :weather-list="weatherStore.weatherList"
          :selected-name="selectedCityInfo"
          @select-region="handleSelectCard"
        />

        <div class="region-panel">
          <template v-if="selectedCity">
            <div class="region-panel-header">
              <span>선택 지역</span>
              <button
                class="favorite-button"
                :class="{ 'favorite-button--active': favoriteStore.isFavorite(selectedCity.id) }"
                @click="favoriteStore.toggleFavorite(selectedCity.id)"
              >
                {{ favoriteStore.isFavorite(selectedCity.id) ? '★' : '☆' }}
              </button>
            </div>
            <h3 class="region-name">{{ selectedCity.name }}</h3>
            <p class="region-temp">{{ selectedCityDisplayTemp }}{{ configStore.unitSymbol }}</p>
            <el-tag size="small">{{ selectedCity.status }}</el-tag>
            <dl class="region-stats">
              <div><dt>습도</dt><dd>{{ selectedCity.humidity }}%</dd></div>
              <div><dt>풍속</dt><dd>{{ selectedCity.windSpeed }} m/s</dd></div>
              <div><dt>PM10</dt><dd>{{ selectedCity.pm10 }}㎍/㎥</dd></div>
              <div><dt>PM2.5</dt><dd>{{ selectedCity.pm25 }}㎍/㎥</dd></div>
            </dl>
            <button class="region-detail-link" @click="handleClickDetail(selectedCity.id)">
              {{ selectedCity.name }} 상세 날씨 보기 →
            </button>
          </template>
          <el-empty v-else description="지도나 카드를 선택하면 여기에 상세 정보가 표시됩니다." />
        </div>
      </div>
    </BaseDashboardCard>

    <!-- 검색 + 더운 도시 기준 -->
    <BaseDashboardCard>
      <div class="filter-row">
        <SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
        <HotThresholdControl
          class="threshold-wrap"
          :hot-threshold="hotThreshold"
          :hot-city-count="hotCityCount"
          :unit-symbol="configStore.unitSymbol"
          @update-threshold="handleUpdateThreshold"
        />
      </div>
    </BaseDashboardCard>

    <!-- 주요 지역 날씨 -->
    <BaseDashboardCard>
      <div class="list-header">
        <h2 class="section-title">전체 지역 날씨</h2>
        <el-segmented
          v-model="favoriteFilter"
          :options="[
            { label: '전체', value: 'all' },
            { label: '즐겨찾기', value: 'favorite' },
          ]"
          size="small"
        />
      </div>
      <section class="weather-list">
        <p v-if="weatherStore.isLoading" class="status-message">날씨 데이터를 불러오는 중...</p>
        <el-alert
          v-else-if="weatherStore.error"
          :title="weatherStore.error"
          type="error"
          show-icon
          :closable="false"
        />
        <template v-else>
          <el-empty
            v-if="filteredWeatherList.length == 0"
            :description="
              showFavoritesOnly ? '즐겨찾기한 지역이 없습니다.' : '검색 결과와 일치하는 도시가 없습니다.'
            "
          />
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px 60px;
  color: #12253d;
}

.weather-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 24px;
}

.weather-header h1 {
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  margin: 0;
}

.updated-at {
  font-size: 13px;
  color: #8a97a8;
  margin: 0;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.threshold-wrap {
  flex: 1;
  min-width: 260px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.overview-grid {
  display: grid;
  /* 지도 칼럼을 480px로 고정하고, 남는 폭은 오른쪽 선택 지역 패널(1fr)이 가져간다. */
  grid-template-columns: 480px 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 800px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}

.region-panel {
  background: #f5f8fc;
  border: 1px solid #e3eaf3;
  border-radius: 14px;
  padding: 18px;
}

.region-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #4a5c72;
  margin-bottom: 6px;
}

.favorite-button {
  border: none;
  background: none;
  font-size: 20px;
  line-height: 1;
  color: #c7ccd4;
  cursor: pointer;
}

.favorite-button--active {
  color: #f5a524;
}

.region-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px;
}

.region-temp {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px;
}

.region-stats {
  display: grid;
  /* 패널 폭에 따라 열 수가 자동으로 늘고 준다. */
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px 16px;
  margin: 14px 0;
}

.region-stats div {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  border-bottom: 1px solid #e9eef6;
  padding-bottom: 6px;
}

.region-stats dt {
  color: #8a97a8;
}

.region-stats dd {
  margin: 0;
  font-weight: 600;
}

.region-detail-link {
  width: 100%;
  border: none;
  background: #2a6fd6;
  color: #ffffff;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.region-detail-link:hover {
  background: #1b54aa;
}

.weather-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.status-message {
  width: 100%;
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: #6b7078;
}
</style>

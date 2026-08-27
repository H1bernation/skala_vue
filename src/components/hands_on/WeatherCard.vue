<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'
import { useFavoriteStore } from '../../stores/favoriteStore'

// 개별 도시의 날씨 정보를 카드 형태로 표시하고,
// 카드 선택, 상세보기, 즐겨찾기 이벤트를 처리한다.
//
// 변경 이력
// - 과제 3: WeatherParents에 있던 카드 UI를 별도 컴포넌트로 분리
// - 과제 4: 상세보기 이동에 필요한 값을 humidity에서 도시 id로 변경
// - 과제 5: 전역 단위 설정을 연동해 섭씨/화씨 표시 추가, 즐겨찾기 버튼 추가
// - UI 개선: PM10/PM2.5 표시 추가, 날씨 상태에 el-tag 적용
// - UI 개선: 목업 레이아웃에 맞춰 상단 정렬/대기질 pill/상세보기 링크 스타일 재정리
const props = defineProps({
  // weather: 도시명, 온도, 습도 등 현재 날씨 정보를 담는 객체
  weather: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  // select-card: 카드 선택 시 선택한 도시 이름을 부모에 전달
  'select-card',
  // click-detail: 상세보기 요청 시 도시 id를 부모에 전달
  'click-detail',
])

const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

// 원본 데이터는 항상 섭씨이며, 화면 표시 단위만 configStore 설정에 따라 변환한다.
const displayTemp = computed(() => {
  const rawTemp = props.weather.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

// KoreaMap의 AIR_CLASS와 같은 4단계(좋음/보통/나쁨/매우 나쁨)를 pill 색상에 그대로 재사용한다.
const AIR_QUALITY_CLASS = {
  좋음: 'aq-good',
  보통: 'aq-normal',
  나쁨: 'aq-bad',
  '매우 나쁨': 'aq-verybad',
}
const airQualityClass = computed(() => AIR_QUALITY_CLASS[props.weather.airQuality] || 'aq-normal')

const handleSelectCard = () => {
  console.log('[WeatherCard] select-card emit:', props.weather.name)
  emit('select-card', props.weather.name)
}

const handleClickDetail = () => {
  console.log('[WeatherCard] click-detail emit:', props.weather.id)
  emit('click-detail', props.weather.id)
}
</script>

<template>
  <div class="weather-card" @click="handleSelectCard">
    <!-- 상단: 지역명 + 즐겨찾기 -->
    <div class="card-top">
      <h2 class="weather-city">{{ weather.name }}</h2>
      <button
        class="favorite-button"
        :class="{ 'favorite-button--active': favoriteStore.isFavorite(weather.id) }"
        @click.stop="favoriteStore.toggleFavorite(weather.id)"
      >
        {{ favoriteStore.isFavorite(weather.id) ? '★' : '☆' }}
      </button>
    </div>

    <!-- 중단: 이모지 + 온도 + 상태 -->
    <div class="weather-info">
      <span class="weather-emoji">{{ weather.emoji }}</span>
      <p class="weather-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <div class="weather-badges">
        <el-tag size="small" type="info">{{ weather.status }}</el-tag>
        <span v-if="weather.temp >= 34" class="weather-condition condition-danger">위험해요</span>
        <span v-else-if="weather.temp >= 30" class="weather-condition condition-hot">더워요</span>
        <span v-else-if="weather.temp >= 25" class="weather-condition condition-good">괜찮아요</span>
        <span v-else class="weather-condition condition-cool">선선해요</span>
      </div>
    </div>

    <div class="card-divider"></div>

    <!-- 하단: 습도 + 대기질 -->
    <div class="weather-air">
      <span>습도 {{ weather.humidity }}%</span>
      <span class="air-pill" :class="airQualityClass">PM10 {{ weather.pm10 }} · {{ weather.airQuality }}</span>
    </div>

    <button class="detail-link" @click.stop="handleClickDetail">{{ weather.name }} 상세보기 →</button>
  </div>
</template>

<style scoped>
.weather-card {
  flex: 1 1 220px;
  max-width: 260px;
  background: #ffffff;
  border: 1px solid #e3eaf3;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.weather-card:hover {
  border-color: #c7d2fe;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.weather-city {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
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

.weather-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.weather-emoji {
  font-size: 32px;
}

.weather-temp {
  font-size: 26px;
  font-weight: 700;
  margin: 0;
}

.weather-badges {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  margin-left: auto;
}

.weather-condition {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
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

.card-divider {
  border-top: 1px solid #eef0f2;
  margin: 0 0 12px;
}

.weather-air {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #4a5c72;
  margin: 0 0 12px;
}

.air-pill {
  padding: 3px 8px;
  border-radius: 999px;
  font-weight: 600;
}

.aq-good {
  color: #3c7fc4;
  background: #eaf2fd;
}

.aq-normal {
  color: #3e8c63;
  background: #ebf5ef;
}

.aq-bad {
  color: #b9762e;
  background: #fbf1e4;
}

.aq-verybad {
  color: #b4514b;
  background: #fbeded;
}

.detail-link {
  display: block;
  width: 100%;
  border: none;
  background: none;
  padding: 0;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: #2a6fd6;
  cursor: pointer;
}

.detail-link:hover {
  color: #1b54aa;
}
</style>

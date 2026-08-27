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
    <button
      class="favorite-button"
      :class="{ 'favorite-button--active': favoriteStore.isFavorite(weather.id) }"
      @click.stop="favoriteStore.toggleFavorite(weather.id)"
    >
      {{ favoriteStore.isFavorite(weather.id) ? '★' : '☆' }}
    </button>

    <div class="weather-info">
      <span class="weather-emoji">{{ weather.emoji }}</span>
      <h2 class="weather-city">{{ weather.name }}</h2>
      <p class="weather-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <p class="weather-status">{{ weather.status }}</p>
    </div>

    <p v-if="weather.temp >= 34" class="weather-condition condition-danger">위험해요</p>
    <p v-else-if="weather.temp >= 30" class="weather-condition condition-hot">더워요</p>
    <p v-else-if="weather.temp >= 25" class="weather-condition condition-good">괜찮아요</p>
    <p v-else class="weather-condition condition-cool">선선해요</p>

    <button class="detail-button" @click.stop="handleClickDetail">상세보기</button>
  </div>
</template>

<style scoped>
.weather-card {
  position: relative;
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

.favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
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
</style>

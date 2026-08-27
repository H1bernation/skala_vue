<script setup>
import { ref, computed } from 'vue'
import { regions, KOREA_MAP_VIEWBOX } from '../../stores/regions'
import { useConfigStore } from '../../stores/configStore'

// 대한민국 시도 SVG 지도. weatherList를 이름으로 매칭해 지역별 기온/대기질 색상을 칠하고,
// 지역 클릭 시 선택 이벤트를, hover 시 간단한 툴팁을 보여준다.
const props = defineProps({
  // weatherList: weatherStore.weatherList를 그대로 받는다(지역명 기준으로 SVG path와 매칭).
  weatherList: {
    type: Array,
    required: true,
  },
  // selectedName: 현재 선택된 도시 이름(WeatherHomeView의 selectedCityInfo와 동일한 값).
  selectedName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  // select-region: 지도에서 지역을 클릭하면 해당 도시 이름을 부모에 전달한다.
  // WeatherCard의 select-card와 같은 페이로드(도시 이름)를 써서 같은 핸들러를 재사용할 수 있게 했다.
  'select-region',
])

const configStore = useConfigStore()

// tempClass()는 항상 섭씨 원본으로 판정하므로, 화면 표시(툴팁/범례)만 현재 단위로 환산한다.
const displayTemp = (temp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32)
  }
  return temp
}

// 기온/대기질 모드 전환. 새로운 등급 기준을 만들지 않고, 이미 있는 값(온도 임계값, airQuality 문자열)만 색상 class로 매핑한다.
const mapMode = ref('temp')
const mapModeOptions = [
  { label: '기온', value: 'temp' },
  { label: '대기질', value: 'air' },
]

// regions.js(SVG path)와 weatherList(실데이터)를 지역명으로 매칭한다.
// 두 데이터의 id 체계(KR-11 vs seoul)가 달라 이름으로만 이어줄 수 있다.
const mapRegions = computed(() =>
  regions.map((region) => ({
    ...region,
    city: props.weatherList.find((city) => city.name === region.name) || null,
  })),
)

// WeatherCard의 위험해요/더워요/괜찮아요/선선해요 임계값(34/30/25)을 그대로 재사용해
// 지도에서도 같은 기준으로 색상 단계를 나눈다.
function tempClass(temp) {
  if (temp >= 34) return 'region--danger'
  if (temp >= 30) return 'region--hot'
  if (temp >= 25) return 'region--good'
  return 'region--cool'
}

// weatherStore의 airQuality(좋음/보통/나쁨/매우 나쁨)를 그대로 색상 class에 매핑한다.
const AIR_CLASS = {
  좋음: 'region--aq-good',
  보통: 'region--aq-normal',
  나쁨: 'region--aq-bad',
  '매우 나쁨': 'region--aq-verybad',
}

function regionColorClass(region) {
  if (!region.city) return 'region--empty'
  return mapMode.value === 'temp' ? tempClass(region.city.temp) : AIR_CLASS[region.city.airQuality] || 'region--empty'
}

// tempClass()의 임계값(34/30/25)을 그대로 문구로 노출한다. 판정 기준은 항상 섭씨 원본이라
// 표시만 현재 단위(configStore.unit)에 맞게 환산한다.
const legendSteps = computed(() => {
  if (mapMode.value !== 'temp') {
    return [
      { label: '좋음', class: 'region--aq-good' },
      { label: '보통', class: 'region--aq-normal' },
      { label: '나쁨', class: 'region--aq-bad' },
      { label: '매우 나쁨', class: 'region--aq-verybad' },
    ]
  }
  const u = configStore.unitSymbol
  return [
    { label: '선선해요', class: 'region--cool', range: `${displayTemp(25)}${u} 미만` },
    { label: '괜찮아요', class: 'region--good', range: `${displayTemp(25)}~${displayTemp(29)}${u}` },
    { label: '더워요', class: 'region--hot', range: `${displayTemp(30)}~${displayTemp(33)}${u}` },
    { label: '위험해요', class: 'region--danger', range: `${displayTemp(34)}${u} 이상` },
  ]
})

// 그라디언트 범례용 실제 최고/최저 기온. 하드코딩 없이 지금 받아온 weatherList에서 그대로 계산한다.
const tempRange = computed(() => {
  const temps = props.weatherList.map((city) => city.temp)
  if (temps.length === 0) return { min: 0, max: 0 }
  return { min: displayTemp(Math.min(...temps)), max: displayTemp(Math.max(...temps)) }
})

const hottestCity = computed(() =>
  props.weatherList.reduce((max, city) => (!max || city.temp > max.temp ? city : max), null),
)
const coolestCity = computed(() =>
  props.weatherList.reduce((min, city) => (!min || city.temp < min.temp ? city : min), null),
)

function handleClick(region) {
  if (!region.city) return
  emit('select-region', region.city.name)
}

// hover 툴팁: 지역명 + 온도 + PM10 정도만 간단히 보여준다.
const mapWrapRef = ref(null)
const hoveredRegion = ref(null)
const tooltipPosition = ref({ x: 0, y: 0 })

function handleHover(region, event) {
  hoveredRegion.value = region
  const wrapRect = mapWrapRef.value?.getBoundingClientRect()
  if (!wrapRect) return
  tooltipPosition.value = {
    x: event.clientX - wrapRect.left + 12,
    y: event.clientY - wrapRect.top + 12,
  }
}
</script>

<template>
  <div ref="mapWrapRef" class="korea-map-wrap">
    <div class="map-toolbar">
      <el-segmented v-model="mapMode" :options="mapModeOptions" size="small" />
    </div>

    <svg class="korea-map" :viewBox="KOREA_MAP_VIEWBOX" xmlns="http://www.w3.org/2000/svg">
      <path
        v-for="region in mapRegions"
        :key="region.id"
        class="region-path"
        :class="[
          regionColorClass(region),
          { 'region-path--selected': region.city && region.city.name === selectedName },
        ]"
        :d="region.d"
        @click="handleClick(region)"
        @mousemove="handleHover(region, $event)"
        @mouseleave="hoveredRegion = null"
      />
    </svg>

    <!-- 그라디언트 바: 지금 받아온 데이터의 실제 최고/최저 기온을 그대로 양 끝에 표시한다 -->
    <div v-if="mapMode === 'temp'" class="legend-gradient-row">
      <span class="legend-edge">낮음 {{ tempRange.min }}°</span>
      <span class="legend-gradient-bar"></span>
      <span class="legend-edge">{{ tempRange.max }}° 높음</span>
    </div>

    <div class="map-legend">
      <span v-for="step in legendSteps" :key="step.label" class="legend-item">
        <span class="legend-swatch" :class="step.class"></span>
        {{ step.label }}<span v-if="step.range" class="legend-range">({{ step.range }})</span>
      </span>
    </div>

    <p v-if="mapMode === 'temp' && hottestCity && coolestCity" class="legend-caption">
      전국 최고 {{ hottestCity.alias }} {{ displayTemp(hottestCity.temp) }}° · 최저 {{ coolestCity.alias }}
      {{ displayTemp(coolestCity.temp) }}° · {{ weatherList.length }}개 시·도 기준
    </p>

    <div
      v-if="hoveredRegion && hoveredRegion.city"
      class="map-tooltip"
      :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }"
    >
      <strong>{{ hoveredRegion.name }}</strong>
      <span>{{ displayTemp(hoveredRegion.city.temp) }}{{ configStore.unitSymbol }} · PM10 {{ hoveredRegion.city.pm10 }}</span>
    </div>
  </div>
</template>

<style scoped>
.korea-map-wrap {
  position: relative;
  /* viewBox가 세로로 긴 비율이라 width를 고정값으로 못 박아야 화면 폭에 따라 커졌다 줄었다 하지 않는다. */
  width: min(480px, 100%);
  margin: 0 auto;
}

.map-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.korea-map {
  width: 100%;
  height: auto;
}

.region-path {
  stroke: #ffffff;
  stroke-width: 1.5;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.region-path:hover {
  opacity: 0.85;
}

.region-path--selected {
  stroke: #2a6fd6;
  stroke-width: 2.5;
}

/* fill은 SVG path에만 적용되는 속성이라 범례 <span>에는 background-color가 따로 필요하다.
   같은 색을 두 곳에서 쓰므로 변수로 한 번만 정의한다. */
.korea-map-wrap {
  --color-empty: #e5e7eb;
  --color-cool: #d8e7f7;
  --color-good: #a9d1c5;
  --color-hot: #f0c27b;
  --color-danger: #e3a879;
  --color-aq-good: #cfe0f7;
  --color-aq-normal: #cfeadb;
  --color-aq-bad: #f3d9ae;
  --color-aq-verybad: #eec4c1;
}

.region--empty {
  fill: var(--color-empty);
}

.region--cool {
  fill: var(--color-cool);
}

.region--good {
  fill: var(--color-good);
}

.region--hot {
  fill: var(--color-hot);
}

.region--danger {
  fill: var(--color-danger);
}

.region--aq-good {
  fill: var(--color-aq-good);
}

.region--aq-normal {
  fill: var(--color-aq-normal);
}

.region--aq-bad {
  fill: var(--color-aq-bad);
}

.region--aq-verybad {
  fill: var(--color-aq-verybad);
}

.legend-swatch.region--empty {
  background-color: var(--color-empty);
}

.legend-swatch.region--cool {
  background-color: var(--color-cool);
}

.legend-swatch.region--good {
  background-color: var(--color-good);
}

.legend-swatch.region--hot {
  background-color: var(--color-hot);
}

.legend-swatch.region--danger {
  background-color: var(--color-danger);
}

.legend-swatch.region--aq-good {
  background-color: var(--color-aq-good);
}

.legend-swatch.region--aq-normal {
  background-color: var(--color-aq-normal);
}

.legend-swatch.region--aq-bad {
  background-color: var(--color-aq-bad);
}

.legend-swatch.region--aq-verybad {
  background-color: var(--color-aq-verybad);
}

.legend-gradient-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  font-size: 12px;
  color: #4a5c72;
}

.legend-gradient-bar {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(to right, #d8e7f7, #a9d1c5, #f0c27b, #e3a879);
}

.legend-edge {
  white-space: nowrap;
}

.map-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 10px;
  font-size: 12px;
  color: #4a5c72;
}

.legend-caption {
  margin-top: 8px;
  font-size: 12px;
  color: #8a97a8;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-swatch {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-range {
  color: #8a97a8;
  margin-left: 2px;
}

.map-tooltip {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  background: #12253d;
  color: #ffffff;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  box-shadow: 0 10px 24px rgba(18, 37, 61, 0.22);
  display: flex;
  flex-direction: column;
  gap: 2px;
  white-space: nowrap;
}
</style>

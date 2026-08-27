<script setup>
const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

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

    <button class="detail-button" @click.stop="handleClickDetail">상세보기</button>
  </div>
</template>

<style scoped>
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
</style>

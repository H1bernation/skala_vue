<script setup>
import { ref } from 'vue'
import axios from 'axios'
const weatherData = ref(null)
const isLoading = ref(false)
const handleFetchWeather = async () => {
  isLoading.value = true
  const API_KEY = '31ff72075079fc9b4ac1b396079ddfff'
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=37.4058316&lon=127.0981535&appid=${API_KEY}&units=metric&lang=kr`
  try {
    // 비동기 통신: 서버에서 데이터를 다 가져올 때까지 await로 기다린다.
    const response = await axios.get(URL)
    // fetch()는 응답 String을 Json으로 변환해야 하지만(.json()) Axios에서는 응답 String(response.data)가 자동으로 JSON 파싱 됨.
    console.log('Axios 통신 응답 전체 객체:', response)
    console.log('백엔드가 준 핵심 날씨 데이터(JSON):', response.data)
    weatherData.value = response.data
  } catch (error) {
    // 4xx, 5xx 에러나 네트워크 오프라인 시 자동으로 reject되어 catch 영역에서 처리 한다.
    console.error('통신 중 에러가 발생했습니다:', error)
    alert('데이터를 가져오지 못했습니다. API 키 활성화 여부나 주소를 확인하세요.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>⚡ Axios 통신 검증</h2>
    <button @click="handleFetchWeather" :disabled="isLoading">
      {{ isLoading ? '데이터 로딩 중...' : '실시간 날씨 데이터 당겨오기' }}
    </button>
    <div v-if="weatherData" class="result-card">
      <p>
        📍 위치: <strong>{{ weatherData.name }}</strong>
      </p>
      <p></p>
      <p></p>
      <p>
        🌡️ 현재 기온: <strong>{{ weatherData.main.temp }}°C</strong> (정상 섭씨 변환 완료) ☁️ 날씨
        상태: <strong>{{ weatherData.weather[0].description }}</strong> 💧 습도:
        <strong>{{ weatherData.main.humidity }}%</strong>
      </p>
    </div>
    <div v-else></div>
    <p>아직 가져온 데이터가 없습니다. 버튼을 눌러 통신을 가동하세요.</p>
  </div>
</template>

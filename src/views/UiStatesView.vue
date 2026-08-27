<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import WeatherCard from '../components/hands_on/WeatherCard.vue'
import { useWeatherStore } from '../stores/weatherStore'

// '/states' 경로. Axios 연동 과정에서 실제로 마주치는 Loading/Error/Empty/Success/404 상태를
// 한 화면에 모아 미리 확인하기 위한 테스트 페이지다. 디자인 샘플이 아니라 실제 컴포넌트/상태를 그대로 재사용한다.
const router = useRouter()
const weatherStore = useWeatherStore()

// Success 데모용 샘플 데이터. weatherStore.weatherList와 같은 필드 구성을 그대로 쓴다.
const sampleWeather = {
  id: 'seoul',
  name: '서울특별시',
  alias: '서울',
  temp: 27,
  status: '맑음',
  emoji: '☀️',
  humidity: 58,
  windSpeed: 2.4,
  pm10: 32,
  pm25: 18,
  airQuality: '보통',
}

const showLoadingDemo = ref(true)

const handleRetryDemo = () => {
  weatherStore.fetchWeatherList()
}
</script>

<template>
  <main class="states-page">
    <header class="states-header">
      <h1>UI 상태 가이드</h1>
      <p class="states-desc">Axios 연동 이후를 고려한 Loading / Error / Empty / Success / 404 상태 확인용 페이지.</p>
    </header>

    <!-- Success -->
    <section class="state-section">
      <h2 class="state-title">Success</h2>
      <p class="state-caption">API 요청 성공 시 최종적으로 보이는 WeatherCard 형태.</p>
      <div class="card-preview">
        <WeatherCard :weather="sampleWeather" @select-card="() => {}" @click-detail="() => {}" />
      </div>
    </section>

    <!-- Loading -->
    <section class="state-section">
      <h2 class="state-title">Loading</h2>
      <p class="state-caption">WeatherCard Skeleton (el-skeleton)</p>
      <div class="skeleton-preview">
        <el-skeleton style="width: 220px" :rows="3" animated />
      </div>
      <p class="state-caption">전체 영역 Loading (v-loading)</p>
      <div v-loading="showLoadingDemo" class="loading-preview">전국 날씨 데이터를 불러오는 중…</div>
    </section>

    <!-- Error -->
    <section class="state-section">
      <h2 class="state-title">Error</h2>
      <el-alert title="날씨 정보를 불러오지 못했습니다." type="error" show-icon :closable="false">
        <el-button size="small" @click="handleRetryDemo">다시 시도</el-button>
      </el-alert>
    </section>

    <!-- Empty -->
    <section class="state-section">
      <h2 class="state-title">Empty</h2>
      <el-empty description="검색 결과와 일치하는 도시가 없습니다." />
    </section>

    <!-- 404 -->
    <section class="state-section">
      <h2 class="state-title">404 Not Found</h2>
      <p class="state-caption">실제로 정의되지 않은 경로로 이동해 catch-all Route(NotFoundView)를 확인한다.</p>
      <el-button @click="router.push('/no-such-page')">존재하지 않는 페이지로 이동</el-button>
    </section>
  </main>
</template>

<style scoped>
.states-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 20px 60px;
  color: #12253d;
}

.states-header {
  text-align: center;
  margin-bottom: 32px;
}

.states-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 6px;
}

.states-desc {
  font-size: 13px;
  color: #8a97a8;
  margin: 0;
}

.state-section {
  background: #ffffff;
  border: 1px solid #e3eaf3;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 20px;
}

.state-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 8px;
}

.state-caption {
  font-size: 12px;
  color: #8a97a8;
  margin: 0 0 10px;
}

.card-preview {
  display: flex;
}

.skeleton-preview {
  margin-bottom: 16px;
}

.loading-preview {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f8fc;
  border-radius: 10px;
  color: #8a97a8;
  font-size: 13px;
}
</style>

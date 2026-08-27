<script setup>
import UnitToggler from './components/hands_on/UnitToggler.vue'

// 최상위 컴포넌트. Weather 대시보드 Navigation Bar와 RouterView를 렌더링한다.
//
// 변경 이력
// - 과제 1: WeatherMockup 렌더링 연결
// - 과제 2: WeatherComposition으로 렌더링 대상 교체
// - 과제 4: Practice 탭 내부를 RouterLink 내비게이션 + RouterView로 교체
// - 과제 5: Navigation Bar 옆에 UnitToggler 배치
// - UI 개선: Navigation에 "UI 상태" 메뉴 추가, Element Plus 기반 UI 도입
// - UI 개선: Code Challenge 탭 분리 제거, Weather 화면만 남김
</script>

<template>
  <div class="weather-topbar">
    <nav class="weather-nav">
      <RouterLink to="/" class="weather-nav-link">날씨 대시보드</RouterLink>
      <RouterLink to="/about" class="weather-nav-link">서비스 소개</RouterLink>
      <RouterLink to="/states" class="weather-nav-link">UI 상태</RouterLink>
    </nav>
    <UnitToggler />
  </div>
  <RouterView />
</template>

<style scoped>
.weather-topbar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 1400px;
  margin: 20px auto 0;
  padding: 0 20px;
}

.weather-nav {
  display: flex;
  gap: 16px;
}

.weather-nav-link {
  font-size: 14px;
  font-weight: 600;
  color: #6b7078;
  text-decoration: none;
}

.weather-nav-link:hover {
  color: #2b2f36;
}

.weather-nav-link.router-link-exact-active {
  color: #2b5fb3;
}
</style>

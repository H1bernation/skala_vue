<script setup>
// '/about' 경로의 서비스 소개 화면. 정적인 소개 문구와 대시보드로 돌아가는 링크만 담당한다.
//
// 변경 이력
// - UI 개선: 실제 사용 중인 데이터 출처/기술 스택 목록 추가
const dataSources = [
  { name: 'OpenWeather', desc: '현재 기온 · 날씨 상태 · 습도 · 풍속' },
  { name: 'OpenWeather Air Pollution', desc: 'PM10 · PM2.5 · 대기질' },
]

const techStack = ['Vue 3', 'Vue Router', 'Pinia', 'Axios', 'Element Plus', 'SVG Map']
</script>

<template>
  <main class="about-page">
    <h1>서비스 소개</h1>
    <p class="about-text">
      Weather Dashboard는 도시별 날씨 정보를 검색하고, 기준 온도를 직접 설정해 더운 도시를
      한눈에 확인할 수 있는 날씨 대시보드 서비스입니다. 지도에서 지역을 선택해 기온과
      미세먼지 상태를 함께 확인하고, 자주 보는 지역은 즐겨찾기로 저장할 수 있습니다.
    </p>

    <div class="about-grid">
      <section class="about-block">
        <h2 class="about-block-title">Data</h2>
        <ul class="about-list">
          <li v-for="source in dataSources" :key="source.name">
            <strong>{{ source.name }}</strong>
            <span>{{ source.desc }}</span>
          </li>
        </ul>
      </section>

      <section class="about-block">
        <h2 class="about-block-title">Built with</h2>
        <div class="tech-tags">
          <el-tag v-for="tech in techStack" :key="tech" size="small">{{ tech }}</el-tag>
        </div>
      </section>
    </div>

    <RouterLink to="/" class="back-link">← 대시보드로 돌아가기</RouterLink>
  </main>
</template>

<style scoped>
.about-page {
  max-width: 560px;
  margin: 0 auto;
  padding: 32px 20px 60px;
  text-align: center;
  color: #12253d;
}

.about-page h1 {
  font-size: 24px;
  margin: 0 0 16px;
}

.about-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4a5c72;
  margin: 0 0 28px;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
  text-align: left;
}

@media (max-width: 480px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
}

.about-block {
  background: #f5f8fc;
  border: 1px solid #e3eaf3;
  border-radius: 12px;
  padding: 16px;
}

.about-block-title {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 10px;
}

.about-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13px;
}

.about-list li {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.about-list strong {
  color: #12253d;
}

.about-list span {
  color: #8a97a8;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.back-link {
  font-size: 14px;
  color: #2a6fd6;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>

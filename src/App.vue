<script setup>
import { ref } from 'vue'
import V_DirectiveChallenge from './components/code_challenge/V_DirectiveChallenge.vue'
import EventHandlingChallenge from './components/code_challenge/EventHandlingChallenge.vue'
import FormHandlingChallenge from './components/code_challenge/FormHandlingChallenge.vue'
import ReactiveStateChallenge from './components/code_challenge/ReactiveStateChallenge.vue'
import ComputedWatchersChallenge from './components/code_challenge/ComputedWatchersChallenge.vue'
import ComponentLifecycle from './components/code_challenge/ComponentLifecycle.vue'

const currentPage = ref('practice')
const showLifecycle = ref(true)
</script>

<template>
  <div class="tab-nav">
    <button
      class="tab-button"
      :class="{ 'tab-button--active': currentPage === 'practice' }"
      @click="currentPage = 'practice'"
    >
      Practice
    </button>
    <button
      class="tab-button"
      :class="{ 'tab-button--active': currentPage === 'challenge' }"
      @click="currentPage = 'challenge'"
    >
      Code Challenge
    </button>
  </div>
  <section v-if="currentPage === 'practice'">
    <!-- 실습 컴포넌트들 -->
    <nav class="weather-nav">
      <RouterLink to="/" class="weather-nav-link">날씨 대시보드</RouterLink>
      <RouterLink to="/about" class="weather-nav-link">서비스 소개</RouterLink>
    </nav>
    <RouterView />
  </section>

  <section v-else>
    <!-- 코드챌린지 컴포넌트들 -->
    <V_DirectiveChallenge />
    <hr />
    <EventHandlingChallenge />
    <hr />
    <FormHandlingChallenge />
    <hr />
    <ReactiveStateChallenge />
    <hr />
    <ComputedWatchersChallenge />
    <hr />

    <section class="lifecycle-card">
      <h2>Lifecycle Hook</h2>

      <button class="destroy-toggle" @click="showLifecycle = !showLifecycle">
        ● 실습 컴포넌트 {{ showLifecycle ? '파괴하기' : '다시 생성하기' }} (v-if="{{
          showLifecycle
        }}")
      </button>

      <div class="lifecycle-divider"></div>

      <ComponentLifecycle v-if="showLifecycle" />
      <p v-else class="destroyed-msg">
        컴포넌트가 파괴되었습니다. 콘솔에서 onUnmounted 로그를 확인하세요.
      </p>
    </section>
  </section>
</template>

<style scoped>
.tab-nav {
  display: flex;
  gap: 8px;
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 20px 0;
}

.tab-button {
  flex: 1;
  padding: 10px 0;
  border: 1px solid #d5d8dd;
  border-radius: 8px;
  background: #ffffff;
  color: #6b7078;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.tab-button:hover {
  background: #f2f4f7;
}

.tab-button--active {
  background: #2b2f36;
  border-color: #2b2f36;
  color: #ffffff;
}

.weather-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  max-width: 960px;
  margin: 20px auto 0;
  padding: 0 20px;
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

.lifecycle-card {
  max-width: 920px;
  margin: 0 auto;
  padding: 20px 24px 24px;
  border: 1px solid #e3e5e9;
  border-radius: 10px;
  background: #ffffff;
}

.lifecycle-card h2 {
  margin: 0 0 14px;
}

.destroy-toggle {
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #eceef1;
  color: #d1315f;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.destroy-toggle:hover {
  background: #e2e4e8;
}

.lifecycle-divider {
  height: 3px;
  margin: 16px 0 20px;
  border-radius: 2px;
  background: linear-gradient(90deg, #34d399, #1f2937);
}

.destroyed-msg {
  padding: 24px;
  border-radius: 8px;
  background: #f2f4f7;
  color: #6b7078;
  text-align: center;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>

<script setup>
import { ref } from 'vue'
import WeatherComposition from './components/hands_on/WeatherComposition.vue'
import V_DirectiveChallenge from './components/code_challenge/V_DirectiveChallenge.vue'
import EventHandlingChallenge from './components/code_challenge/EventHandlingChallenge.vue'
import FormHandlingChallenge from './components/code_challenge/FormHandlingChallenge.vue'
import ReactiveStateChallenge from './components/code_challenge/ReactiveStateChallenge.vue'
import ComputedWatchersChallenge from './components/code_challenge/ComputedWatchersChallenge.vue'
const currentPage = ref('practice')
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
    <WeatherComposition />
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

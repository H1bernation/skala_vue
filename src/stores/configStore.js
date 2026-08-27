import { defineStore } from 'pinia'

// 애플리케이션 전체에서 사용하는 날씨 단위(섭씨/화씨) 설정을 관리한다.
export const useConfigStore = defineStore('config', {
  state: () => ({
    unit: 'celsius',
  }),

  getters: {
    unitSymbol: (state) => {
      return state.unit === 'celsius' ? '°C' : '°F'
    },
  },

  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})

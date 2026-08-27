import { defineStore } from 'pinia'

// 사용자가 즐겨찾기한 도시 id 목록을 관리한다.
// Home과 Detail처럼 서로 다른 컴포넌트 인스턴스에서도 즐겨찾기 상태가 유지되도록 전역으로 뒀다.
export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favoriteIds: [],
  }),

  getters: {
    isFavorite: (state) => (cityId) => state.favoriteIds.includes(cityId),
  },

  actions: {
    toggleFavorite(cityId) {
      if (this.favoriteIds.includes(cityId)) {
        this.favoriteIds = this.favoriteIds.filter((id) => id !== cityId)
      } else {
        this.favoriteIds.push(cityId)
      }
    },
  },
})

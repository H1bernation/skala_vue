import { defineStore } from 'pinia'

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

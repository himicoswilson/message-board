import { defineStore } from 'pinia'

export const useRefreshStore = defineStore({
  id: 'refresh',
  state: () => ({
    flag: 1,
    loading: true,
    cardsReady: false,
    asideReady: false,
    pageLocation: false
  }),
  actions: {
    switchLoading() {
      this.loading = false
      this.cardsReady = false
      this.asideReady = false
    },
    // refresh
    refresh() {
      this.loading = !this.loading
      this.flag += 1
      this.pageLocation = true
    }
  }
})

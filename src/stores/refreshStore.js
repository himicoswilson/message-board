import { defineStore } from 'pinia'

export const useRefreshStore = defineStore({
  id: 'refresh',
  state: () => ({
    flag: 1,
  }),
  actions: {
    // refresh
    refresh(){
      this.flag += 1;
    }
  },
})
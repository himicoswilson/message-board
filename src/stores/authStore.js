import { defineStore } from 'pinia'
import axios from 'axios';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
  }),

  actions: {
    // apiSendVerificationCode
    async apiSendVerificationCode(email){
      await axios.post('/api/auth/send_code', {
        email
      }, {
        withCredentials: true
      })
    },
    async apiVerifyCode(email, code){
      await axios.post('/api/auth/verify_code', {
        email,
        code
      }, {
        withCredentials: true
      })
    }
  },
})
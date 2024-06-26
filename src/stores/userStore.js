import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userInfo: {
      id: 0,
      username: '',
      avatar_url: '',
      token: ''
    },
    logoffUser: {
      username: '',
      password: '',
      avatar_url: '',
      deleted_at: ''
    }
  }),

  actions: {
    // apiGetInfo
    async apiGetInfo() {
      // 從 localStorage 中取出 token
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/user/info', {
        token
      })
      this.userInfo = response.data
    },
    // apiLogin
    async apiLogin(username, password) {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      })
      // 将 token 存储到 localStorage
      localStorage.setItem('token', response.data.token)
    },
    // apiSignup
    async apiSignup(email, username, password, token) {
      await axios.post('/api/auth/signup', {
        email,
        username,
        password,
        token
      })
    },
    // apiLogoff
    async apiLogoff() {
      // 從 localStorage 中取出 token
      const token = localStorage.getItem('token')
      await axios.post('/api/auth/logoff', {
        token
      })
    },
    // apiSearchLogoff
    async apiSearchLogoff(username, password) {
      await axios
        .post('/api/user/search_logoff', {
          username,
          password
        })
        .then((value) => {
          const { username, password, avatar_url, deleted_at } = value.data
          this.logoffUser.username = username
          this.logoffUser.password = password
          this.logoffUser.avatar_url = avatar_url
          this.logoffUser.deleted_at = deleted_at
        })
    },
    // apiRestoreUser
    async apiRestoreUser() {
      await axios.post('/api/user/search_logoff', {
        username: this.logoffUser.username,
        password: this.logoffUser.password
      })
    }
  }
})

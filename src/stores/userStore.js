import { defineStore } from 'pinia'
import axios from 'axios';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    username: '',
    avatar_url: ''
  }),

  actions: {
    // apiGetInfo
    async apiGetInfo(){
      // 從 localStorage 中取出 token
      const token = localStorage.getItem('token');
      await axios.post('/user', {
        token: token
      }).then( value => {
        const {username, avatar_url} = value.data
        this.username = username;
        if (avatar_url) {
          this.avatar_url = avatar_url;
        } else {
          this.avatar_url = 'https://halo-himicos.oss-cn-beijing.aliyuncs.com/avatar-5.webp';
        }
      })
    },
    // apiLogin
    async apiLogin(username, password){
      const response = await axios.post('/login', {
        username: username,
        password: password,
      });
      // 将 token 存储到 localStorage
      localStorage.setItem('token', response.data.token);
    },
    // apiSignup
    async apiSignup(username, password, token){
      await axios.post('/signup', {
        username: username,
        password: password,
        token: token
      });
    }
  },
})
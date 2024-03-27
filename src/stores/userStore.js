import { defineStore } from 'pinia'
import axios from 'axios';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    username: '',
    avatar_url: 'https://halo-himicos.oss-cn-beijing.aliyuncs.com/avatar-5.webp'
  }),

  actions: {
    // apiGetInfo
    async apiGetInfo(){
      // 從 localStorage 中取出 token
      const token = localStorage.getItem('token');
      await axios.post('http://47.100.101.113:3000/user', {
        token: token
      }).then( value => {
        const {username, avatar_url} = value.data
        this.username = username;
        this.avatar_url = avatar_url;
      })
    },
    // apiLogin
    async apiLogin(username, password){
      const response = await axios.post('http://47.100.101.113:3000/login', {
        username: username,
        password: password,
      });
      // 将 token 存储到 localStorage
      localStorage.setItem('token', response.data.token);
    },
    // apiSignup
    async apiSignup(username, password, token){
      await axios.post('http://47.100.101.113:3000/signup', {
        username: username,
        password: password,
        token: token
      });
    }
  },
})
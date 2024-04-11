import { defineStore } from 'pinia'
import axios from 'axios';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    id: 0,
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
        const {username, avatar_url, id} = value.data
        this.id = id;
        this.username = username;
        this.avatar_url = avatar_url;
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
    },
    // apiLogoff
    async apiLogoff(){
      // 從 localStorage 中取出 token
      const token = localStorage.getItem('token');
      await axios.post('/logoff', {
        token: token
      });
    },
  },
})
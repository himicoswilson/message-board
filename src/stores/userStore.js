import { defineStore } from 'pinia'
import axios from 'axios';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    id: 0,
    username: '',
    avatar_url: '',
    token: '',
    logoffUser: {
      username: '',
      password: '',
      avatar_url: '',
      deleted_at: ''
    }
  }),

  actions: {
    // apiGetInfo
    async apiGetInfo(){
      // 從 localStorage 中取出 token
      const token = localStorage.getItem('token');
      this.token = token;
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
    // apiSearchLogoff
    async apiSearchLogoff(username, password){
      await axios.post('/searchlogoff', {
        username: username,
        password: password,
      }).then((value) => {
        const {username, password, avatar_url, deleted_at} = value.data
        this.logoffUser.username = username;
        this.logoffUser.password = password;
        this.logoffUser.avatar_url = avatar_url;
        this.logoffUser.deleted_at = deleted_at;
      })
    },
    // apiRestoreUser
    async apiRestoreUser(){
      await axios.post('/restoreuser', {
        username: this.logoffUser.username,
        password: this.logoffUser.password,
      });
    },
  },
})
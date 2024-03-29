import { defineStore } from 'pinia'
import axios from 'axios';


export const usePostStore = defineStore({
  id: 'post',
  state: () => ({
    postObj: {
      username: '',
      avatar_url: '',
      title: '',
      content: '',
      created_at: ''
    }
  }),

  actions: {
    // apiGetPosts
    async apiGetPosts(){
      const response = await axios.get('/getposts')
      this.postObj = response.data
    },
    // apiPostMsg
    async apiPostMsg(title, content){
      // 從 localStorage 中取出 token
      const user_token = localStorage.getItem('token');
      await axios.post('/post', {
        title: title,
        content: content,
        user_token: user_token
      })
    },
  },
})
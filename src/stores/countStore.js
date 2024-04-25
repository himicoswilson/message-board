import { defineStore } from 'pinia'
import axios from 'axios';


export const useCountStore = defineStore({
  id: 'count',
  state: () => ({
    userCount: 0,
    postCount: 0,
    userPostCount: 0,
    compareUserCount: 0,
    comparePostCount: 0,
  }),

  actions: {
    // apiGetUserCount
    async apiGetUserCount(){
      const response = await axios.get('/api/counts/users')
      this.userCount = response.data.userCount
    },
    // apiGetPostCount
    async apiGetPostCount(){
      const response = await axios.get('/api/counts/posts')
      this.postCount = response.data.postCount
    },
    // apiGetUserPostCount
    async apiGetUserPostCount(uid){
      const response = await axios.post('/api/counts/post', {
        uid
      })
      this.userPostCount = response.data.userPostCount
    },
    // apiGetUserCountCompare  
    async apiGetUserCountCompare(){
      const response = await axios.get('/api/counts/users/compare')
      this.compareUserCount = response.data.compareUserCount
    },
    // apiGetPostCountCompare  
    async apiGetPostCountCompare(){
      const response = await axios.get('/api/counts/posts/compare')
      this.comparePostCount = response.data.comparePostCount
    },
  },
})
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
      const response = await axios.get('/getusercount')
      this.userCount = response.data.userCount
    },
    // apiGetPostCount
    async apiGetPostCount(){
      const response = await axios.get('/getpostcount')
      this.postCount = response.data.postCount
    },
    // apiGetUserPostCount
    async apiGetUserPostCount(){
      const token = localStorage.getItem('token')
      const response = await axios.post('/getuserpostcount', {
        user_token: token,
      })
      this.userPostCount = response.data.userPostCount
    },
    // apiGetUserCountCompare  
    async apiGetUserCountCompare(){
      const response = await axios.get('/apigetusercountcompare')
      this.compareUserCount = response.data.compareUserCount
    },
    // apiGetPostCountCompare  
    async apiGetPostCountCompare(){
      const response = await axios.get('/apigetpostcountcompare')
      this.comparePostCount = response.data.comparePostCount
    },
  },
})
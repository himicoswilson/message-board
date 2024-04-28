import { defineStore } from 'pinia'
import axios from 'axios'

export const useLikeStore = defineStore({
  id: 'like',
  state: () => ({
    likePosts: []
  }),

  actions: {
    // apiLikePost
    async apiLikePost(uid, pid) {
      await axios.post('/api/post/like', {
        uid,
        pid
      })
    },
    // apiGetLikePost
    async apiGetLikePost(uid) {
      const response = await axios.post('/api/user/likes', {
        uid
      })
      // 把response.data裡面的post_id全部存進likePost，以數組的方式
      this.likePosts = response.data.map((item) => item.pid)
    },
    // apiGetPostLikeNum
    async apiGetPostLikeNum(pid) {
      await axios.post('/api/post/like_num', {
        pid
      })
    }
  }
})

import { defineStore } from 'pinia'
import axios from 'axios';


export const useLikeStore = defineStore({
  id: 'like',
  state: () => ({
    likePosts: [],
  }),

  actions: {
    // apiLikePost
    async apiLikePost(uid, pid) {
      await axios.post('/api/likepost', {
        uid,
        pid,
      })
    },
    // apiGetLikePost
    async apiGetLikePost(uid) {
      const response = await axios.post('/api/getlikepost', {
        uid,
      })
      // 把response.data裡面的post_id全部存進likePost，以數組的方式
      this.likePosts = response.data.map(item => item.pid);
    },
    // apiGetEveryPostLikeNum
    async apiGetPostsLikeNum() {
      await axios.post('/api/getpostslikenum')
    },
    // apiGetPostLikeNum
    async apiGetPostLikeNum(pid) {
      await axios.post('/api/getpostlikenum', {
        pid
      })
    },
  },
})
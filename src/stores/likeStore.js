import { defineStore } from 'pinia'
import axios from 'axios';


export const useLikeStore = defineStore({
  id: 'like',
  state: () => ({
    likePosts: [],
  }),

  actions: {
    // apiLikePost
    async apiLikePost(userToken, postId) {
      await axios.post('/likepost', {
        userToken,
        postId,
      })
    },
    // apiGetLikePost
    async apiGetLikePost(userToken) {
      const response = await axios.post('/getlikepost', {
        userToken,
      })
      // 把response.data裡面的post_id全部存進likePost，以數組的方式
      this.likePosts = response.data.map(item => item.post_id);
    },
    // apiGetEveryPostLikeNum
    async apiGetPostsLikeNum() {
      await axios.post('/getpostslikenum')
    },
  },
})
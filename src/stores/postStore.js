import { defineStore } from 'pinia'
import axios from 'axios';


export const usePostStore = defineStore({
  id: 'post',
  state: () => ({
    post: {
      id: '',
      username: '',
      avatar_url: '',
      title: '',
      content: '',
      created_at: '',
      updated_at: ''
    },
    postObj: [{
      id: '',
      username: '',
      avatar_url: '',
      title: '',
      content: '',
      created_at: '',
      updated_at: '',
      isLike: false,
      like_num: 0
    }],
    editObj: {
      id: '',
      pid: '',
      username: '',
      avatar_url: '',
      title: '',
      content: '',
      created_at: '',
      action: ''
    }
  }),

  actions: {
    // apiGetPost
    async apiGetPost(pid){
      const response = await axios.get('/api/posts/post/' + pid)
      this.post = response.data
    },
    // apiGetPosts
    async apiGetPosts(page){
      const response = await axios.get('/api/posts/page/' + page)
      if (page == 1){
        this.postObj = response.data
      } else {
        this.postObj = this.postObj.concat(response.data)
      }
    },
    // apiGetPost
    async apiGetNewPost(){
      const response = await axios.get('/api/posts/newest')
      this.postObj.unshift(response.data);
    },
    // apiGetEditPost
    async apiGetEditPost(pid){
      const response = await axios.get('/api/posts/get_edit/' + pid)
      // 把修改過的在數組中替換掉
      this.postObj = this.postObj.map(post => {
        if (post.id == pid){
          return response.data
        } else {
          return post
        }
      })
    },
    // apiPostMsg
    async apiPostMsg(title, content, uid){
      await axios.post('/api/posts/create', {
        title,
        content,
        uid
      })
    },
    // apiEditPost
    async apiEditPost(pid, title, content, uid){
      // 從 localStorage 中取出 token
      const user_token = localStorage.getItem('token');
      await axios.put('/api/posts/edit/' + pid, {
        title,
        content,
        uid,
        user_token
      })
    },
    // apiDeletePost
    async apiDeletePost(pid){
      const user_token = localStorage.getItem('token');
      await axios.put('/api/posts/delete/' + pid, {
        user_token
      })
    },
    // apiGetHistoryPost
    async apiGetHistoryPost(pid){
      const response = await axios.get('/api/posts/history/' + pid)
      this.editObj = response.data
    },
  },
})
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
      updated_at: ''
    }],
    editObj: {
      id: '',
      post_id: '',
      username: '',
      avatar_url: '',
      title: '',
      content: '',
      edited_at: '',
      deleted_at: ''
    }
  }),

  actions: {
    // apiGetPost
    async apiGetPost(id){
      const response = await axios.get(`/getpost/${id}`)
      this.post = response.data
    },
    // apiGetPosts
    async apiGetPosts(page){
      const response = await axios.get(`/getposts/${page}`)
      if (page == 1){
        this.postObj = response.data
      } else {
        this.postObj = this.postObj.concat(response.data)
      }
    },
    // apiGetPost
    async apiGetNewPost(){
      const response = await axios.get(`/getnewpost`)
      const newPosts = response.data
      this.postObj.unshift(newPosts);
    },
    // apiGetEditPost
    async apiGetEditPost(id){
      const response = await axios.get(`/geteditpost/${id}`)
      // 把修改過的在數組中替換掉
      this.postObj = this.postObj.map(post => {
        if (post.id == id){
          return response.data
        } else {
          return post
        }
      })
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
    // apiEditPost
    async apiEditPost(id, title, content){
      // 從 localStorage 中取出 token
      const user_token = localStorage.getItem('token');
      await axios.put('/post/' + id, {
        title: title,
        content: content,
        user_token: user_token
      })
    },
    // apiDeletePost
    async apiDeletePost(id){
      const user_token = localStorage.getItem('token');
      await axios.put(`/deletepost/${id}`, {
        user_token: user_token
      })
    },
    // apiGetHistoryPost
    async apiGetHistoryPost(id){
      const response = await axios.get(`/gethistorypost/${id}`)
      this.editObj = response.data
      // this.editObj.unshift(this.postObj.find(post => post.id == id))
    }
  },
})
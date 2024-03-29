<script setup>
// 引入 usePostStore
import { usePostStore } from '@/stores/postStore'
import { onMounted } from 'vue';

const post = usePostStore()

onMounted(() => {
  post.apiGetPosts();
})

const formatDate = ((value) => {
  if (!value) return '';
  const date = new Date(value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  // 格式化日期為 'YYYY.MM.DD HH:mm'
  return `${year}.${month}.${day} ${hours}:${minutes}`;
})
</script>

<template>
  <div class="cards">
    <el-card v-for="postData in post.postObj" :key="postData" class="card" shadow="hover">
      <div class="cardBody">
        <div class="postInfo">
          <span class="title">{{ postData.title }}</span>
          <span class="time">{{ formatDate(postData.created_at) }}</span>
        </div>
        <div class="postContent">
          <p>{{ postData.content }}</p>
        </div>
        <div class="userData">
          <img class="userAvatar" :src="postData.avatar_url">
          <span class="username">{{ postData.username }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.cards {
  flex: 3;
  display: flex;
  flex-wrap: wrap;
  border-right: 1px solid #cdcdcd;
  padding: 20px 0  20px 0;
  
  .card {
    margin: 10px;
    width: 248px;
    height: 158px;
    .cardBody {
      display: flex;
      flex-direction: column;
      .postInfo {
        display: flex;
        align-items: baseline;
        .title {
          font-size: 20px;
          font-weight: 600;
        }
        .time {
          margin-left: 10px;
          font-size: 12px;
          color: #a8a8a7;
        }
      }
      .postContent {
        display: flex;
        p {
          margin-top: 10px;
          font-size: 14px;
        }
      }
      .userData {
        display: flex;
        align-items: center;
        margin-top: 20px;
        justify-content: flex-end;
        
        .userAvatar {
          width: 22px;
          border-radius: 50%;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>


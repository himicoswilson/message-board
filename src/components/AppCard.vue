<script setup>
// 引入 usePostStore
import { usePostStore } from '@/stores/postStore'
import { ref, onMounted, reactive } from 'vue';
import { UserFilled } from "@element-plus/icons-vue";

const post = usePostStore()

const postsPage = ref(1);
const isLoading = ref(false);

// 加顏色，每個顏色都會被加入卡片背景色
const lightColors = reactive([])

onMounted(() => {
  post.apiGetPosts(postsPage.value);
})

const loadingPost = (async() => {
  postsPage.value += 1;
  await post.apiGetPosts(postsPage.value).catch(() => {
    isLoading.value = true;
  })
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
  <div class="cards" v-infinite-scroll="loadingPost" :infinite-scroll-disabled="isLoading">
    <el-card v-for="(postData, customIndex) in post.postObj" :key="postData" class="card" shadow="hover" :style="{ backgroundColor: lightColors[ customIndex % lightColors.length] }" >
      <div class="cardBody">
        <div class="postInfo">
          <span class="title">{{ postData.title }}</span>
          <span class="time">{{ formatDate(postData.created_at) }}</span>
        </div>
        <div class="postContent">
          <p>{{ postData.content }}</p>
        </div>
        <div class="userData">
          <el-avatar :src="postData.avatar_url" :size="22"  class="userAvatar" >
            <el-icon size="14"><UserFilled /></el-icon>
          </el-avatar>
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
  border-right: 1px solid var(--color-border);
  padding: 20px 0  20px 0;

  .card {
    margin: 10px;
    width: 248px;
    height: 158px;
    color: var(--color-text);
    background-color: var(--color-card);
    border: 1px solid var(--color-border);

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
          color: var(--color-time);
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
          margin-right: 5px; 
        }
      }
    }
  }
}
</style>


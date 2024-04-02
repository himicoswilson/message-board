<script setup>
// 引入 usePostStore
import { usePostStore } from '@/stores/postStore'
import { ref, onMounted, reactive, nextTick } from 'vue';
import { UserFilled } from "@element-plus/icons-vue";

const post = usePostStore()

const postsPage = ref(1);
const isLoading = ref(false);
const loading = ref(true);

// 加顏色，每個顏色都會被加入卡片背景色
const lightColors = reactive([])

const svg = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`

onMounted(async() => {
  await post.apiGetPosts(postsPage.value).then(() => {
    nextTick(() => {
      loading.value = false;
    });
  })
})

const loadingPost = (async() => {
  postsPage.value += 1;
  await post.apiGetPosts(postsPage.value).catch(() => {
    isLoading.value = false;
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
  <div v-if="loading" class="cards" v-loading="loading" :element-loading-svg="svg">
    <!-- 佔位 -->
  </div>
  <transition-group v-if="!loading" class="cards" v-infinite-scroll="loadingPost" :infinite-scroll-disabled="isLoading" name="fade" tag="div">
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
  </transition-group>
</template>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active,
.fade-move {
  transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.cards {
  flex: 3;
  border-right: 1px solid var(--color-border);
  min-height: 757px;
  padding: 20px 38px  20px 0;
  display: grid; /* 使用网格布局来替代 Flexbox */
  grid-template-columns: repeat(auto-fit, minmax(248px, 1fr)); /* 按照最少 248px 的宽度自适应布局，不足时会换行 */
  grid-auto-flow: dense; /* 当容器空间不足以放下所有项目时，尝试填充空缺位置 */
  grid-gap: 15px;

  /* 对于最后一行的卡片，取消居中对齐 */
  &::after {
    content: "";
    display: inline-block;
    width: 100%;
    text-align: left;
  }

  .card {
    margin-top: 10px;
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


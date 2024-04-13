<script setup>
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
// 引入 usePostStore
import { usePostStore } from '@/stores/postStore'
// 引入 useUserStore
import { useUserStore } from '@/stores/userStore'
// 引入 countStore
import { useCountStore } from '@/stores/countStore'
// 引入 useRefreshStore
import { useRefreshStore } from '@/stores/refreshStore'
import { ref, onMounted, reactive } from 'vue';
import { UserFilled } from "@element-plus/icons-vue";

const post = usePostStore()
const user = useUserStore()
const count = useCountStore();
const refresh = useRefreshStore()

const postsPage = ref(1);
const isLoading = ref(false);
const dialogVisible = ref(false);
const postEditForm = ref();

const editPostForm = reactive({
  id: '',
  title: '',
  content: '',
});

const rules = reactive({
  title: [
    { required: true, message: 'Please input title', trigger: 'change' },
  ],
  content: [
    { required: true, message: 'Please input content', trigger: 'change' },
  ],
})

onMounted(async() => {
  await post.apiGetPosts(postsPage.value).then(() => {
    refresh.cardsReady = true;
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

const editPost = ((id, title, content) => {
  editPostForm.id = id;
  editPostForm.title = title;
  editPostForm.content = content;
  dialogVisible.value = true;
})

const editPostBtn = (async() => {
  await postEditForm.value.validate();
  // 從post.postObj 找到對應的卡片 並且校驗是否相同
  if (post.postObj.find(item => item.id === editPostForm.id).title === editPostForm.title && post.postObj.find(item => item.id === editPostForm.id).content === editPostForm.content) {
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'No changes were made!',
      type: 'warning',
      position:'bottom-right',
    })
    return;
  }
  await post.apiEditPost(editPostForm.id, editPostForm.title, editPostForm.content).then(async() => {
    dialogVisible.value = false;
    // 發請求獲取某個卡片 然後重新放到對象裡
    await post.apiGetEditPost(editPostForm.id)
  })
})

const deletePost = (async(id) => {
  await post.apiDeletePost(id).then(() => {
    // 刪除成功後刪除該卡片
    post.postObj = post.postObj.filter(item => item.id !== id);
    apiGetCountInfo();
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'Delete successfully!',
      type: 'success',
      position: 'bottom-right',
    })
  }).catch (() => {
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'Delete failed!',
      type: 'error',
      position: 'bottom-right',
    })
  })
})

const apiGetCountInfo = (async() => {
  await count.apiGetPostCount();
  await count.apiGetUserPostCount();
  await count.apiGetUserCountCompare();
  await count.apiGetPostCountCompare();
})
</script>

<template>
  <div v-if="refresh.loading" class="cardsPlace">
    <!-- 佔位 -->
  </div>

  <Waterfall
    :list="post.postObj"
    class="cards"
    v-if="!refresh.loading"
    :hasAroundGutter="false"
    :gutter="12"
    :animationDuration="1000"
    :animationDelay="0"
    v-infinite-scroll="loadingPost" 
    :infinite-scroll-disabled="isLoading"
  >
    <template #item="{ item }">
      <el-card :key="postData" class="card" shadow="hover" >
        <div class="cardBody">
          <div class="postArea">
            <div class="postInfo">
              <span class="title">{{ item.title }}</span>
              <span class="time">{{ formatDate(item.created_at) }}</span>
            </div>
            <div class="postOperate">
              <!-- 操作按鈕 -->
              <el-dropdown size="small" trigger="click" v-show="item.username === user.username">
                <font-awesome-icon :icon="['fas', 'ellipsis']" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="editPost(item.id, item.title, item.content)">
                      <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                      <span class="operateLabel">Edit</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click="deletePost(item.id)">
                      <font-awesome-icon :icon="['fas', 'trash']" />
                      <span class="operateLabel">Delete</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div class="postContent">
            <p>{{ item.content }}</p>
          </div>
          <div class="userData">
            <el-avatar :src="item.avatar_url" :size="22"  class="userAvatar" >
              <el-icon size="14"><UserFilled /></el-icon>
            </el-avatar>
            <span class="username">{{ item.username }}</span>
          </div>
        </div>
      </el-card>
    </template>
  </Waterfall>

  <el-dialog v-model="dialogVisible" title="Edit Post" width="500" draggable>
    <el-form :model="editPostForm" :rules="rules" ref="postEditForm">
      <el-form-item prop="title">
        <span>Title:</span>
        <el-input v-model="editPostForm.title" placeholder="Title" />
      </el-form-item>
      <el-form-item prop="content">
        <span>Content:</span>
        <el-input
          v-model="editPostForm.content"
          type="textarea"
          placeholder="Content"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editPostBtn">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.cardsPlace {
  flex: 3;
  min-height: 817px;
}
.cards {
  flex: 3;
  background-color: #00000000;
  min-height: 757px;
  margin: 30px 0;
  padding-right: 38px;

  .card {
    color: var(--color-text);
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    .cardBody {
      display: flex;
      flex-direction: column;
      .postArea {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        .postInfo {
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
.operateLabel{
  margin-left: 5px;
}
</style>


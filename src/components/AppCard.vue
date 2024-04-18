<script setup>
// 引入 Waterfall
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
// 引入 useLikeStore
import { useLikeStore } from '@/stores/likeStore'
// 引入 ref...
import { ref, onMounted, reactive } from 'vue';
// 引入 icon
import { UserFilled } from "@element-plus/icons-vue";
// 引入 formatDate
import { formatDate } from '@/math/index.js'
// 引入 debounce
import { debounce } from 'lodash';
// 引入 router
import { useRouter } from 'vue-router';

const post = usePostStore()
const user = useUserStore()
const count = useCountStore();
const refresh = useRefreshStore()
const like = useLikeStore()

const router = useRouter();

const postsPage = ref(1);
const isLoading = ref(false);
const dialogVisible = ref(false);
const historyDialogVisible = ref(false);
const postEditForm = ref();

const editPostForm = reactive({
  id: '',
  title: '',
  content: '',
});

const historyData = reactive({
  avatar_url: '',
  username: '',
  date: '',
  title: '',
  content: '',
  createdOrEdited: '',
});

const popperStyle = reactive({
  width: 'auto',
  display: 'flex',
  justifyContent: 'center',
  padding: '0px',
  zIndex: '1'
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
  // if (refresh.pageLocation) {
  //   postsPage.value = Number(localStorage.getItem('postsPage')) || 1;
  // }
  await post.apiGetPosts(postsPage.value).then(() => {
    refresh.cardsReady = true;
    localStorage.setItem('postsPage', postsPage.value);
  })
  getLikePost();
  getPostsLikeNum();
})

const loadingPost = (async() => {
  postsPage.value += 1;
  await post.apiGetPosts(postsPage.value).then(() => {
    localStorage.setItem('postsPage', postsPage.value);
  }).catch(() => {
    isLoading.value = true;
  })
  getLikePost();
  getPostsLikeNum();
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
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'Edited successfully!',
      type: 'success',
      position: 'bottom-right',
    })
  }).catch(() => {
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'Edited failed!',
      type: 'error',
      position: 'bottom-right',
    })
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

const debouncedGetBackup = debounce((id) => {
  post.editObj = {
    id: '',
    post_id: '',
    username: '',
    avatar_url: '',
    title: '',
    content: '',
    edited_at: '',
    deleted_at: ''
  };
  post.apiGetHistoryPost(id);
}, 500, { leading: true });

const showHistory = (avatar_url, username, date, title, content, createdOrEdited) => {
  historyData.avatar_url = avatar_url;
  historyData.username = username;
  historyData.date = date;
  historyData.title = title;
  historyData.content = content;
  historyData.createdOrEdited = createdOrEdited;
  historyDialogVisible.value = true;
}

const apiGetCountInfo = (async() => {
  await count.apiGetPostCount();
  await count.apiGetUserPostCount();
  await count.apiGetUserCountCompare();
  await count.apiGetPostCountCompare();
})

const routerPostInfo = ((id) => {
  router.push({ path: `/posts/${id}` });
})

// 點擊讚按鈕的回調
const likePost = (async (userToken, postId, index) => {
  await like.apiLikePost(userToken, postId).then(() => {
    post.postObj.forEach(post => {
      if (post.id === postId) {
        post.isLike = !post.isLike
      }
    })
  })
  await getPostsLikeNum();
  await like.apiGetPostLikeNum(postId)
  post.postObj[index].likes = like.likePostNumObj.likes
})

const getLikePost = (async() => {
  await like.apiGetLikePost(user.token).then(() => {
    post.postObj.forEach(post => {
      if (like.likePosts.includes(post.id)) {
        post.isLike = true
      }
    })
  })
})

const getPostsLikeNum = (async() => {
  await like.apiGetPostsLikeNum();
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
    :animationDuration="300"
    v-infinite-scroll="loadingPost" 
    :infinite-scroll-disabled="isLoading"
  >
    <template #item="{ item, index }">
      <el-card :key="postData" class="card" shadow="hover" >
        <div class="cardBody">
          <div class="postArea">
            <div class="postInfo">
              <span class="title">{{ item.title }}</span>
            </div>
            <div class="postOperate"> 
              <!-- 歷史記錄 -->
              <div class="backBtn" >
                <el-popover
                  :popper-style="popperStyle"
                  placement="bottom" 
                  trigger="click"
                  hide-after="0"
                  @before-enter="debouncedGetBackup(item.id)"
                >
                  <div>
                    <div class="backupTitle">Edited {{ post.editObj.length || 0 }} time</div>
                      <!-- 最新的一條 -->
                      <div 
                        class="nowList" 
                        @click="showHistory(item.avatar_url, item.username, item.updated_at || item.created_at, item.title, item.content, post.editObj.length ? 'edited on' : 'created on')"
                      >
                        <el-avatar :src="item.avatar_url" :size="22"  class="userAvatar" >
                          <el-icon size="14"><UserFilled /></el-icon>
                        </el-avatar>
                        <span class="username">{{ item.username }}</span>
                        <span class="date">{{ post.editObj.length ? 'edited on' : 'created on' }} {{ formatDate(item.updated_at || item.created_at) }}</span>
                      </div>
                      <!-- 之前所有修改過的 -->
                      <div 
                        class="backupList" 
                        v-show="post.editObj.length > 0" 
                        @click="showHistory(edit.avatar_url, edit.username, edit.edited_at, edit.title, edit.content, post.editObj.length === 1 ? 'created on' : (index ? 'created on' : 'edited on'))"
                        v-for="(edit, index) in post.editObj" 
                        :key="edit.id"
                      >
                        <el-avatar :src="edit.avatar_url" :size="22"  class="userAvatar" >
                          <el-icon size="14"><UserFilled /></el-icon>
                        </el-avatar>
                        <span class="username">{{ edit.username }}</span>
                        <span class="date">{{ post.editObj.length === 1 ? 'created on' : (index ? 'created on' : 'edited on') }} {{ formatDate(edit.edited_at) }}</span>
                      </div>
                      
                  </div>
                  <template #reference>
                    <el-icon><List /></el-icon>
                  </template>
                </el-popover>
              </div>
              <!-- 操作按鈕 -->
              <el-dropdown size="small" trigger="click" class="moreBtn" v-show="item.username === user.username">
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
          <div class="time">
            <span>{{ item.updated_at != null ? "edited at " + formatDate(item.updated_at) : formatDate(item.created_at) }}</span>
          </div>
          <div class="postContent">
            <p>{{ item.content }}</p>
          </div>
          <div class="cardFooter">
            <div class="cardLike">
              <font-awesome-icon @click="likePost(user.token, item.id, index)" :icon="[`${item.isLike ?'fas' :'far'}`, 'thumbs-up']" />
              <span class="likeNum">{{ item.likes }}</span>
            </div>
            <div class="userData">
              <el-avatar :src="item.avatar_url" :size="22"  class="userAvatar" >
                <el-icon size="14"><UserFilled /></el-icon>
              </el-avatar>
              <span class="username">{{ item.username }}</span>
            </div>
          </div>
          
          <div class="cardBg" @click="routerPostInfo(item.id)">
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
  <el-dialog v-model="historyDialogVisible"  width="500" class="historyDialog">
    <div class="historyDialogBody">
      <div class="historyDialogHeader">
        <el-avatar :src="historyData.avatar_url" :size="22"  class="userAvatar" >
          <el-icon size="14"><UserFilled /></el-icon>
        </el-avatar>
        <span class="username">{{ historyData.username }}</span>
        <span class="date">{{ historyData.createdOrEdited }} {{ formatDate(historyData.date) }}</span>
      </div>
      <div class="historyDialogContent">
        <div class="title"><span>{{ historyData.title }}</span></div>
        <div class="content"><span>{{ historyData.content }}</span></div>
      </div>
    </div>
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
  padding-right: 30px;
  .card {
    color: var(--color-text);
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    .cardBody {
      display: flex;
      flex-direction: column;
      .postArea {
        display: flex;
        justify-content: space-between;
        .postInfo {
          padding-right: 10px;
          .title {
            font-size: 20px;
            font-weight: 600;
            position: relative;
            z-index: 1;
          }
        }
        .postOperate {
          display: flex;
          margin-top: 8.5px;
          position: relative;
          z-index: 1;
          .backBtn {
            display: flex;
            color: var(--el-text-color-regular);
            margin-top: -0.5px;
            &:hover {
              cursor: pointer;
            }
          }
          .moreBtn {
            margin-left: 10px;
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
      .time {
        font-size: 12px;
        color: var(--color-time);
        span {
          position: relative;
          z-index: 1;
        }
      }
      .postContent {
        display: flex;
        p {
          margin-top: 10px;
          font-size: 14px;
          position: relative;
          z-index: 1;
        }
      }
      .cardFooter {
        display: flex;
        justify-content: space-between;
        .cardLike {
          display: flex;
          align-items: flex-end;
          margin-bottom: 6px;
          margin-left: 1px;
          z-index: 1;
          &:hover {
            cursor: pointer;
          }
          .likeNum {
            position: relative;
            top: 5px;
            left: 7px;
          }
        }
        .userData {
          display: flex;
          align-items: center;
          margin-top: 20px;
          justify-content: flex-end;
          
          .userAvatar {
            margin-right: 5px; 
            position: relative;
            z-index: 1;
          }
          .username {
            position: relative;
            z-index: 1;
            font-weight: 600;
          }
        }
      }
      .cardBg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
.operateLabel{
  margin-left: 5px;
}
.backupTitle {
  margin-top: 12px;
  margin-bottom: 10px;
  padding: 0 20px;
  font-weight: 600;
}
.backupList, .nowList {
  display: flex;
  align-items: center;
  border-top: 1px solid var(--color-border);
  padding: 10px 20px;
  &:hover{
    cursor: pointer;
  }
  .userAvatar {
    margin-right: 5px;
  }
  .username {
    margin-right: 5px;
    font-weight: 600;
  }
}
.historyDialogBody {
  color: var(--color-text);
  .historyDialogHeader {
    display: flex;
    align-items: center;
    padding: 16px;
    padding-bottom: 15px;
    .userAvatar {
      margin-right: 5px;
    }
    .username {
      margin-right: 5px;
      font-weight: 600;
    }
  }
  .historyDialogContent {
    border-top: 1px solid var(--color-border);
    padding: 16px;
    .title {
      box-shadow: inset 4px 0 0 #4ac26b66;
      span {
        font-size: 18px;
        font-weight: 600;
        margin-left: 10px;
      }
    }
    .content {
      box-shadow: inset 4px 0 0 #4ac26b66;
      margin-top: 15px;
      span {
        margin-left: 10px;
      }
    }
  }
}

</style>
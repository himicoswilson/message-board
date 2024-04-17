<script setup>
import { ref, reactive, onMounted } from 'vue'
// 引入 useUserStore
import { useUserStore } from '@/stores/userStore'
// 引入 usePostStore
import { usePostStore } from '@/stores/postStore'
// 引入 countStore
import { useCountStore } from '@/stores/countStore'
// 引入 refreshStore
import { useRefreshStore } from '@/stores/refreshStore'

const user = useUserStore();
const post = usePostStore();
const count = useCountStore();
const refresh = useRefreshStore();

const postForm = ref();
const formInline = reactive({
  title: '',
  content: ''
})

const rules = reactive({
  title: [
    { required: true, message: 'Please input title', trigger: 'change' },
  ],
  content: [
    { required: true, message: 'Please input content', trigger: 'change' },
  ],
})

onMounted(async () => {
  await count.apiGetUserCount()
  await apiGetCountInfo().then(() => {
    refresh.asideReady = true;
  })
})

const apiGetCountInfo = (async () => {
  await count.apiGetPostCount();
  await count.apiGetUserPostCount();
  await count.apiGetUserCountCompare();
  await count.apiGetPostCountCompare();
})

const submitPost = (async () => {
  await postForm.value.validate();
  await post.apiPostMsg(formInline.title, formInline.content).then(() => {
    post.apiGetNewPost();
    apiGetCountInfo();
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'post successfully! ',
      type: 'success',
      position: 'bottom-right',
    })
  })
  .catch((error) => {
    // eslint-disable-next-line no-undef
    ElNotification({
      message: `${error}`,
      type: 'error',
      position: 'bottom-right',
    });
  });
  formInline.title = '';
  formInline.content = '';
  postForm.value.clearValidate();
})

const submitClear = (() => {
  formInline.title = '';
  formInline.content = '';
})

const handleAvatarSuccess = (async (res) => {
  // eslint-disable-next-line no-undef
  ElNotification({
    message: `${res}`,
    type: 'success',
    position: 'bottom-right',
  })
  await user.apiGetInfo()
  // 去post.postObj裡尋找與user.username 相同的對象，改變對象裡的avatar_url為user.avatar_url
  post.postObj.forEach((element) => {
    if (element.username === user.username) {
      element.avatar_url = user.avatar_url;
    }
  })
})

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    // eslint-disable-next-line no-undef
    ElMessage.error('Avatar picture must be JPG/PNG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    // eslint-disable-next-line no-undef
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
</script>
<template>
  <div v-if="refresh.loading" class="asidePlace">
    <!-- 佔位 -->
  </div>
  <div class="aside" v-if="!refresh.loading">
    <div class="asideContent">
      <div class="postMessage">
        <span class="postTitle">POST MESSAGE</span>
        <el-form :model="formInline" :rules="rules" ref="postForm">
          <el-form-item prop="title">
            <el-input v-model="formInline.title"  placeholder="Title..." />
          </el-form-item>
          <el-form-item prop="content">
            <el-input v-model="formInline.content"  type="textarea" placeholder="Content..." />
          </el-form-item>
          <div class="postButtons">
            <el-form-item>
            <el-button type="danger" @click="submitClear" class="clearButton">Clear</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitPost">Submit</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="userInfo">
        <div class="userInfoContent">
          <el-upload
            class="avatarUploader"
            action="http://47.100.101.113:3000/uploadavatar"
            :show-file-list="false"
            :data="{ id: user.id }"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-icon class="avatarUploaderIcon"><Plus /></el-icon>
            <div class="userAvatarMask"></div>
            <el-avatar :src="user.avatar_url" :size="64" class="userAvatar" >
              <el-icon size="40"><UserFilled /></el-icon>
            </el-avatar>
          </el-upload>
          <span>{{ user.username }}</span>
        </div>
        <el-col :span="20" class="userCounts">
          <el-statistic title="UID" :value="user.id" />
          <el-statistic title="Post" :value="count.userPostCount" />
        </el-col>
      </div>
      <div class="statisticCard">
        <el-col :span="20" class="statisticCardBody">
          <div>
            <el-statistic title="User Count" :value="count.userCount" />
            <div class="newUserCount">
              <div class="CaretTop" v-if="count.compareUserCount >= 0">
                <el-icon >
                  <CaretTop />
                </el-icon>
                <span>{{ Math.abs(count.compareUserCount)  }}</span>
              </div>
              <div class="CaretBottom" v-else-if="count.compareUserCount < 0">
                <el-icon >
                  <CaretBottom />
                </el-icon>
                <span>{{ Math.abs(count.compareUserCount)  }}</span>
              </div>
            </div>
          </div>
          <div>
            <el-statistic title="Post Count" :value="count.postCount" />
            <div class="newPostCount">
              <div class="CaretTop" v-if="count.comparePostCount >= 0">
                <el-icon >
                  <CaretTop />
                </el-icon>
                <span>{{ Math.abs(count.comparePostCount)  }}</span>
              </div>
              <div class="CaretBottom" v-else-if="count.comparePostCount < 0">
                <el-icon >
                  <CaretBottom />
                </el-icon>
                <span>{{ Math.abs(count.comparePostCount)  }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.asidePlace {
  flex: 1;
}
.aside {
  display: flex;
  justify-content: center;
  padding: 30px 0 0 28px;
  border-left: 1px solid var(--color-border);
  .asideContent {
    // position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    .postMessage {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 270px;
      padding: 10px 20px;
      background-color: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      transition: .3s;

      &:hover{
        box-shadow: var(--el-box-shadow-light);
      }

      .postTitle {
        margin: 10px 0 15px 0;
        font-size: 14px;
        font-weight: 700;
        line-height: 24px;
      }

      .postButtons {
        display: flex;
        justify-content: space-between;

        .clearButton {
          width: 75.58px;
        }
      }
    }
    .userInfo {
      width: 270px;
      margin: 12px 0;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      background-color: var(--color-card);
      transition: .3s;
      &:hover{
        box-shadow: var(--el-box-shadow-light);
      }
      .userInfoContent {
        display: flex;
        flex-direction: column;
        align-items: center;
        .avatarUploaderIcon {
          display: none;
          position: absolute;
          font-size: 30px;
          color: #b5b0b0;
          z-index: 2;
        }
        .userAvatarMask {
          width: 64px;
          height: 64px;
          position: absolute;
          margin-top: -10px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.5); /* 使用半透明黑色作为遮罩颜色，可自定义 */
          opacity: 0; /* 初始状态时隐藏遮罩 */
          transition: opacity 0.3s ease-in-out; /* 添加过渡效果，使遮罩显示与隐藏更平滑 */
          z-index: 1; /* 确保遮罩层位于 `.userAvatar` 内部内容之上 */
        }
        .avatarUploader {
          &:hover {
            .avatarUploaderIcon {
              display: block;
            }
            .userAvatarMask {
              opacity: 1;
            }
          }
        }
        .userAvatar {
          margin-bottom: 10px;
        }
      }
      .userCounts {
        width: 270px;
        margin-top: 5px;
        display: flex;
        justify-content: space-evenly;
      }
    }
    .statisticCard {
      display: flex;
      justify-content: space-around;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      background-color: var(--color-card);
      transition: .3s;
      &:hover{
        box-shadow: var(--el-box-shadow-light);
      }
      .statisticCardBody {
        display: flex;
        justify-content: space-between;
        width: 270px;
        padding: 20px;
        position: relative;
        .newUserCount {
          position: absolute;
          top: 50px;
          left: 67px;
          span {
            position: absolute;
            top: -2px;
            left: 18px;
          }
          .CaretTop {
            color: var(--el-color-success);
          }
          .CaretBottom {
            color: var(--el-color-danger);
          }
        }
        .newPostCount {
          position: absolute;
          top: 50px;
          left: 193px;
          span {
            position: absolute;
            top: -2px;
            left: 18px;
          }
          .CaretTop {
            color: var(--el-color-success);
          }
          .CaretBottom {
            color: var(--el-color-danger);
          }
        }
      }
    }
  }
}
.el-col {
  text-align: center;
}
</style>
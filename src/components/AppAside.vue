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
import { UserFilled } from "@element-plus/icons-vue";

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

onMounted(async() => {
  await count.apiGetUserCount()
  await apiGetCountInfo().then(() => {
    refresh.asideReady = true;
  })
})

const apiGetCountInfo = (async() => {
  await count.apiGetPostCount();
  await count.apiGetUserPostCount();
  await count.apiGetUserCountCompare();
  await count.apiGetPostCountCompare();
})

const submitPost = (async () => {
  await postForm.value.validate();
  await post.apiPostMsg(formInline.title, formInline.content).then(() => {
    post.apiGetPost();
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
})

const submitClear = (() => {
  formInline.title = '';
  formInline.content = '';
})

const abs = (num) => {
  return Math.abs(num);
}
</script>
<template>
  <div v-if="refresh.loading" class="aside">
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
          <el-avatar :src="user.avatar_url" :size="64" :icon="UserFilled" class="userAvatar" />
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
                <span>{{ abs(count.compareUserCount)  }}</span>
              </div>
              <div class="CaretBottom" v-else-if="count.compareUserCount < 0">
                <el-icon >
                  <CaretBottom />
                </el-icon>
                <span>{{ abs(count.compareUserCount)  }}</span>
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
                <span>{{ abs(count.comparePostCount)  }}</span>
              </div>
              <div class="CaretBottom" v-else-if="count.comparePostCount < 0">
                <el-icon >
                  <CaretBottom />
                </el-icon>
                <span>{{ abs(count.comparePostCount)  }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.aside {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 30px 0 0 50px;
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
      margin: 20px 0;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      background-color: var(--color-card);
      .userInfoContent {
        display: flex;
        flex-direction: column;
        align-items: center;
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
.el-col {
  text-align: center;
}
</style>
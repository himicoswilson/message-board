<script setup>
import { ref, reactive } from 'vue'
// 引入 useStore
import { useUserStore } from '../stores/userStore'
// 引入路由
import { useRouter } from 'vue-router'
// 引入 formatDate
import { formatDate } from '@/math/index.js'

const user = useUserStore()
const router = useRouter()

const loginForm = ref()
const dialogVisible = ref(false)

const userValidateForm = reactive({
  username: '',
  password: ''
})

const rules = reactive({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 2, max: 18, message: 'Length should be 2 to 18', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, max: 18, message: 'Length should be 6 to 18', trigger: 'blur' }
  ]
})

const getLogin = async () => {
  await loginForm.value.validate()
  await user
    .apiLogin(userValidateForm.username, userValidateForm.password)
    .then(() => {
      // 跳转到首页
      router.push('/')
      // eslint-disable-next-line no-undef
      ElNotification({
        message: 'Login successfully!',
        type: 'success',
        position: 'bottom-right'
      })
    })
    .catch(async () => {
      await user
        .apiSearchLogoff(userValidateForm.username, userValidateForm.password)
        .then(() => {
          dialogVisible.value = true
        })
        .catch((error) => {
          // eslint-disable-next-line no-undef
          ElNotification({
            message: `${error}`,
            type: 'error',
            position: 'bottom-right'
          })
        })
    })
}

const restore = async () => {
  await user
    .apiRestoreUser()
    .then(async () => {
      await user.apiLogin(user.logoffUser.username, user.logoffUser.password).then(() => {
        // 跳转到首页
        router.push('/')
        // eslint-disable-next-line no-undef
        ElNotification({
          message: 'Restore and Login successfully!',
          type: 'success',
          position: 'bottom-right'
        })
      })
    })
    .catch((error) => {
      // eslint-disable-next-line no-undef
      ElNotification({
        message: `${error}`,
        type: 'error',
        position: 'bottom-right'
      })
    })
}
</script>

<template>
  <div class="loginContainer">
    <h1 class="loginTitle">Login to MessageBoard</h1>
    <el-form class="login-form" :model="userValidateForm" :rules="rules" ref="loginForm">
      <label class="username" for="username">Username or email address</label>
      <el-form-item prop="username">
        <el-input
          v-model="userValidateForm.username"
          id="username"
          autofocus="true"
          @keyup.enter="getLogin()"
        />
      </el-form-item>
      <label class="password" for="password">Password</label>
      <el-form-item prop="password">
        <el-input
          v-model="userValidateForm.password"
          type="password"
          show-password
          @keyup.enter="getLogin()"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="loginBtn" @click="getLogin()">Login</el-button>
      </el-form-item>
    </el-form>
    <div class="NoAccount">
      <span>New to MessageBoard? </span>
      <RouterLink to="signup">Sign up →</RouterLink>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="Warning" width="500" align-center>
    <div class="dialogBody">
      <span>Your account has been cancelled. Do you want to restore it?</span>
      <el-avatar
        :src="user.logoffUser.avatar_url"
        :size="64"
        :icon="UserFilled"
        class="userAvatar"
      />
      <p>Username: {{ user.logoffUser.username }}</p>
      <p>Logoff Time: {{ formatDate(user.logoffUser.deleted_at) }}</p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="restore"> Restore </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.loginContainer {
  text-align: center;
  margin-top: 50px;

  .logo {
    width: 100px;
  }

  .loginTitle {
    font-size: 24px;
    margin-bottom: 20px;
  }
  .login-form {
    width: 300px;
    background-color: var(--color-login);
    margin: 0 auto;
    padding: 20px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;

    .username {
      text-align: left;
      margin-bottom: 8px;
    }

    .password {
      text-align: left;
      margin-top: -8px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      color: var(--el-text-color-primary);
    }

    .loginBtn {
      width: 100%;
      padding: 8px;
      background-color: #1f883d;
      color: #fff;
      font-weight: 600;
      border: none;
      border-radius: 6px;

      &:hover {
        background-color: #1a7f37;
      }
    }
  }
  .NoAccount {
    display: block;
    width: 300px;
    margin: 16px auto 0 auto;
    padding: 16px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
  }
}
.dialogBody {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 24px;
  .userAvatar {
    margin-top: 16px;
    margin-bottom: 4px;
  }
}
</style>

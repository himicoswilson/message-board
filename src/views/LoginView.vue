<script setup>
import { ref, reactive } from 'vue'
// 引入 useStore
import { useUserStore } from '../stores/userStore'
// 引入路由
import { useRouter } from "vue-router";

const user = useUserStore()
const router = useRouter()

const loginForm = ref();

const userValidateForm = reactive({
  username: '',
  password: '',
})

const rules = reactive({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 3, max: 8, message: 'Length should be 3 to 8', trigger: 'blur' },
  ],
})

const getLogin = (async () => {
  await loginForm.value.validate()
  await user.apiLogin(userValidateForm.username, userValidateForm.password).then( () => {
    // 跳转到首页
    router.push('/')
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'Login successfully!',
      type: 'success',
      position: 'bottom-right',
    })
  }).catch(() => {
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'Fail to login.',
      type: 'error',
      position: 'bottom-right',
    })
  })
})
</script>

<template>
  <div class="loginContainer">
    <img src="../assets/images/logo.webp" alt="this is message board logo." class="logo">
    <h1 class="loginTitle">Login to MessageBoard</h1>
    <el-form class="login-form" :model="userValidateForm" :rules="rules" ref="loginForm">
      <label class="username" for="username">Username or email address</label>
      <el-form-item prop="username">
        <el-input v-model="userValidateForm.username" id="username" autofocus="true"/>
      </el-form-item>
      <label class="password" for="password">Password</label>
      <el-form-item prop="password">
        <el-input v-model="userValidateForm.password" type="password" show-password/>
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
    border: 1px solid var(--color-border);
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
      color: var(--color-text);
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
    border: 1px solid var(--color-border);
    border-radius: 6px;
  }
}
</style>
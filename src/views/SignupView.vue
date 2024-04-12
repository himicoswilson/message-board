<script setup>
import { ref, reactive } from 'vue'
// 引入 useStore
import { useUserStore } from '../stores/userStore'
import { useRouter } from "vue-router";
import { uuid } from 'vue3-uuid';

const user = useUserStore()
const router = useRouter()

const userValidateForm = reactive({
  username: '',
  password: '',
})
const token = uuid.v4()
const signupForm = ref();

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

// 在 Vue 组件中发送登录请求
const getSignup = (async() => {
  await signupForm.value.validate();
  try {
    await user.apiSignup(userValidateForm.username, userValidateForm.password, token).then(value => {
      console.log(value);
    })
    await user.apiLogin(userValidateForm.username, userValidateForm.password).then(() => {
      // 将 token 存储到 localStorage
      localStorage.setItem('token', token);
      // 跳转到首页
      router.push('/')
    })
    // console.log(response);
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'Signup successfully!',
      type: 'success',
      position: 'bottom-right',
    })
  } catch (error) {
    // eslint-disable-next-line no-undef
    ElNotification({
      message: `${error.response.data}`,
      type: 'error',
      position: 'bottom-right',
    })
  }
});

</script>

<template>
  <div class="signupContainer">
    <img src="../assets/images/logo.webp" alt="this is message board logo." class="logo">
    <h1 class="signupTitle">Sign Up to MessageBoard</h1>
    <el-form class="signup-form" :model="userValidateForm" :rules="rules" ref="signupForm">
      <label class="username" for="username">Username or email address</label>
      <el-form-item prop="username">
        <el-input v-model="userValidateForm.username" id="username" autofocus="true" @keyup.enter="getSignup()"/>
      </el-form-item>
      <label class="password" for="password">Password</label>
      <el-form-item prop="password">
        <el-input v-model="userValidateForm.password" type="password" show-password @keyup.enter="getSignup()"/>
      </el-form-item>
      <el-form-item>
        <el-button class="signupBtn" @click="getSignup()">Sign Up</el-button>
      </el-form-item>
    </el-form>
    <div class="haveAccount">
      <span>Already have an account? </span>
      <RouterLink to="login">Login →</RouterLink>
    </div>
  </div>
</template>

<style lang="less" scoped>
.signupContainer {
  text-align: center;
  margin-top: 50px;

  .logo {
    width: 100px;
  }
  
  .signupTitle {
    font-size: 24px;
    margin-bottom: 20px;
  }
  .signup-form {
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

    .signupBtn {
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
  .haveAccount {
    display: block;
    width: 300px;
    margin: 16px auto 0 auto;
    padding: 16px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
  }
}
</style>
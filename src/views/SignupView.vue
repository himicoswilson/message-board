<script setup>
import { ref } from 'vue'
// 引入 useStore
import { useUserStore } from '../stores/userStore'
import { useRouter } from "vue-router";
import { uuid } from 'vue3-uuid';

const user = useUserStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const token = uuid.v4()


// 在 Vue 组件中发送登录请求
async function getSignup(){
  try {
    await user.apiSignup(username.value, password.value, token).then(value => {
      console.log(value);
    })
    await user.apiLogin(username.value, password.value).then(() => {
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
    })
  } catch (error) {
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'Fail to signup.',
      type: 'error',
    })
  }
}

</script>

<template>
  <div class="signupContainer">
    <img src="../assets/images/logo.webp" alt="this is message board logo." class="logo">
    <h1 class="signupTitle">Sign Up to MessageBoard</h1>
    <form @submit.prevent="signup" class="signup-form">
      <label class="username" for="username">Username or email address</label>
      <input type="text" id="username" v-model="username" required>
      <label class="password" for="password">Password</label>
      <input type="password" id="password" v-model="password" required>
      <button type="submit" @click="getSignup">Sign Up</button>
    </form>
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
    background-color: #f6f8fa;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #d0d7de;
    border-radius: 6px;
    
    .username {
      text-align: left;
    }

    .password {
      text-align: left;
    }

    label {
      display: block;
      margin-bottom: 5px;
      color: #000;
    }

    input {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #d0d7de;
      border-radius: 6px;
    }

    button {
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
    border: 1px solid #d0d7de;
    border-radius: 6px;
  }
}
</style>
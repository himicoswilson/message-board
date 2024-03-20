<script setup>
// 引入 Axios
import axios from 'axios';
import { ref } from 'vue'
import { useRouter } from "vue-router";

const username = ref('')
const password = ref('')
const router = useRouter()

// 在 Vue 组件中发送登录请求
async function getLogin(){
  try {
    const response = await axios.post('http://47.100.101.113:3000/login', {
      username: username.value,
      password: password.value
    });
    // 可以在这里进行页面跳转或其他操作
    // 将 token 存储到 localStorage
    localStorage.setItem('token', response.data.token);
    // 跳转到首页
    router.push('/')
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'Login successfully!',
      type: 'success',
    })
  } catch (error) {
    // 处理登录失败的逻辑
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'Incorrect username or password.',
      type: 'error',
    })
  }
}

</script>

<template>
  <div class="loginContainer">
    <img src="../assets/images/logo.webp" alt="this is message board logo." class="logo">
    <h1 class="loginTitle">Login to MessageBoard</h1>
    <form @submit.prevent="login" class="login-form">
      <label class="username" for="username">Username or email address</label>
      <input type="text" id="username" v-model="username" required>
      <label class="password" for="password">Password</label>
      <input type="password" id="password" v-model="password" required>
      <button type="submit" @click="getLogin">Login</button>
    </form>
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
  .NoAccount {
    display: block;
    width: 300px;
    margin: 16px auto 0 auto;
    padding: 16px;
    border: 1px solid #d0d7de;
    border-radius: 6px;
  }
}
</style>
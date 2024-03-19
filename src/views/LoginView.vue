<script setup>
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
      <button type="submit">Login</button>
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
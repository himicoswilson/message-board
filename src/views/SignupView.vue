<script setup>
import { ref, reactive, onUnmounted } from 'vue'
// 引入 useStore
import { useUserStore } from '../stores/userStore'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import { uuid } from 'vue3-uuid'

const user = useUserStore()
const auth = useAuthStore()
const router = useRouter()

const userValidateForm = reactive({
  email: '',
  verificationCode: '',
  username: '',
  password: ''
})
const token = uuid.v4()
const signupForm = ref()
const disableButton = ref(false)
const buttonText = ref('Get Code')
const timerId = ref(null)

onUnmounted(() => {
  if (timerId.value) {
    clearInterval(timerId.value)
  }
})

const rules = reactive({
  email: [
    {
      required: true,
      message: 'Please input your email',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: 'Please input correct email',
      trigger: 'blur'
    }
  ],
  verificationCode: [
    { required: true, message: 'Please input your verification code', trigger: 'blur' }
  ],
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 2, max: 18, message: 'Length should be 2 to 18', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, max: 18, message: 'Length should be 6 to 18', trigger: 'blur' }
  ]
})

const getVerificationCode = async () => {
  await signupForm.value.validateField('email')
  await auth
    .apiSendVerificationCode(userValidateForm.email)
    .then(() => {
      // eslint-disable-next-line no-undef
      ElNotification({
        message: 'Verification code sent successfully',
        type: 'success',
        position: 'bottom-right'
      })
      disableButton.value = true
      buttonText.value = '30s'

      timerId.value = setInterval(() => {
        const currentCount = parseInt(buttonText.value.slice(0, -1), 10)

        if (currentCount <= 1) {
          clearInterval(timerId.value)
          disableButton.value = false
          buttonText.value = 'Get Code'
        } else {
          buttonText.value = `${currentCount - 1}s`
        }
      }, 1000)
    })
    .catch(() => {
      // eslint-disable-next-line no-undef
      ElNotification({
        message: 'Verification code sent failed!',
        type: 'error',
        position: 'bottom-right'
      })
    })
}

// 在 Vue 组件中发送登录请求
const getSignup = async () => {
  await signupForm.value.validate()
  try {
    await auth.apiVerifyCode(userValidateForm.email, userValidateForm.verificationCode)
    await user.apiSignup(
      userValidateForm.email,
      userValidateForm.username,
      userValidateForm.password,
      token
    )
    await user.apiLogin(userValidateForm.username, userValidateForm.password).then(() => {
      // 将 token 存储到 localStorage
      localStorage.setItem('token', token)
      // 跳转到首页
      router.push('/')
    })
    // console.log(response);
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'Signup successfully!',
      type: 'success',
      position: 'bottom-right'
    })
  } catch (error) {
    // eslint-disable-next-line no-undef
    ElNotification({
      message: `${error.response.data}`,
      type: 'error',
      position: 'bottom-right'
    })
  }
}
</script>

<template>
  <div class="signupContainer">
    <h1 class="signupTitle">Sign Up to MessageBoard</h1>
    <el-form class="signup-form" :model="userValidateForm" :rules="rules" ref="signupForm">
      <label class="email" for="email">Email address</label>
      <el-form-item prop="email">
        <el-input
          v-model="userValidateForm.email"
          id="email"
          autofocus="true"
          @keyup.enter="getSignup()"
        >
          <template #append>
            <el-button :disabled="disableButton" @click="getVerificationCode">{{
              buttonText
            }}</el-button>
          </template>
        </el-input>
      </el-form-item>
      <label class="verificationCode" for="verificationCode">Verification Code</label>
      <el-form-item prop="verificationCode">
        <el-input
          v-model="userValidateForm.verificationCode"
          id="verificationCode"
          @keyup.enter="getSignup()"
        />
      </el-form-item>
      <label class="username" for="username">Username</label>
      <el-form-item prop="username">
        <el-input v-model="userValidateForm.username" id="username" @keyup.enter="getSignup()" />
      </el-form-item>
      <label class="password" for="password">Password</label>
      <el-form-item prop="password">
        <el-input
          v-model="userValidateForm.password"
          type="password"
          show-password
          @keyup.enter="getSignup()"
        />
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
    border: 1px solid var(--el-border-color);
    border-radius: 6px;

    .email {
      text-align: left;
      margin-bottom: 8px;
    }

    .verificationCode {
      text-align: left;
      margin-bottom: 8px;
      margin-top: -8px;
    }

    .username {
      text-align: left;
      margin-bottom: 8px;
      margin-top: -8px;
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
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
  }
}
</style>

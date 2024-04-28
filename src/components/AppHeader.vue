<script setup>
// 引入路由
import { useRouter } from 'vue-router'
// 引入 useUserStore
import { useUserStore } from '@/stores/userStore'
// 引入 useRefreshStore
import { useRefreshStore } from '@/stores/refreshStore'
import { ref, onMounted, watch, nextTick } from 'vue'
import { Refresh, Filter, Top, UserFilled, Sunny, Moon } from '@element-plus/icons-vue'

const router = useRouter()
const user = useUserStore()
const refresh = useRefreshStore()

const dialogVisible = ref(false)
const isDarkTheme = ref(false)
const loading = ref(true)

onMounted(async () => {
  await user.apiGetInfo().then(() => {
    nextTick(() => {
      loading.value = false
    })
  })
})

onMounted(() => {
  const darkMode = localStorage.getItem('theme')
  if (darkMode === 'dark') {
    document.body.classList.add('dark')
    isDarkTheme.value = true
  }
})

const goHome = () => {
  if (router.currentRoute.value.path === '/') {
    refresh.refresh()
    return
  } else {
    router.push('/')
  }
}

const refreshBtn = () => {
  refresh.refresh()
}
const goTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 讓捲動有平滑效果
  })
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const logoff = async () => {
  await user.apiLogoff().then(() => {
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'logoff successfully! ',
      type: 'success',
      position: 'bottom-right'
    })
    logout()
  })
}

watch(isDarkTheme, () => {
  if (isDarkTheme.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
})

// 把el-switch實例傳進函數switchTheme裡
// const switchTheme = (elSwitch) => {
//   const transition = document.startViewTransition();
//   // 拿到el-switch的座標
//   const x = elSwitch.clientX;
//   const y = elSwitch.clientY;

//   const targetRadius = Math.hypot(
//     Math.max(x, window.innerWidth - x),
//     Math.max(y, window.innerHeight - y)
//   );

//   if( isDarkTheme.value ) {
//     transition.ready.then(() => {
//       document.documentElement.animate(
//         {
//           clipPath: [
//             `circle(0% at ${x}px ${y}px)`,
//             `circle(${targetRadius}px at ${x}px ${y}px)`
//           ]
//         },
//         {
//           duration: 1000,
//           pseudoElement: '::view-transition-new(root)',
//         }
//       );
//     })
//   } else {
//     transition.ready.then(() => {
//       document.documentElement.animate(
//         {
//           clipPath: [
//             `circle(${targetRadius}px at ${x}px ${y}px)`,
//             `circle(0% at ${x}px ${y}px)`
//           ]
//         },
//         {
//           duration: 1000,
//           pseudoElement: '::view-transition-new(root)',
//         }
//       );
//     })
//   }
// }
</script>
<template>
  <div class="AppHeader">
    <div class="AppHeader-globalBar">
      <div class="AppHeader-globalBar-start">
        <span class="title" @click="goHome">Message-Board</span>
      </div>
      <div class="AppHeader-globalBar-end">
        <!-- 刷新 -->
        <el-button :icon="Refresh" circle @click="refreshBtn" class="refresh" />
        <!-- 篩選 -->
        <el-button :icon="Filter" circle @click="dialogVisible = true" class="filter" />
        <el-button :icon="Top" circle @click="goTop" class="goTop" />
        <!-- 切換暗色模式 -->
        <el-switch
          v-model="isDarkTheme"
          size="large"
          :active-action-icon="Moon"
          :inactive-action-icon="Sunny"
          class="themeSwitch"
          @click="switchTheme"
        />
        <!-- 用戶頭像下拉選單：退出登陸 -->
        <el-skeleton
          v-if="loading"
          class="userAvatarPlace"
          style="--el-skeleton-circle-size: 32px; display: flex"
          animated
        >
          <template #template>
            <el-skeleton-item variant="circle" />
          </template>
        </el-skeleton>
        <el-dropdown v-if="!loading">
          <el-avatar
            :src="user.userInfo.avatar_url"
            :size="32"
            :icon="UserFilled"
            class="userAvatar"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出登陸</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu>
              <el-dropdown-item @click="logoff">註銷帳戶</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="篩選" width="500" :before-close="handleClose">
    <el-form>
      <!-- 選擇哪個用戶 -->
      <el-select v-model="value" placeholder="請選擇用戶">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.AppHeader {
  margin-bottom: 73px;
  .AppHeader-globalBar {
    display: flex;
    padding: 16px 50px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-image: radial-gradient(transparent 1px, var(--el-bg-color) 1px);
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);
    border-bottom: 1px solid var(--el-border-color);

    .AppHeader-globalBar-start {
      flex: 1 1 auto;
      display: flex;
      align-items: center;

      .title {
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .AppHeader-globalBar-end {
      flex: 0 1 auto;
      display: flex;
      align-items: center;
      .goTop {
        margin-left: 12px;
      }
      .el-button {
        background-color: var(--el-bg-color);
      }
      .themeSwitch {
        margin-left: 12px;
        --el-switch-on-color: var(--el-bg-color);
        --el-switch-border-color: var(--el-border-color);

        // .el-switch__core .el-switch__action {
        //   background-color: var(--el-bg-color) !important;
        // }
      }
      .userAvatarPlace {
        margin-left: 12px;
      }
      .userAvatar {
        margin-left: 12px;
        border: 1px solid var(--el-border-color);
      }
    }
  }
}
.el-switch--large .el-switch__core .el-switch__action {
  background-color: #040404 !important;
}
</style>

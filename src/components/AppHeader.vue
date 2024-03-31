<script setup>
// 引入路由
import { useRouter } from "vue-router";
// 引入 useUserStore
import { useUserStore } from '@/stores/userStore'
// 引入 useRefreshStore
import { useRefreshStore } from '@/stores/refreshStore'
import { ref, onBeforeMount,onMounted, watch } from 'vue';
import { Refresh, Filter, Top, UserFilled, Sunny, Moon } from "@element-plus/icons-vue";

const router = useRouter()
const user = useUserStore()
const refresh = useRefreshStore()

const dialogVisible = ref(false);
const isDarkTheme = ref(false)

onBeforeMount(() => {
  user.apiGetInfo()
})

onMounted(() => {
  const darkMode = localStorage.getItem('theme')
  if(darkMode==='dark'){ 
    document.body.classList.add('dark') 
    isDarkTheme.value = true
  } 
})

const goHome = (() => {
  router.push('/')
})

const refreshButton = (() => {
  refresh.refresh()
})
const goTop = (() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth" // 讓捲動有平滑效果
  });
})

const logout = (() => {
  localStorage.removeItem('token');
  router.push('/login')
})

watch(isDarkTheme, () => {
  if( isDarkTheme.value ) {
    document.body.classList.add('dark')
    localStorage.setItem('theme','dark')
  } else {
    document.body.classList.remove('dark')
    localStorage.setItem('theme','light')
  }
});
</script>
<template>
  <div class="AppHeader">
    <div class="AppHeader-globalBar">
      <div class="AppHeader-globalBar-start" @click="goHome">
        <span class="title">Message-Board</span>
      </div>
      <div class="AppHeader-globalBar-end">
        <el-button :icon="Refresh" circle @click="refreshButton" class="refresh"/>
        <!-- 篩選 -->
        <el-button :icon="Filter" circle @click="dialogVisible = true" class="filter"/>
        <el-dialog
          v-model="dialogVisible"
          title="篩選"
          width="500"
          :before-close="handleClose"
        >
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
              <el-button type="primary" @click="dialogVisible = false">
                Confirm
              </el-button>
            </div>
          </template>
        </el-dialog>
        <el-button :icon="Top" circle @click="goTop" class="goTop"/>
        <!-- 切換暗色模式 -->
        <el-switch
          v-model="isDarkTheme"
          size="large"
          :active-action-icon="Moon"
          :inactive-action-icon="Sunny"
          class="themeSwitch"
        />
        <!-- 用戶頭像下拉選單：退出登陸 -->
        <el-dropdown>
          <el-avatar :src="user.avatar_url" :size="32" :icon="UserFilled" class="userAvatar" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout" :icon="Check">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.AppHeader {
  .AppHeader-globalBar {
    display: flex;
    padding: 16px 50px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: var(--color-background);
    border-bottom: 1px solid var(--color-border);

    .AppHeader-globalBar-start {
      flex: 1 1 auto;
      display: flex;
      align-items: center;

      .title {
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
        &:hover{
          cursor: pointer;
        }
      }
    }
    .AppHeader-globalBar-end {
      flex: 0 1 auto;
      display: flex;
      align-items: center;
      .refresh,.filter,.goTop {
        color: var(--color-text);
        background-color: var(--color-button);
        border: 1px solid var(--color-border);
        &:hover{
          background-color: var(--color-button-hover);
        }
        &:active{
          background-color: var(--color-button-active);
        }
      }
      .goTop {
        margin-left: 12px;
      }
      .themeSwitch {
        margin-left: 12px;
        --el-switch-on-color: var(--color-background-mute);
        // --el-switch-off-color: var(--color-background-mute);
        --el-switch-border-color: var(--color-switch-border);
      }
      .userAvatar {
        margin-left: 12px;
      }
    }
  }
}
</style>
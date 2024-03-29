<script setup>
// 引入路由
import { useRouter } from "vue-router";
// 引入 useUserStore
import { useUserStore } from '@/stores/userStore'
// 引入 useRefreshStore
import { useRefreshStore } from '@/stores/refreshStore'
import { onBeforeMount } from 'vue';
import { Refresh, Filter, Top, UserFilled } from "@element-plus/icons-vue";

const router = useRouter()
const user = useUserStore()
const refresh = useRefreshStore()

onBeforeMount(() => {
  user.apiGetInfo()
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
</script>
<template>
  <div class="AppHeader">
    <div class="AppHeader-globalBar">
      <div class="AppHeader-globalBar-start" @click="goHome">
        <span class="title">Message-Board</span>
      </div>
      <div class="AppHeader-globalBar-end">
        <el-button :icon="Refresh" circle @click="refreshButton" />
        <el-button :icon="Filter" circle />
        <el-button :icon="Top" circle @click="goTop" class="Top"/>
        <el-dropdown>
          <el-avatar :src="user.avatar_url" :size="32" :icon="UserFilled" />
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
    border-bottom: 1px solid #cdcdcd;

    .AppHeader-globalBar-start {
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      &:hover{
        cursor: pointer;
      }

      .title {
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
      }
    }
    .AppHeader-globalBar-end {
      flex: 0 1 auto;
      display: flex;
      align-items: center;

      .Top {
        margin-right: 12px;
      }
    }
  }
}
</style>
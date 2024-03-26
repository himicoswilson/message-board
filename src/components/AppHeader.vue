<script setup>
// 引入 useStore
import { useUserStore } from '../stores/userStore'

const user = useUserStore()

user.apiGetInfo()
</script>
<template>
  <div class="AppHeader">
    <div class="AppHeader-globalBar">
      <div class="AppHeader-globalBar-start">
        <span class="title">Message-Board</span>
      </div>
      <div class="AppHeader-globalBar-end">
        <!-- <font-awesome-icon :icon="['fas', 'bell']" />
        <font-awesome-icon :icon="['fas', 'circle-plus']" /> -->
        <img class="userAvatar" :src="user.avatar_url">
        <span class="username">{{ user.username }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.AppHeader {
  border-bottom: 1px solid #cdcdcd;
  
  .AppHeader-globalBar {
    display: flex;
    padding: 16px 50px;

    .AppHeader-globalBar-start {
      flex: 1 1 auto;
      display: flex;
      align-items: center;

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

      svg{
        font-size: 20px;
        margin-right: 20px;
      }
      .userAvatar {
        width: 32px;
        border-radius: 50%;
        margin-right: 5px;
      }
      .username {
        font-size: 14px;
        font-weight: 500;
        line-height: 21px;
      }
    }
  }
}
</style>
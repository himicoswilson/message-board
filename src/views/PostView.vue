<script setup>
import { watch } from 'vue'
// 引入 useRefreshStore
import { useRefreshStore } from '@/stores/refreshStore'

const refresh = useRefreshStore()

// refresh.cardsReady && refresh.asideReady都為true時 改變
watch(
  () => [refresh.cardsReady, refresh.asideReady],
  () => {
    if (refresh.cardsReady && refresh.asideReady) {
      refresh.switchLoading()
    }
  }
)
</script>

<template>
  <div class="App">
    <AppHeader />
    <div class="AppContainer">
      <div>
        <PostCard :key="refresh.flag" />
        <!-- <PostCmt :key="refresh.flag" /> -->
      </div>
      <PostAside :key="refresh.flag" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.AppContainer {
  padding: 0 50px;
  display: flex;
}
</style>
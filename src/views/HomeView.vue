<script setup>
// 引入 useRefreshStore
import { useRefreshStore } from '@/stores/refreshStore'

const refresh = useRefreshStore()

</script>

<template>
  <div class="App">
    <AppHeader />
    <div class="AppContainer">
      <AppCard :key="refresh.flag" />
      <AppAside />
    </div>
  </div>
</template>

<style lang="less" scoped>
.AppContainer {
  padding: 0 50px;
  display: flex;
}
</style>


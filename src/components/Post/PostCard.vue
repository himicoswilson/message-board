<script setup>
import { ref, reactive, onMounted } from 'vue'
// 引入 useUserStore
import { useUserStore } from '@/stores/userStore'
// 引入 usePostStore
import { usePostStore } from '@/stores/postStore'
// 引入 countStore
import { useCountStore } from '@/stores/countStore'
// 引入 refreshStore
import { useRefreshStore } from '@/stores/refreshStore'
import { useRoute } from 'vue-router'
// 引入 formatDate
import { formatDate } from '@/math/index.js'

const user = useUserStore()
const post = usePostStore()
const count = useCountStore()
const refresh = useRefreshStore()

const route = useRoute()

const id = route.params.id

onMounted(async () => {
  await post.apiGetPost(id).then(() => {
    refresh.cardsReady = true
  })
})
</script>
<template>
  <div>
    <p>{{ post.post.title }}</p>
  </div>
</template>

<style lang="less" scoped></style>

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
import { useRoute } from 'vue-router';

const user = useUserStore();
const post = usePostStore();
const count = useCountStore();
const refresh = useRefreshStore();

const route = useRoute();

const id = route.params.id;

onMounted(async() => {
  await post.apiGetPost(id).then(() => {
    refresh.asideReady = true;
  })
})

</script>
<template>
  <div class="postInfoContainer">
    <div class="postInfo">
      <div class="postInfoTitle">
        <div class="postInfoTitleText">{{ post.post.title }}</div>
      </div>
      <div class="postInfoContent">
        <div class="postInfoContentText">{{ 1 }}</div>
      </div>
      <div class="postInfoFooter">
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .postInfoContainer {
    flex: 1;
  }
</style>
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
// 引入 formatDate
import { formatDate } from '@/math/index.js'

const user = useUserStore();
const post = usePostStore();
const count = useCountStore();
const refresh = useRefreshStore();

const route = useRoute();

const id = route.params.id;

onMounted(async() => {
  await post.apiGetPost(id).then(() => {
    refresh.cardsReady = true;
  })
})

</script>
<template>
  <div class="postInfoContainerPlace" v-if="refresh.loading">

  </div>

  <el-timeline style="max-width: 600px" v-if="!refresh.loading">
    <el-timeline-item :timestamp="formatDate(post.post.created_at)" placement="top" hollow="true" type="primary">
      <el-card>
        <h4>Update Github template</h4>
        <p>Tom committed 2018/4/12 20:46</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="2018/4/3" placement="top">
      <el-card>
        <h4>Update Github template</h4>
        <p>Tom committed 2018/4/3 20:46</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="2018/4/2" placement="top">
      <el-card>
        <h4>Update Github template</h4>
        <p>Tom committed 2018/4/2 20:46</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<style lang="less" scoped>
.postInfoContainerPlace {
  flex: 3;
}
.postInfoContainer {
  flex: 3;
}
</style>
<script setup>
import { ref, reactive } from 'vue'
// 引入 useStore
import { usePostStore } from '@/stores/postStore'

const post = usePostStore();

const postForm = ref();
const formInline = reactive({
  title: '',
  content: ''
})

const rules = reactive({
  title: [
    { required: true, message: 'Please input title', trigger: 'change' },
  ],
  content: [
    { required: true, message: 'Please input content', trigger: 'change' },
  ],
})

const submitPost = (async () => {
  await postForm.value.validate();
  await post.apiPostMsg(formInline.title, formInline.content).then(() => {
    post.apiGetPost()
    // eslint-disable-next-line no-undef
    ElNotification({
      message: 'post successfully! ',
      type: 'success',
      position: 'bottom-right',
    })
  })
  .catch((error) => {
    // eslint-disable-next-line no-undef
    ElNotification({
      message: `${error}`,
      type: 'error',
      position: 'bottom-right',
    });
  });
  formInline.title = '';
  formInline.content = '';
})

const submitClear = (() => {
  formInline.title = '';
  formInline.content = '';
})
</script>
<template>
  <div class="aside">
    <div class="postMessage">
      <span class="postTitle">POST MESSAGE</span>
      <el-form :model="formInline" :rules="rules" ref="postForm">
        <el-form-item prop="title">
          <el-input v-model="formInline.title"  placeholder="Title..." />
        </el-form-item>
        <el-form-item prop="content">
          <el-input v-model="formInline.content"  type="textarea" placeholder="Content..." />
        </el-form-item>
        <div class="postButtons">
          <el-form-item>
          <el-button type="danger" @click="submitClear" class="clearButton">Clear</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitPost">Submit</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.aside {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 30px 0 0 50px;

  .postMessage {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 270px;
    padding: 10px 20px;
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    position: fixed;

    &:hover{
      box-shadow: var(--el-box-shadow-light);
    }

    .postTitle {
      margin: 10px 0 15px 0;
      font-size: 14px;
      font-weight: 700;
      line-height: 24px;
    }

    .postButtons {
      display: flex;
      justify-content: space-between;

      .clearButton {
        width: 75.58px;
      }
    }
  }
}
</style>
<script setup>
import { reactive } from 'vue'
const formInline = reactive({
  title: '',
  content: ''
})

// 引入 useStore
import { usePostStore } from '../stores/postStore'

const post = usePostStore()

function submitPost() {
  post.apiPostMsg(formInline.title, formInline.content)
}
</script>
<template>
  <div class="aside">
    <div class="postMessage">
      <span class="postTitle">POST MESSAGE</span>
      <el-form :model="formInline">
        <el-form-item required>
          <el-input v-model="formInline.title"  placeholder="Title..." />
        </el-form-item>
        <el-form-item required>
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
  margin: 30px 0 0 50px;

  .postMessage {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 20px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;

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
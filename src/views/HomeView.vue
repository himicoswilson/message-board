<script setup>
import AppHeader from '@/components/AppHeader.vue';
// 引入 useStore
import { useUserStore } from '../stores/userStore'

const user = useUserStore()
</script>

<template>
  <div class="App">
    <AppHeader />
    <div class="AppContainer">
      <div class="cards">
        <el-card v-for="o in 4" :key="o" class="card" shadow="hover">
          <div class="cardBody">
            <div>
              <span class="title">Title</span>
              <span class="time">Time</span>
              <p>This is Message-Board Content.</p>
            </div>
            <div class="userData">
              <img class="userAvatar" :src="user.avatar_url">
              <span class="username">{{ user.username }}</span>
            </div>
          </div>
        </el-card>
      </div>
      <div class="aside">
        <div class="postMessage">
          <span class="postTitle">POST MESSAGE</span>
          <el-form :model="form">
            <el-form-item required>
              <el-input  placeholder="Title..." />
            </el-form-item>
            <el-form-item required>
              <el-input  type="textarea" placeholder="Content..." />
            </el-form-item>
            <div class="postButtons">
              <el-form-item>
              <el-button type="danger" @click="onSubmit" class="clearButton">Clear</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">Submit</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.AppContainer {
  padding: 0 50px;
  display: flex;
}
.cards {
  flex: 3;
  display: flex;
  flex-wrap: wrap;
  border-right: 1px solid #cdcdcd;
  padding: 20px 0  20px 0;
  
  .card {
    margin: 10px;
    width: 248px;
    height: 160px;
    .cardBody {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .title {
      font-size: 16px;
      font-weight: 600;
      }
      .time {
        margin-left: 10px;
        font-size: 14px;
        color: #a8a8a7;
      }
      p {
        margin-top: 10px;
        font-size: 14px;
        text-indent:1em;
      }
      .userData {
        display: flex;
        align-items: center;
        margin-top: 20px;
        
        .userAvatar {
          width: 22px;
          border-radius: 50%;
          margin-right: 5px;
        }
      }
    }
  }
}

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


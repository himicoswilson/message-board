<script setup>
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <div class="App">
    <AppHeader />
    <div class="AppContainer">
      <div class="cards">
        <el-card class="card" shadow="hover">
          <template #header>Yummy hamburger</template>
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            style="width: 100%"
          />
        </el-card>
        <el-card class="card" shadow="hover">
          <template #header>Yummy hamburger</template>
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            style="width: 100%"
          />
        </el-card>
        <el-card class="card" shadow="hover">
          <template #header>Yummy hamburger</template>
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            style="width: 100%"
          />
        </el-card>
        <el-card class="card" shadow="hover">
          <template #header>Yummy hamburger</template>
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            style="width: 100%"
          />
        </el-card>
        <el-card class="card" shadow="hover">
          <template #header>Yummy hamburger</template>
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            style="width: 100%"
          />
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

<style >
.AppContainer {
  padding: 0 50px;
  display: flex;
}
.cards {
  flex: 4;
  display: flex;
  flex-wrap: wrap;
  border-right: 1px solid #cdcdcd;
  padding: 20px 0;
}
.card {
  margin: 10px;

  img {
    border-radius: 10px;
  }
}
.aside {
  flex: 1;
  margin: 30px 0 0 30px;

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


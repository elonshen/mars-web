<template>
  <el-container>
    <el-aside width="200px">
      <el-menu :router=true :default-openeds="['1']">
        <el-menu-item index="/"><i class="el-icon-message"></i>首页</el-menu-item>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-message"></i>其他</template>
          <el-menu-item index="/about">About</el-menu-item>
          <el-menu-item index="/">选项1</el-menu-item>
        </el-submenu>
      </el-menu>
      <el-button @click="logout">登出</el-button>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "Layout",
  methods: {
    logout() {
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;

  .el-aside {
    text-align: center;
    border-right: groove 0.5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .el-menu {
      border-right: none;
    }

    .el-button {
      border: none;
      margin-bottom: 15px
    }
  }

  .el-main {
    text-align: center;
  }
}
</style>

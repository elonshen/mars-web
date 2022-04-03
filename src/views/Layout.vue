<template>
  <el-container>
    <el-aside style="width: 201px">
      <el-menu :default-openeds=openeds :router=true>
        <el-menu-item v-if="user.role === 'admin'" index="/user">用户管理</el-menu-item>
      </el-menu>
      <el-popover v-model="visible" placement="top">
        <el-button style="width: 100%;border-width: 0" @click="logout">登出</el-button>
        <el-button slot="reference">{{ user.name }}</el-button>
      </el-popover>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Layout",
  data() {
    return {
      openeds: ['/'],
      user: {
        id: undefined,
        name: '',
        username: '',
        role: null
      },
      visible: false
    }
  },
  mounted() {
    this.getCurrentUserInfo();
  },
  methods: {
    logout() {
      this.$cookies.remove('token')
      this.$router.push({
        path: '/login'
      })
    },
    getCurrentUserInfo() {
      axios.get("/users/current").then((res) => {
        this.user = res.data;
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
      margin-bottom: 15px;
      width: 100%;
    }
  }
}
</style>

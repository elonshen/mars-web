<template>
  <div class="main">
    <h1>Demo</h1>
    <el-input v-model="loginInfo.username" placeholder="账号" type="text"></el-input>
    <el-input style="margin-top: 10px" type="password" placeholder="密码" v-model="loginInfo.password"></el-input>
    <el-button style="margin-top: 10px;align-self: flex-end" plain round @click.native="Login">登入</el-button>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'Login',
  data() {
    return {
      loginInfo: {
        username: "",
        password: "",
      }
    }
  },
  methods: {
    // 数据校验
    valiData() {
      let loginInfo = this.loginInfo;
      if (!loginInfo.username) {
        this.$message({
          type: 'info',
          message: "登录账号不能为空"
        })
        return false;
      }
      if (!loginInfo.password) {
        this.$message({
          type: 'info',
          message: '登录密码不能为空'
        })
        return false;
      }
      return true;
    },
    Login() {
      console.log(this.$router.query);
      let isOk = this.valiData();
      if (!isOk) {
        return false;
      }
      axios.post('/authentication', this.loginInfo).then((response) => {
        this.$cookies.set('token', response.data);
        this.$router.push({
          path: '/'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  padding: 10% 40%;
}
</style>

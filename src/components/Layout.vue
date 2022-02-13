<template>
  <el-container>
    <el-container>
      <el-aside width="200px">
        <el-menu :default-openeds="['1']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>导航一</template>
            <el-menu-item index="1-1"><router-link to="/">Home</router-link></el-menu-item>
            <el-menu-item index="1-2"><router-link to="/about">About</router-link></el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>导航二</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view/></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Layout"
}
</script>

<style scoped>
.el-aside {
  color: #333;
  text-align: center;
  line-height: 200px;
}
.el-main {
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>

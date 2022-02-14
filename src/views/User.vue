<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.name" class="filter-item" clearable placeholder="姓名" style="width: 200px;"
                @clear="() => { listQuery.name=undefined } " @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">新增</el-button>
    </div>
    <el-table :data="list" style="width: 100%">
      <el-table-column label="姓名" prop="name"/>
      <el-table-column label="用户名" prop="username"/>
      <el-table-column label="角色" prop="roles">
        <template slot-scope="{row}">
          <span v-for="role of row.roles" :key="role.id">
            {{ role.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="142">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">修改</el-button>
          <el-button v-if="row.id !== 1" size="mini" type="primary" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :limit.sync="listQuery.size" :page.sync='listQuery.page' :total="total"
                @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password"/>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="temp.roles" multiple placeholder="请选择">
            <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import axios from "axios"

export default {
  name: 'User',
  components: {Pagination},
  data() {
    return {
      listQuery: {
        page: 1,
        size: 10,
        name: undefined
      },
      total: 0,
      listLoading: true,
      list: null,
      temp: {
        id: undefined,
        name: '',
        username: '',
        roles: []
      },
      dialogStatus: null,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      rules: {
        name: [{required: true, message: '姓名是必要的', trigger: 'blur'}],
        username: [{required: true, message: '用户名是必要的', trigger: 'blur'}],
        password: [{required: true, message: '密码是必要的', trigger: 'blur'}]
      },
      roles: null
    }
  },
  mounted() {
    this.getList()
    this.getRoles()
  },
  methods: {
    getList() {
      this.listLoading = true
      const tempData = Object.assign({}, this.listQuery)
      tempData.page--
      axios.get('/users', {params: tempData}).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      })
    },
    getRoles() {
      axios.get('/roles').then(response => {
        this.roles = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.rules.password[0].required = true
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        username: '',
        roles: []
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          axios.post('/users', tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.rules.password[0].required = false
      const temp = Object.assign({}, row) // copy obj
      const roleIds = []
      for (const role of temp.roles) {
        roleIds.push(role.id)
      }
      temp.roles = roleIds
      this.temp = temp
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          axios.put('/users', tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList();
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/users/' + row.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.list.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>

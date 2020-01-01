<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-bottom: 10px;" class="filter-item" placeholder="请输入搜索的手机号码" v-model="listQuery.phone">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-bottom: 10px;" class="filter-item" placeholder="请输入搜索的用户账号" v-model="listQuery.username">
      </el-input>
      <el-select v-model="listQuery.roleId" placeholder="请选择" style="margin-bottom: 10px;">
        <el-option
          v-for="item in rolelist1"
          :key="item.roleId"
          :label="item.label"
          :value="item.roleId">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <!-- <el-table-column align="center" label="用户ID" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="用户账号" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="用户角色">
        <template slot-scope="scope">
          <span v-for='item in scope.row.roleList' :key="item.id">{{item.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="角色描述">
        <template slot-scope="scope">
          <span v-for='item in scope.row.roleList' :key="item.id">{{item.roleDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" label="用户类型">
        <template slot-scope="scope">
          <span v-if="scope.row.userFlag == 0">普通用户</span>
          <span v-if="scope.row.userFlag == 1">管理员</span>
          <span v-if="scope.row.userFlag == 2">销售员</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="用户状态" width="150" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.delFlag | statusFilter" v-if='scope.row.delFlag==0'>正常</el-tag>
          <el-tag :type="scope.row.delFlag | statusFilter" v-if='scope.row.delFlag==1'>删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,scope.row.userId)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="margin-top: 30px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :xs="20" :sm="20" :md="16" :lg="12">
          <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='margin-left:8%;'>
            <el-form-item label="用户账号" prop="username" v-if="dialogStatus=='create'">
              <el-input type="text" placeholder="" v-model="temp.username">
              </el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="password" v-if="dialogStatus=='create'">
              <el-input type="text" placeholder="" v-model="temp.password">
              </el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="newPassword" v-if="dialogStatus=='update'">
              <el-input type="text" placeholder="" v-model="temp.newPassword">
              </el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input type="age" v-model.number="temp.phone" placeholder="" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户姓名" prop="nickName">
              <el-input type="text" placeholder="" v-model="temp.nickName">
              </el-input>
            </el-form-item>
            <el-form-item label="用户角色" prop="roleName" v-if="dialogStatus=='create'">
              <el-select style="width: 200px" class="filter-item" v-model="temp.roleName">
                <el-option v-for="item in roleAll" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户角色" v-for='item in temp.roleList' :key="item.id">
              <el-select style="width: 200px" class="filter-item" v-model="item.roleName">
                <el-option v-for="item in roleAll" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户类型" prop="userFlag" >
            <el-select style="width: 200px" class="filter-item" v-model="temp.userFlag">
                <el-option v-for="item in userFlags" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{tableKey}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userList, fetchPv, createArticle, updateUser, delUser, userUpdate } from '@/api/user'
import { roleList } from '@/api/role'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    var checkNull = (rule, value, callback) => {
      value = value.toString()
      if (value.indexOf(" ")!=-1) {
        callback(new Error('不能填入空字符串'));
      }else{
        callback();
      }
    }
    var checkphone = (rule, value, callback) => {
      value = value.toString()
      function isNumber(val) {
        var regPos = /^1[1-9][0-9]\d{8}$/;
        if(regPos.test(value)) {
          return true;
        } else {
          return false;
        }
      }
      if (!isNumber(value)) {
        callback(new Error('请输入正确11位手机号'));
      } else {
        callback();
      }
    }
    var checkNickName = (rule, value, callback) => {
      value = value.toString()
      function isNickName(val) {
        var regPos = /^[\u4E00-\u9FA5A-Za-z]{2,8}$/;
        if(regPos.test(value)) {
          return true;
        } else {
          return false;
        }
      }
      if (!isNickName(value)) {
        callback(new Error('请输入4到16个字符的姓名'));
      } else {
        callback();
      }
    }
    var checkUsername = (rule, value, callback) => {
      value = value.toString()
      function isName(val) {
        var regPos = /^[a-zA-Z0-9_]{4,16}$/;
        if(regPos.test(value)) {
          return true;
        } else {
          return false;
        }
      }
      if (!isName(value)) {
        callback(new Error('请输入4到16个字符的数字、字母或下划线'));
      } else {
        callback();
      }
    }
    var checkPassword = (rule, value, callback) => {
      value = value.toString()
      function isPassword(val) {
        var regPos = /^[0-9a-zA-Z!@#$^]{6,12}$/;
        if(regPos.test(value)) {
          return true;
        } else {
          return false;
        }
      }
      if (!isPassword(value)) {
        callback(new Error('请输入6到12个字符的数字、字母或字符'));
      } else {
        callback();
      }
    }
    var checkUsername = (rule, value, callback) => {
      value = value.toString()
      function isName(val) {
        var regPos = /^[a-zA-Z0-9_]{4,16}$/;
        if(regPos.test(value)) {
          return true;
        } else {
          return false;
        }
      }
      if (!isName(value)) {
        callback(new Error('请输入4到16个字符的数字、字母或下划线'));
      } else {
        callback();
      }
    }
    return {
      isSearch: false,
      roleAll: [],
      rules: {
        nickName: [
          { required: true, message: '用户姓名为必填', trigger: 'blur' },
          { validator: checkNickName, trigger: 'blur' },
          { validator: checkNull, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '用户账号为必填', trigger: 'blur' },
          { validator: checkUsername, trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' },
          { validator: checkNull, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '登录密码为必填', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
          { validator: checkNull, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号码为必填', trigger: 'blur' },
          { validator: checkNull, trigger: 'blur' },
          { validator: checkphone, trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        newPassword: [
          { required: true, message: '用户密码为必填', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        userFlag: [
          { required: true, message: '用户类型为必填', trigger: 'blur' },
        ]
      },
      rolelist1: [{
        roleId: undefined,
        label: "全部"
      }, {
        roleId: 1,
        label: "系统管理员"
      },{
        roleId: 290,
        label: "销售员"
      }, {
        roleId: 291,
        label: "运营员"
      }],
      roleName: null,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        userId: undefined,
        phone: undefined,
        username: undefined,
        roleId: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published',
        roleId: '',
        newPassword: ''
      },
      userFlags: [{
        value: '1',
        label: '管理员'
      },
      {
        value: '0',
        label: '普通用户'
      },{
          value: '2',
          label: '销售员'
        }],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户信息',
        create: '新增用户'
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // 用户列表
      userList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
      // 角色列表
      roleList(this.listQuery).then(response => {
        this.roleAll = response.data.records
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.limit = 10
      this.getList()
      this.isSearch = true
      // userList(this.listQuery).then(response => {
      //   console.log(JSON.stringify(response.data))
      //   this.list = response.data
      //   this.total = response.data.length
      //   this.listLoading = false
      //   // this.getList()
      // })
    },
    handleSizeChange(val) {
      if(!this.isSearch){
        this.listQuery.phone = undefined
        this.listQuery.username = undefined
        this.listQuery.roleId = undefined
      } 
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      if(!this.isSearch){
        this.listQuery.phone = undefined
        this.listQuery.username = undefined
        this.listQuery.roleId = undefined
      } 
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        delUser(id).then(response => {
          this.getList()
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.listLoading = false
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: '',
        newPassword: '',
        userFlag: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.temp.userFlag == '普通用户'){
            this.temp.userFlag = 0
          }else if(this.temp.userFlag == '管理员') {
            this.temp.userFlag = 1
          }
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          this.temp.roleId = this.temp.roleName
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.temp.newPassword = '******'
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
          tempData.timestamp = 0
          tempData.createTime = undefined
          if (this.temp.newPassword === '******') {
            tempData.password = ''
          }else{
            tempData.password = this.temp.newPassword
          }
          if (typeof this.temp.roleList[0].roleName === 'number') {
            tempData.roleList[0].roleId = this.temp.roleList[0].roleName
          }
          userUpdate(JSON.stringify(tempData)).then(() => {
            for (const v of this.list) {
              if (v.userId === this.temp.userId) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, tempData)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style>
@media screen and (max-width: 768px) {
  .app-container .el-dialog {
    width: 80%;
  }
  .el-button+.el-button {
    margin-left: 0px;
  }
}
</style>

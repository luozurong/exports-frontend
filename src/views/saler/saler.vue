<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-bottom: 10px;" class="filter-item" placeholder="请输入搜索的手机号码" v-model="listQuery.phone">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-bottom: 10px;" class="filter-item" placeholder="请输入搜索的用户姓名" v-model="listQuery.nickName">
      </el-input>
      <!-- <el-select v-model="listQuery.roleId" placeholder="请选择" style="margin-bottom: 10px;">
        <el-option v-for="item in rolelist1" :key="item.roleId" :label="item.label" :value="item.roleId"></el-option>
      </el-select> -->
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 0px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <!-- <el-table-column align="center" label="用户ID" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="销售员姓名">
        <template slot-scope="scope">
          <span>{{scope.row.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售员账号">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售药房" min-width="120px">
        <template slot-scope="scope" >
          <div class="hover"><span>{{scope.row.storeList | formatStore}}</span></div>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="账号状态" width="150">
        <template slot-scope="scope">
          <el-tag :type="scope.row.delFlag | statusFilter" v-if='scope.row.delFlag==0'>正常</el-tag>
          <el-tag :type="scope.row.delFlag | statusFilter" v-if='scope.row.delFlag==1'>删除</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column min-width="150px" align="center" label="责任药店">
        <template slot-scope="scope">
          <span >大参林、同仁堂药店</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
<!--          <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handlePermission(scope.row)">查看
          </el-button>-->
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
      <!-- 暂时关闭 -->
      <el-row>
        <el-col :xs="24" :sm="24" :md="10" :lg="10">
          <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="94px" style='margin-left:8%;'>
            <el-form-item label="销售员姓名" prop="nickName">
              <el-input type="text" placeholder="" v-model="temp.nickName">
              </el-input>
            </el-form-item>
            <el-form-item label="销售员账号" prop="username">
              <el-input type="text" placeholder="" v-model="temp.username">
              </el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="password" v-if="dialogStatus=='create'">
              <el-input type="password" placeholder="" v-model="temp.password">
              </el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input type="age" v-model.number="temp.phone" placeholder="" auto-complete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="责任药店" prop="drugStore">
              <el-select  v-model="drugStore" multiple placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
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
  import {createArticle, delUser, fetchPv, updateUser, userList} from '@/api/user'
  import {roleList} from '@/api/role'
  import waves from '@/directive/waves' // 水波纹指令
  import {parseTime} from '@/utils'

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
    };
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
    return {
      isSearch: false,
      rolelist1: [{
        roleId: 1,
        label: "系统管理员"
      }, {
        roleId: 290,
        label: "销售员"
      }, {
        roleId: 291,
        label: "运营员"
      }],
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
        roleId: 290,
        nickName: undefined
      },
      temp: {
        nickName: undefined
      },
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      temp: {
        roleId: 290,
        userFlag: 2
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户信息',
        create: '新增销售员'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        nickName: [
          { required: true, message: '销售员姓名为必填', trigger: 'blur' },
          { validator: checkNickName, trigger: 'blur' },
          { validator: checkNull, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '销售员账号为必填', trigger: 'blur' },
          { validator: checkUsername, trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' },
          { validator: checkNull, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '登录密码为必填', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' },
          { validator: checkNull, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号码为必填', trigger: 'blur' },
          { validator: checkNull, trigger: 'blur' },
          { validator: checkphone, trigger: 'blur' }
        ]
      },
      options: [{
        value: '选项1',
        label: '大参林'
      }, {
        value: '选项2',
        label: '同仁堂药店'
      }, {
        value: '选项3',
        label: '邦健医药'
      }, {
        value: '选项4',
        label: '开心大药房'
      }, {
        value: '选项5',
        label: '国药医药'
      }],
      drugStore: []
    }
  },
  filters: {
    formatStore: function (val) {
      if (val == null || val === '') {
        return val
      }
      var back = '';
      for (var i = 0; i < val.length; i++) {
        back = back + val[i].drugstoreName+','
      }
      return back
    },
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
      this.listQuery.roleId = 290
      // 用户列表
      userList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      this.isSearch = true
    },
    handleSizeChange(val) {
      if(!this.isSearch){
        this.listQuery.phone = undefined
        this.listQuery.nickName = undefined
      }
      this.listQuery.limit = val
      this.getList()

    },
    handleCurrentChange(val) {
      if(!this.isSearch){
        this.listQuery.phone = undefined
        this.listQuery.nickName = undefined
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
        type: ''
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
          if(!this.drugStore){
            this.$notify({
              title: '提示',
              message: '责任药店不能为空',
              type: 'warning',
              duration: 2000
            })
          }
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          this.temp.roleId = 290
          this.temp.userFlag = 2
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
      this.temp.userFlag = 0
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
          tempData.roleId = 290
          tempData.userFlag = 1
          tempData.password = undefined
          updateUser(JSON.stringify(tempData)).then(() => {
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
  }
}
</script>
<style>
@media screen and (max-width: 768px) {
  .app-container .el-dialog {
    width: 60%;
  }
}


.hover span {
  display: inline-block;
  width:100%;
  word-break: keep-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hover span:hover{
  overflow: visible;
  word-break: normal;
  white-space: normal;
  color: #66b1ff;
}
</style>


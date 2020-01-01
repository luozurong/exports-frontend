<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px; margin-bottom: 10px;" class="filter-item" placeholder="请输入搜索的角色名称" v-model="listQuery.roleName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column width="150px" align="center" label="角色ID">
        <template slot-scope="scope">
          <span>{{scope.row.roleId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="角色描述">
        <template slot-scope="scope">
          <span>{{scope.row.roleDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="角色编码">
        <template slot-scope="scope">
          <span>{{scope.row.roleCode}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="150px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="最后更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <!-- <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{tableKey}}
          </el-button> -->
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,scope.row.roleId)">删除
          </el-button>
          <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handlePermission(scope.row)">权限
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
        <el-col :xs="24" :sm="24" :md="12" :lg="12">
          <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='margin-left:50px;'>
            <el-form-item label="角色名称" prop="roleName">
              <el-input type="text" placeholder="Please input" v-model="temp.roleName">
              </el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input type="text" placeholder="Please input" v-model="temp.roleDesc">
              </el-input>
            </el-form-item>
            <el-form-item label="角色编码" prop="roleCode" v-if="dialogStatus=='create'">
              <el-input type="text" placeholder="Please input" v-model="temp.roleCode">
              </el-input>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPermissionVisible">
      <el-tree class="filter-tree" :data="treeData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current :props="defaultProps" show-checkbox ref="menuTree" :filter-node-method="filterNode" default-expand-all>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePermession(roleId, roleCode)">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { roleList, fetchPv, createArticle, updateArticle, delRole, fetchRoleTree, permissionUpd } from '@/api/role'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { fetchTree } from '@/api/menu'

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
    return {
      treeData: [],
      treeDeptData: [],
      checkedKeys: [],
      dialogPermissionVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        roleName: undefined,
        roleDesc: undefined,
        roleId: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: '按顺序排列', key: '+id' }, { label: '按倒序排列', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
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
      roleList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handlePermission(row) {
      fetchRoleTree(row.roleName)
        .then(response => {
          this.checkedKeys = []
          for (var i in response.data) {
            var id = response.data[i].menuId
            this.checkedKeys.push(id)
          }
          return fetchTree()
        })
        .then(response => {
          this.treeData = response.data
          this.dialogStatus = 'permission'
          this.dialogPermissionVisible = true
          this.roleId = row.roleId
          this.roleCode = row.roleCode
        })
    },
    updatePermession(roleId, roleCode) {
      permissionUpd(roleId, this.$refs.menuTree.getCheckedKeys()).then(() => {
        this.dialogPermissionVisible = false
        fetchTree()
          .then(response => {
            this.treeData = response.data
            return fetchRoleTree(roleCode)
          })
          .then(response => {
            this.checkedKeys = []
            for (var i in response.data) {
              var id = response.data[i].menuId
              this.checkedKeys.push(id)
            }
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
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
        delRole(id).then(response => {
          this.getList()
          // for (var i in this.list) {
          //   if (this.list[i].roleCode === row.roleCode) {
          //     this.list.splice(i, 1)
          //   }
          // }
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
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
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.roleCode === this.temp.roleCode) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
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
    width: 70%;
  }
  .el-button+.el-button {
      margin-left: 0px;
  }
}
</style>


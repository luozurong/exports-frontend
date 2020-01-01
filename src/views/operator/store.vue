<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-bottom: 10px;" class="filter-item" placeholder="请输入搜索的药店名称" v-model="listQuery.drugStoreName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" v-waves  icon="el-icon-edit" @click="handleCreate">新增</el-button>
      <!--<el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">导出表格</el-button>-->
      <el-upload
        class="upload-demo"
        :action="api"
        multiple
        :on-success="importSuccess"
        :on-error="importError">
        <el-button type="primary"><i class="el-icon-upload el-icon--right"></i> 导入</el-button>
      </el-upload>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-download" @click="downloadFile('http://jl-oss-test.oss-cn-qingdao.aliyuncs.com/2018090588902药店信息导入模板.xls')">
        下载导入模板
      </el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35" align="center">
      </el-table-column>
      <el-table-column label="药店名称" align="center">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.drugstoreName }}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="药店地址" align="center">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.drugStoreAddress }}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="所属药企" align="center">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.drugCompName }}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.linkman }}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="销售员" align="center">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.userName }}</span></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="cleanRelevance">
      <!-- 暂时关闭 -->
      <el-row>
        <el-col :xs="20" :sm="20" :md="8" :lg="8">
          <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='margin-left:50px;'>
            <el-form-item label="药店名称" prop="drugstoreName">
              <el-input :rules="rules" ref="dataForm" type="text" placeholder="Please input" v-model="temp.drugstoreName" style="width: 300px">
              </el-input>
            </el-form-item>
            <el-form-item label="药店地址" prop="drugStoreAddress">
              <el-input type="text" placeholder="Please input" v-model="temp.drugStoreAddress" style="width: 300px">
              </el-input>
            </el-form-item>
            <el-form-item label="所属药企" prop="drugCompName">
              <el-col>
                <el-select v-model="temp.drugCompName" :rules="rules" ref="dataForm" style="width: 300px">
                  <el-option
                    v-for="item in compList"
                    :key="item.drugCompName"
                    :label="item.drugCompName"
                    :value="item.drugCompName">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="负责人" prop="linkman">
              <el-input type="text" placeholder="Please input" v-model="temp.linkman" style="width: 300px">
              </el-input>
            </el-form-item>
            <el-form-item label="销售员" prop="userId">
              <el-col>
                <el-select clearable v-model="temp.userId" style="width: 300px">
                  <el-option
                    v-for="item in saleList"
                    :key="item.userId"
                    :label="item.nickName"
                    :value="item.userId">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">保存</el-button>
      </div>
    </el-dialog>

    <div class="pagination-container" style="margin-top: 30px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum " :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

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
import { getOrderDetailList, getDrugStoreList, getDrugList, updateOrderDetail,updateDrugStore,delDrugStore } from '@/api/drug'
import { userList } from '@/api/user'
import { companyList } from '@/api/saler'
import { roleList } from '@/api/role'
import waves from '@/directive/waves' // 水波纹指令
import { mapState } from "vuex";
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
    return {
      // 控制下拉搜索--start
      sTime:[],
      textMap: {
        update: '编辑药店信息',
        create: '新增'
      },
      temp:{

      },
      rules: {
        drugstoreName: [
          { required: true, message: '药店名称必填', trigger: 'blur' },
        ],
        drugCompName: [
          { required: true, message: '企业名称必选', trigger: 'blur' },
        ],
        userId: [
          { required: true, message: '销售员必选', trigger: 'blur' },
        ]
      },
      relevanceLoading: false,
      saleList: null,  //销售人员列表
      state1: '',
      storeList: [],  //药店列表
      compList: null,  //厂家列表
      userList: null,
      state2: '',
      userId:'',
      api: process.env.BASE_API+"/api/upload",
      salerId:undefined,
      drugstoreName: '',
      timeout:  null,
      // 控制下拉搜索--end
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        type: undefined,
        sort: '+id',
        userId: undefined,
        orderId: undefined,
        nickName: undefined,
        drugStoreName: undefined,
        drugName: undefined,
        drugBigType: undefined,
        drugMidType: undefined,
        salerId: undefined,
        salerName: undefined,
        commodityId: undefined,
        manufacturer: undefined,
        norms: undefined,
        price: undefined,
        count: undefined,
        countPrice: undefined,
        drugStoreAddress: undefined,
        sendTime: undefined,
        remark: undefined,
        odUpdateTime: undefined
      },
      ulistQuery: {
        page: 1,
        limit: 20,
        // roleId: 290,
        userFlag: 2,
        username: '',
      },
      clistQuery: {
        page: 1,
        limit: 50,
        name: '',
      },
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
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
    this.userL = []
    this.storeL = []
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    downloadFile(url){
      try{ 
          var elemIF = document.createElement("iframe");   
          elemIF.src = url;   
          elemIF.style.display = "none";   
          document.body.appendChild(elemIF);   
      }catch(e){ 

      }
    },
    importSuccess(){
      this.$notify({
        title: '提示',
        message: '上传成功',
        type: 'success',
        duration: 2000
      })
      this.listQuery.pageNum = 1
      this.getList()
    },
    importError(){
      this.$notify({
        title: '提示',
        message: '上传失败',
        type: 'error',
        duration: 2000
      })
    },
    // 控制下拉搜索--start
    querySearchAsync1(queryString, cb) {
      let query = new Map()
      query.nickName = queryString
      if (queryString === null | queryString === ''){
          this.listQuery.userId = '';
      }
      //分页获取用户名

      userList(query).then((response) => {
        let userL = response.data.records
        for (let i = 0; i < userL.length; i ++) {
          userL[i].value = userL[i].nickName
        }
        cb(userL)
      }).catch()
    },
    querySearchAsync2(queryString, cb) {
      let query = new Map()
      query.drugName = queryString
      if (queryString === null | queryString === ''){
         this.listQuery.drugStoreName = '';
      }
      getDrugStoreList(query).then((response) => {
        let storeL = response.data.records
        for(let i = 0; i < storeL.length; i++) {
          storeL[i].value = storeL[i].drugstoreName
        }
        cb(storeL)
      })
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect1(item) {
      this.listQuery.userId = item.userId
    },
    handleSelect2(item) {
      this.listQuery.drugStoreName = item.drugstoreName
    },
    handleIconClick(){},
    // 控制下拉搜索--end
    // 勾选--start
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 勾选--end
    getList() {
      this.listLoading = true
      getDrugStoreList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getSearch() {
      this.listLoading = true
      getDrugStoreList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getSearch()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum  = val
      this.getList()
    },
    handleModifyStatus(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
         delDrugStore(id).then(response => {
           this.$message({
             type: 'success',
             message: '删除成功!'
           })
           this.listQuery.page = 1
           this.getList()
         })
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
        count: 0,
        price: 0,
        countPrice: 0,
      }
    },
    handleCreate() {
      this.temp = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.searchRelevance('');
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.searchRelevance('');
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateDrugStore(JSON.stringify(tempData)).then(response => {
            this.dialogFormVisible = false
            this.listQuery.page = 1
            this.getList()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {})
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
        const tHeader = ['订单日期','订单编号', '销售人员', '药店名称', '药品', '药品大类','药品中类','药品编号','生产厂家','药品规格','商品单价','采购数量','采购小计','配送地址','配货到店日期','备注']
        const filterVal = ['odUpdateTime','orderId', 'nickName', 'drugstoreName', 'drugName', 'drugBigType','drugMidType','commodityId','manufacturer','norms','price','count','countPrice','drugStoreAddress','sendTime','remark']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '药品采购订单表'
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
    },
    // 搜索关联者id
    searchRelevance(date) {
      this.relevanceLoading = true
      this.ulistQuery.username = date
      userList(this.ulistQuery).then(response => {
        this.relevanceLoading = false
        this.saleList = response.data.records
      })
      companyList(this.clistQuery).then(response => {
        this.compList = response.data;
      })
    },
    // 清除下拉框内容
    cleanRelevance: function() {
      this.salerId = null
      this.dialogFormVisible = false
    }
  },
  watch: {
    sTime: function (val) {
      if (val !== undefined && val.length > 1) {
        this.listQuery.startTime = val[0]
        this.listQuery.endTime = val[1]
      }
    }
  }
}
</script>
<style>
@media screen and (max-width: 768px) {
  .app-container .el-dialog {
    width: 80%;
  }
}
.upload-demo {
  display: inline-block;
}
.el-upload-list.el-upload-list--text{
  display: none;
}

.hover span {
  display: inline-block;
  width:100%;
  line-height: 1.5;
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


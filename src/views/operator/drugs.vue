<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-bottom: 10px;" class="filter-item"
                placeholder="请输入搜索的药品名称" v-model="listQuery.drugName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" @click="handleCreate">新增</el-button>
      <el-upload
        class="upload-demo"
        :action="api"
        multiple
        :on-success="importSuccess"
        :on-error="importError">
        <el-button type="primary"><i class="el-icon-upload el-icon--right"></i> 导入</el-button>
      </el-upload>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-download" @click="downloadFile('https://jl-oss-test.oss-cn-qingdao.aliyuncs.com/2018090529201药品目录.xls')">
        下载导入模板
      </el-button>
      <!--<el-button type="primary" icon="el-icon-plus" @click="handleUpload" v-waves :loading="downloadLoading">导入表格</el-button>-->
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35">
      </el-table-column>
      <el-table-column label="药品编号" align="center">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.commodityid}}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="药品" align="center">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.drugName}}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="药品大类" align="center">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.drugBigType}}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="药品中类" align="center">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.drugMidType}}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="生产厂家" align="center">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.manufacturer}}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="药品规格" align="center">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.norms}}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="药品单价" align="center">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.price}}</span></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <!--<el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handlePermission(scope.row)">查看-->
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger"
                     @click="handleModifyStatus(scope.row,scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :xs="20" :sm="20" :md="20" :lg="14">
          <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px"
                   style='margin-left:50px;'>
            <el-form-item label="药品编号" prop="commodityid">
              <el-input type="text" placeholder="" v-model="temp.commodityid">
              </el-input>
            </el-form-item>
            <el-form-item label="药品名称" prop="drugName">
              <el-input type="text" placeholder="" v-model="temp.drugName">
              </el-input>
            </el-form-item>
            <el-form-item label="药品大类" prop="drugBigType">
              <el-input type="text" placeholder="" v-model="temp.drugBigType">
              </el-input>
            </el-form-item>
            <el-form-item label="药品中类" prop="drugMidType">
              <el-input type="text" placeholder="" v-model="temp.drugMidType">
              </el-input>
            </el-form-item>
            <el-form-item label="生产厂家" prop="manufacturer">
              <el-input type="text" placeholder="" v-model="temp.manufacturer">
              </el-input>
            </el-form-item>
            <el-form-item label="药品规格" prop="norms">
              <el-input type="text" placeholder="" v-model="temp.norms">
              </el-input>
            </el-form-item>
            <el-form-item label="药品单价" prop="price">
              <el-input-number type="number" precision="2" :step="0.1" v-model="temp.price">
              </el-input-number>
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
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.pageNum " :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"></el-table-column>
        <el-table-column prop="pv" label="Pv"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{tableKey}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {addDrug, delDrug, getDrugList, getDrugStoreList, getOrderDetailList} from '@/api/drug'
  import {roleList} from '@/api/role'
  import waves from '@/directive/waves' // 水波纹指令
  import {parseTime} from '@/utils'
  import {userList} from '@/api/user'


  export default {
    name: 'complexTable',
    directives: {
      waves
    },
    data() {
      return {
        // 控制下拉搜索--start
        sTime: [],
        textMap: {
          update: '编辑药品信息',
          create: '新增'
        },
        list: null,
        total: undefined,
        temp: {},
        userId: '',
        drugstoreName: '',
        tableKey: 0,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          userId: undefined,
          notNull: undefined
        },
        api: process.env.BASE_API + "/api/uploadDrug",
        showReviewer: false,
        dialogFormVisible: false,
        dialogStatus: '',
        dialogPvVisible: false,
        pvData: [],
        downloadLoading: false,
        rules: {
          drugName: [
            {required: true, message: '药品名称必填', trigger: 'blur'},
          ],
          // drugBigType: [
          //   {required: true, message: '药品大类必填', trigger: 'blur'},
          // ],
          // drugMidType: [
          //   {required: true, message: '药品中类必填', trigger: 'blur'},
          // ],
          manufacturer: [
            {required: true, message: '商家必填', trigger: 'blur'},
          ],
          norms: [
            {required: true, message: '规格必填', trigger: 'blur'},
          ],
          price: [
            {required: true, message: '价格必填', trigger: 'blur'},
          ],
        }
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
      downloadFile(url){
        try{ 
            var elemIF = document.createElement("iframe");   
            elemIF.src = url;   
            elemIF.style.display = "none";   
            document.body.appendChild(elemIF);   
        }catch(e){ 
 
        }
      },
      // 控制下拉搜索--start
      importSuccess() {
        this.getList()
        this.$notify({
          title: '提示',
          message: '上传成功',
          type: 'success',
          duration: 2000
        })
      },
      importError() {
        this.$notify({
          title: '提示',
          message: '上传失败',
          type: 'error',
          duration: 2000
        })
      },
      querySearchAsync1(queryString, cb) {
        let query = new Map()
        query.nickName = queryString
        if (queryString === null | queryString === '') {
          this.listQuery.userId = '';
        }
        //分页获取用户名

        userList(query).then((response) => {
          let userL = response.data.records
          for (let i = 0; i < userL.length; i++) {
            userL[i].value = userL[i].nickName
          }
          cb(userL)
        }).catch()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      querySearchAsync2(queryString, cb) {
        let query = new Map()
        query.drugName = queryString
        if (queryString === null | queryString === '') {
          this.listQuery.drugStoreName = '';
        }
        getDrugStoreList(query).then((response) => {
          let storeL = response.data.records
          for (let i = 0; i < storeL.length; i++) {
            storeL[i].value = storeL[i].drugstoreName
          }
          cb(storeL)
        }).catch()
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
      handleIconClick() {
      },
      // 控制下拉搜索--end
      getList() {
        this.listLoading = true

        getDrugList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {

        })
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getList()
      },
      handleModifyStatus(row, id) {
        this.$confirm('此操作将永久删除数据，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          delDrug(id).then(response => {
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.listQuery.page = 1
            this.getList()
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        })
      },
      resetTemp() {
        this.temp = {
          count: 0,
          price: 0,
          countPrice: 0
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
            tempData.countPrice = tempData.count * tempData.price
            addDrug(JSON.stringify(tempData)).then(response => {
              this.getList()
              console.log(response)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })

            }).catch(() => {
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
          const tHeader = ['订单日期', '订单编号', '销售人员', '药店名称', '药品', '药品大类', '药品中类', '药品编号', '生产厂家', '药品规格', '商品单价', '采购数量', '采购小计', '配送地址', '配货到店日期', '备注']
          const filterVal = ['odUpdateTime', 'orderId', 'nickName', 'drugstoreName', 'drugName', 'drugBigType', 'drugMidType', 'commodityId', 'manufacturer', 'norms', 'price', 'count', 'countPrice', 'drugStoreAddress', 'sendTime', 'remark']
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

  .el-upload-list.el-upload-list--text {
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


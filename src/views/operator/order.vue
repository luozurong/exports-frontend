<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <div class="block" style="display:inline-block; margin-bottom: 10px;">
        <!-- <el-date-picker
          v-model="sTime"
          type="datetimerange"
          :picker-options="pickerOptions2"
          range-separator="至"
          start-placeholder="起始订单日期"
          end-placeholder="截止订单日期"
          :default-time="['00:00:00', '23:59:59']">
          align="right">
        </el-date-picker> -->
        <el-date-picker
          v-model="startTime"
          type="datetime"
          placeholder="起始订单日期"
          default-time="00:00:00">
        </el-date-picker>
      </div>
      <div class="block" style="display:inline-block; margin-bottom: 10px;">
        <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="截止订单日期"
          default-time="23:59:59">
        </el-date-picker>
      </div>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-bottom: 10px;" class="filter-item" placeholder="请输入搜索的订单编号" v-model="listQuery.orderId">
      </el-input>
      <el-autocomplete v-model="userId" :fetch-suggestions="querySearchAsync1" placeholder="请输入销售人员姓名" @select="handleSelect1" style="margin-bottom: 10px;">
        <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="handleIconClick"></i>
      </el-autocomplete>
      <el-autocomplete v-model="drugstoreName" :fetch-suggestions="querySearchAsync2" placeholder="请输入药店名称" @select="handleSelect2" style="margin-bottom: 10px;">
        <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="handleIconClick"></i>
      </el-autocomplete>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-bottom: 10px;" class="filter-item" placeholder="请输入搜索的药品名" v-model="listQuery.drugName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload" style="margin-lefe: 0px;">导出表格</el-button>
      <el-button type="primary" @click="handleUpdate">编辑</el-button>
      <!-- <el-button type="danger" @click="handleDelOrder">删除</el-button> -->
    </div>
    <!-- 金额统计 -->
    <div class="count">合计：￥<span>{{count}}</span> 元</div>
    
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35">
      </el-table-column>
      <el-table-column align="center" label="订单日期" width="105">
        <template slot-scope="scope">
          <span>{{scope.row.odUpdateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单编号" max-width="105">
        <template slot-scope="scope">
          <span>{{scope.row.orderId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售人员" width="55px">
        <template slot-scope="scope">
          <span>{{scope.row.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="药店名称" min-width="120px">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.drugstoreName}}</span></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="药品" min-width="120px">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.drugName}}</span></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="药品大类">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.drugBigType}}</span></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="药品中类">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.drugMidType}}</span></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="药品编号">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.commodityId}}</span></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="生产厂家" min-width="120px">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.manufacturer}}</span></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="药品规格" width="75px">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.norms}}</span></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品单价" width="55px">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="采购数量"  width="55px">
        <template slot-scope="scope">
          <span>{{scope.row.count}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="采购小计"  width="55px">
        <template slot-scope="scope">
          <span>{{scope.row.countPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="配送地址" min-width="120px">
        <template slot-scope="scope">
          <div class="hover"><span>{{scope.row.drugStoreAddress}}</span></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="配货到店日期" width="75px">
        <template slot-scope="scope">
          <span>{{scope.row.sendTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" width="60px">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作" width="140" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,scope.row.orderDetailId)">删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <!-- 暂时关闭 -->
      <el-row>
        <el-col :xs="20" :sm="20" :md="12" :lg="12">
          <el-form ref="dataForm" :model="temp" label-position="left" label-width="80px" style='margin-left:8%;'>
            <el-form-item label="药品数量">
              <el-input-number :max="1000000000" placeholder="" v-model="temp.count">
              </el-input-number>
            </el-form-item>
            <el-form-item label="药品单价" prop="price">
              <el-input :disabled="true" type="text" placeholder="" v-model="temp.price">
              </el-input>
            </el-form-item>
            <el-form-item label="药品总价">
              <el-input :disabled="true" type="text" placeholder="" v-model="temp.count * temp.price">
              </el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="temp.remark" :max="200"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>

    <div class="pagination-container" style="margin-top: 30px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
import { getOrderDetailList, getDrugStoreList, getDrugList, updateOrderDetail, delOrder, statistics} from '@/api/drug'
import { roleList } from '@/api/role'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { userList } from '@/api/user'
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
      isSearch: false,
      checkList:[],
      // 控制下拉搜索--start
      sTime:'',
      startTime: '',
      endTime: '',
      textMap: {
        update: '编辑药品数量信息',
        create: '新增'
      },
      temp:{

      },
      saleList: [],  //销售人员列表
      state1: '',
      storeList: [],  //药店列表
      state2: '',
      userId:'',
      drugstoreName: '',
      timeout:  null,
      // 控制下拉搜索--end
      //控制日期--start
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },

      //控制日期--end
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        type: undefined,
        sort: '+id',
        userId: undefined,
        orderId: undefined,
        nickName: undefined,
        drugstoreName: undefined,
        drugName: undefined,
        drugBigType: undefined,
        drugMidType: undefined,
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
      count: 0,
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
    this.statistics()
  },
  methods: {
    // 控制下拉搜索--start
    querySearchAsync1(queryString, cb) {
      let query = new Map()
      query.page =  this.listQuery.page
      query.limit = this.listQuery.limit
      query.userFlag = 2
      if(queryString){
        query.nickName = queryString
      }
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
      query.drugStoreName = queryString
      this.drugStoreName = queryString
      if (queryString === null | queryString === ''){
         this.listQuery.drugStoreName = '';
      }
      getDrugStoreList(query).then((response) => {
        let storeL = response.data.records
        for(let i = 0; i < storeL.length; i++) {
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
    handleIconClick(){},
    // 控制下拉搜索--end
    // 勾选--start
    handleSelectionChange(val) {
      this.checkList = val;
    },
    statistics() {
      statistics(this.listQuery).then(response => {
         console.log(response)
         this.count = response.data
      })
    },
    // 勾选--end
    getList() {
      this.listLoading = true

      getOrderDetailList(this.listQuery).then(response => {
        for(var i in response.data.records){
          if(response.data.records[i].sendTime ){
            response.data.records[i].sendTime = response.data.records[i].sendTime.slice(0,10)
          }
          if(response.data.records[i].odUpdateTime){
            response.data.records[i].odUpdateTime = response.data.records[i].odUpdateTime.slice(0,16)
          }
        }
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },

    handleFilter() {
      if(this.startTime && this.endTime){
        let startTimeArr = Date.parse(new Date(Date.parse((this.listQuery.startTime+'').replace(/-/g, "/"))));
        let endTimeArr = Date.parse(new Date(Date.parse((this.listQuery.endTime+'').replace(/-/g, "/"))));
        if(endTimeArr - startTimeArr < 0){
          this.$message({
            message: '截止时间要在起始时间之后',
            type: 'error'
          });
          return
        }
      }else if(!this.startTime && this.endTime || this.startTime && !this.endTime){
        this.$message({
          message: '日期筛选，截止时间和起始时间不能为空',
          type: 'error'
        });
        return
      }
      this.listQuery.page = 1
      this.listQuery.limit = 10
      if(this.drugStoreName){
        this.listQuery.drugStoreName = this.drugStoreName
      }
      this.getList()
      this.statistics()
      this.isSearch = true
    },
    handleSizeChange(val) {
      if(!this.isSearch){
        this.sTime = ''
        this.listQuery.startTime = undefined
        this.listQuery.endTime = undefined
        this.listQuery.orderId = undefined
        this.listQuery.userId = undefined
        this.listQuery.drugStoreName = undefined
        this.listQuery.drugName = undefined
      }
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      if(!this.isSearch){
        this.sTime = ''
        this.listQuery.startTime = undefined
        this.listQuery.endTime = undefined
        this.listQuery.orderId = undefined
        this.listQuery.userId = undefined
        this.listQuery.drugStoreName = undefined
        this.listQuery.drugName = undefined
      }
      this.listQuery.page = val
      this.getList()
    },
    handleDelOrder(){
      if(this.checkList.length == 1){
        var tempCheckList = this.checkList[0];
        var id = tempCheckList.orderDetailId ;
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          delOrder(id).then(response => {
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
      }else{
        this.$notify({
          title: '提示',
          message: '只支持单条数据删除',
          type: 'warning',
          duration: 2000
        })
      }
    },
    handleModifyStatus(row, id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        delOrder(id).then(response => {
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
        count: 0,
        price: 0,
        countPrice: 0,
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
    handleUpdate() {
      if(this.checkList.length == 1){
        this.temp = Object.assign({}, this.checkList[0]) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }else{
        this.$notify({
          title: '提示',
          message: '只支持单条数据编辑',
          type: 'warning',
          duration: 2000
        })
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        var regPos = /^([0-9][0-9]*)$/;
        if(!regPos.test(this.temp.count)) {
          this.$notify({
            title: '提示',
            message: '请输入整数',
            type: 'warning',
            duration: 2000
          })
          return true;
        }
        if(this.temp.remark){
          if(this.temp.remark.length>200){
            this.$notify({
              title: '提示',
              message: '备注内容不能超过200字',
              type: 'warning',
              duration: 2000
            })
            return
          }
        }
        const tempData = Object.assign({}, this.temp)
        tempData.countPrice = tempData.count * tempData.price
        updateOrderDetail(JSON.stringify(tempData)).then(response => {

        for (const v of this.list) {
              if (v.orderDetailId === this.temp.orderDetailId) {
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

      }).catch(() => {})

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
        // const data = this.formatJson(filterVal, this.list)
        var data = []
        if(this.checkList == 0){
          this.$confirm('此操作将导出表格的所有数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.listLoading = true
            this.listQuery.limit = 10000000
            getOrderDetailList(this.listQuery).then(response => {
              for(var i in response.data.records){
                if(response.data.records[i].sendTime ){
                  response.data.records[i].sendTime = response.data.records[i].sendTime.slice(0,19)
                }
                if(response.data.records[i].odUpdateTime){
                  response.data.records[i].odUpdateTime = response.data.records[i].odUpdateTime.slice(0,19)
                }
              }
              data = this.formatJson(filterVal, response.data.records)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '药品采购订单表'
              })
              this.downloadLoading = false
            })
            this.$message({
              type: 'success',
              message: '导出成功!'
            })
            this.listLoading = false
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消导出'
            })
            this.downloadLoading = false
          })
        }else{
          data = this.formatJson(filterVal, this.checkList) //所勾选
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '药品采购订单表'
          })
          this.downloadLoading = false
        }
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
    startTime: function (val) {
      if (val) {
        var sTime = setTimeStamp(val);
        function setTimeStamp(time) {
          //设置当前时间
          var date = new Date(time);
          var month = date.getMonth() + 1; //月
          var strDate = date.getDate(); //日
          var strHours = date.getHours(); //时
          var strMinutes = date.getMinutes(); //分
          var strSeconds = date.getSeconds(); //秒
          if (month >= 1 && month <= 9) {
              month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
          }
          if (strHours >= 0 && strHours <= 9) {
              strHours = "0" + strHours;
          }
          if (strMinutes >= 0 && strMinutes <= 9) {
              strMinutes = "0" + strMinutes;
          }
          if (strSeconds >= 0 && strSeconds <= 9) {
              strSeconds = "0" + strSeconds;
          }
          var currentdate = date.getFullYear()+ '-'  + month + '-' + strDate+ ' ' +  strHours + ':' + strMinutes+ ':' + strSeconds;
          return currentdate
        }
        this.listQuery.startTime = sTime
        if(this.endTime){
          let startTimeArr = Date.parse(new Date(Date.parse((this.listQuery.startTime+'').replace(/-/g, "/"))));
          let endTimeArr = Date.parse(new Date(Date.parse((this.listQuery.endTime+'').replace(/-/g, "/"))));
          if(endTimeArr - startTimeArr < 0){
            this.$message({
              message: '截止时间要在起始时间之后',
              type: 'error'
            });
          }
        }
      }else{
        this.listQuery.startTime = undefined
      }
    },
    endTime: function (val) {
      if (val) {
        var sTime = setTimeStamp(val);
        function setTimeStamp(time) {
          //设置当前时间
          var date = new Date(time);
          var month = date.getMonth() + 1; //月
          var strDate = date.getDate(); //日
          var strHours = date.getHours(); //时
          var strMinutes = date.getMinutes(); //分
          var strSeconds = date.getSeconds(); //秒
          if (month >= 1 && month <= 9) {
              month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
          }
          if (strHours >= 0 && strHours <= 9) {
              strHours = "0" + strHours;
          }
          if (strMinutes >= 0 && strMinutes <= 9) {
              strMinutes = "0" + strMinutes;
          }
          if (strSeconds >= 0 && strSeconds <= 9) {
              strSeconds = "0" + strSeconds;
          }
          var currentdate = date.getFullYear()+ '-'  + month + '-' + strDate+ ' ' +  strHours + ':' + strMinutes+ ':' + strSeconds;
          return currentdate
        }
        this.listQuery.endTime = sTime
        if(this.startTime){
          let startTimeArr = Date.parse(new Date(Date.parse((this.listQuery.startTime+'').replace(/-/g, "/"))));
          let endTimeArr = Date.parse(new Date(Date.parse((this.listQuery.endTime+'').replace(/-/g, "/"))));
          if(endTimeArr - startTimeArr < 0){
            this.$message({
              message: '截止时间要在起始时间之后',
              type: 'error'
            });
          }
        }
      }else{
        this.listQuery.endTime = undefined
      }
    }
  }
}
</script>
<style>
.app-container .el-date-editor .el-range-separator {
    width: 7%;
}
.el-button+.el-button {
    margin-left: 10px;
}
@media screen and (max-width: 768px) {
  .app-container .el-dialog {
    width: 60%;
  }
  .el-button+.el-button {
      margin-left: 0px;
  }
}
.el-button+.el-button {
    margin-left: 0px;
}
.el-table {
    font-size: 12px;
    color: #666;
}
.el-table .cell {
  padding: 0 1px;
}
.el-table td {
  padding: 2px 0;
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
/* 金额统计 */
.count {
  padding: 10px 0;
  text-align: center;
  font-size: 14px;
  color: #ff6826;
}
.count span {
  font-size: 24px;
  color: #ff6826;  
}
</style>

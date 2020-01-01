<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-col :span="3">
        <el-select v-model="listQuery.houseName" @keyup.enter.native="handleFilter"  placeholder="药房名称">
          <el-option
            v-for="item in houseList"
            :key="item.drugWareHouse"
            :label="item.label"
            :value="item.drugWareHouse">
          </el-option>
        </el-select>
      </el-col>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-bottom: 10px;" class="filter-item" placeholder="药品名称" v-model="listQuery.drugName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="药房名称">
        <template slot-scope="scope">
          <span>{{scope.row.drug_ware_house}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="药品名称">
        <template slot-scope="scope">
          <span>{{scope.row.drug_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存">
        <template slot-scope="scope">
          <span>{{scope.row.stock | format }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="制药商">
        <template slot-scope="scope">
          <span>{{scope.row.manufacturer}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="规格">
        <template slot-scope="scope">
          <span>{{scope.row.norms}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" style="margin-top: 30px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getHouseDrugList, getHouseList} from '@/api/saler'
  import waves from '@/directive/waves' // 水波纹指令
  import {parseTime} from '@/utils'

  export default {
    name: 'complexTable',
    directives: {
      waves
    },
    data() {
      return {
        isSearch: false,
        tableKey: 0,
        houseList:null,
        list: null,
        total: null,
        listLoading: true,
        drugHouseOption:
        {
          drugHouseId: '',
          drugWareHouse: "",
          version: "",
          token: "",
          label:"全部",
        },
        listQuery: {
          page: 1,
          limit: 10,
          houseName: '圣瑞禾',
          drugName: undefined,
          sort: '+id',
        },
        importanceOptions: [1, 2, 3],
        drugStore: []
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
      format(val) {
        if(val != null){
          return parseInt(val)
        }
        return val
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    created() {
      this.getList()
      this.gethouseList()
    },
    methods: {
      getList() {
        this.listLoading = true
        // 用户列表
        getHouseDrugList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      gethouseList() {
        getHouseList().then(response => {
          this.houseList =  response.data;
          for ( var i = 0; i <this.houseList.length; i++){
            this.houseList[i].label = this.houseList[i].drugWareHouse
          }
          this.houseList.push(this.drugHouseOption)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.listQuery.limit = 10
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      }
    }
  }
</script>
<style>
  @media screen and (max-width: 768px) {
    .app-container .el-dialog {
      width: 60%;
    }
  }
</style>


<template>
	<div class="company">
	 	<div class="block">
		    <span class="demonstration"></span>
		    <el-date-picker
		      v-model="startTime"
		      type="datetime"
		      placeholder="开始时间"
		      default-time="00:00:00">
		    </el-date-picker>
		    <span class="demonstration"></span>
		    <el-date-picker
		      v-model="endTime"
		      type="datetime"
		      placeholder="结束时间"
		      default-time="00:00:00">
		    </el-date-picker>
		    <el-select v-model="typeWord" placeholder="请选择">
			    <el-option
			      v-for="item in SelectOptions"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			</el-select>
		    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="companySearch()">搜索</el-button>
	     	<el-button class="filter-item" type="primary" icon="el-icon-edit" @click="companyExcel()">导出</el-button>
		</div>
		<div class="company-table">
			<el-table :data="tableData" border style="width: 1351px">
			    <el-table-column
			        prop="code"
			        label="医师编码"
			        width="130">
			    </el-table-column>
			    <el-table-column
			        prop="doctorName"
			        label="医师姓名"
			        width="240">
			    </el-table-column>
			    <el-table-column
			        prop="createtime"
			        label="创建时间"
			        width="200">
			    </el-table-column>
			    <el-table-column
			        prop="zylx"
			        label="职业类型"
			        width="130">
			    </el-table-column>
			    <el-table-column
			        prop="title"
			        label="职称"
			        width="180">
			    </el-table-column>
			    <el-table-column
			        prop="docAddress"
			        label="所在地区"
			        width="240">
			    </el-table-column>
			    <el-table-column
			        prop="hospitalName"
			        label="所属医院"
			        width="100">
			    </el-table-column>
			    <el-table-column
			        prop="yxbz"
			        label="状态"
			        width="130">
			    </el-table-column>
		    </el-table>
		</div>
		<div class="pagination-container" style="margin-top: 30px;">
		    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQueryPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
		    </el-pagination>
	    </div>
	</div>
</template>
<script>
	import {selectDoctor} from '@/api/export'
	export default{
		name: '',
		data(){
			return{	
		        startTime: '',
		        endTime: '',
		        tableData: [],
		        typeWord: '航信景联',
		        typeSelect: 0,
		        handleSizeChangeData: 10, //每页大小
		        listQueryPage: 1, //当前页
		        listQuery: {
			        limit: 1,
			    },
			    total: null,
			    SelectOptions: [{
		          	value: '0',
		          	label: '航信景联'
		        }, {
		          	value: '1',
		          	label: '南京健晨 '
		        }, {
		         	value: '2',
		          	label: '广州景联'
		        }],
		        searchFlag: true
			}
		},
		watch:{
			startTime: function(newVal,oldVal){	
				this.startTime = this.timeData(newVal);
				if(this.startTime == '1970-01-01 08:00:00'){;
					this.startTime = '';
				}
				this.timeFunc();
			},
			endTime: function(newVal,oldVal){
				this.endTime = this.timeData(newVal);
				if(this.endTime == '1970-01-01 08:00:00'){;
					this.endTime = '';
				}
				this.timeFunc();
			},
			typeWord: function(newVal,oldVal){
				this.typeSelect = newVal;
			}
		},
		methods: {
			selectDoctor(page,limit){
				if(!this.searchFlag){
					this.timeFunc();
					return false;
				}
				var params = {
					page: page,
					limit: limit,
					type: this.typeSelect,
					beginTime: this.startTime,
					endTime: this.endTime
				};
				selectDoctor(params).then(response => {
		          	this.tableData = response.data.records;
		          	this.total = response.data.total;
		          	console.log(response)
		        })
			},
			companySearch(){
				this.listQueryPage = 1;
				this.selectDoctor(this.listQueryPage,this.handleSizeChangeData);
			},
			handleSizeChange(val){
				this.handleSizeChangeData = val;
				this.selectDoctor(this.listQueryPage,val);
			},
			handleCurrentChange(val){
				this.listQueryPage = val;
				this.selectDoctor(val,this.handleSizeChangeData);
			},
			timeData(value){
				if(value == '') return '';
				var value = new Date(value)
				var YY = value.getFullYear();
				var MM = value.getMonth() + 1;
					if(MM > 10)MM = MM
					else MM = '0' + MM;
				var dd = value.getDate();
					if(dd > 10)dd = dd
					else dd = '0' + dd;

				var hh = value.getHours();
					if(hh > 10)hh = hh
					else hh = '0' + hh;
				var mm = value.getMinutes();
					if(mm > 10)mm = mm
					else mm = '0' + mm;
				var ss = value.getSeconds();
					if(ss > 10)ss = ss
					else ss = '0' + ss;
				var datetimes = YY + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss;
				return datetimes;
			},
			timeFunc(){
				if(this.startTime != '' && this.endTime != ''){
					var startTimeStamp = new Date(this.startTime).getTime();
					var endTimeStamp = new Date(this.endTime).getTime();
					if(endTimeStamp > startTimeStamp){
  						this.searchFlag = true;
					}else{
						this.$message({
				            type: 'info',
				            message: '结束时间不能小于开始时间'
				        }); 
				        this.searchFlag = false;
					}
				}else{
					 this.searchFlag = true;
				}
				
			},
			companyExcel(){
				window.location.href = process.env.BASE_API +'/exports/exportsDoctor?type='+this.typeSelect+'&beginTime='+this.startTime+'&endTime'+this.endTime;
			}
		},
		mounted: function(){
			this.selectDoctor(this.listQueryPage,this.handleSizeChangeData);
			console.log( );
		}
	}
</script>
<style>
	.company{
		padding: 30px;
	}
	.company-table{
		margin-top: 30px;
	}
</style>
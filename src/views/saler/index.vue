<template >
    <div class="salerContent clearfix">
        <div v-if="isSuccess" class="successContent">
            <div class="successTip">
                <img src="./../../assets/success.png">
                <p>保存成功</p>
            </div>
        </div>
        <div v-else>
            <!-- <div class="drugCell"> -->
                <!-- <span class="drugCellTitle">药店名称：</span> -->
                <group>
                    <x-input class="saleInpH"  title='药店名称：' placeholder="请输入药店首拼或关键字" v-model="drugStoreName" v-if="onlyOneStoreFlag" :disabled="true" text-align='right'></x-input>
                    <x-input class="saleInpH" title='药店名称：' placeholder="请输入药店首拼或关键字" v-model="drugStoreName" v-else @focus="setSelectFlag" text-align='right'></x-input>
                </group>
                <!-- <el-input v-model="drugStoreName" class="salerDrugName" placeholder="请输入药店首拼或关键字" prefix-icon="el-icon-search" v-if="onlyOneStoreFlag" :disabled="true"></el-input> -->
                <!-- <el-input v-model="drugStoreName" class="salerDrugName" placeholder="请输入药店首拼或关键字" prefix-icon="el-icon-search" @focus="setSelectFlag" v-else></el-input> -->
            <!-- </div> -->
            <div v-if="drugStoreFlag" class="drugCellCon">
                <div class="drugStoreCell" v-for="item in drugStoreList" @click="selectStore(item)">
                    {{item.drugstoreName}}
                </div>
                <div class="noDrugData">
                    {{title}}
                </div>
            </div>
            <div v-else>
                <!-- <div class="drugCell"> -->
                    <group>
                        <datetime v-model="sendTime"  title="配货到店日期：" placeholder="选择日期时间" class="saleDateCon"></datetime>
                    </group>
                    <!-- <span class="drugCellTitle">配货到店日期：</span>
                    <el-date-picker :editable="false" class="drugDatePick" v-model="sendTime" type="date" placeholder="选择日期时间" value-format='yyyyMMdd'></el-date-picker> -->
                <!-- </div> -->
                <!-- <div class="drugCell"> -->
                    <!-- <span class="drugCellTitle">添加药品：</span> -->
                    <!-- <el-input v-model="drugName" class="salerDrugName" placeholder="请输入药品首拼或关键字" prefix-icon="el-icon-search" @focus="setScrollHeight"></el-input> -->
                   <group>
                        <x-input class="saleInpH"  title='添加药品：' placeholder="请输入药品首拼或关键字" v-model="drugName"  @focus="setScrollHeight" text-align='right'></x-input>
                    </group>
                <!-- </div> -->
                <div class="drugList" v-if="drugListShowFlag" :style="setHeight">
                    <div class="drugListCell " v-for="item in drugList" @click="selectDrug(item)">
                        <span>{{item.drugName}}</span>
                        <span class="specifications">{{item.norms}}</span>
                    </div>
                    <div class="noDrugStoreData">
                        {{title}}
                    </div>
                </div>
                <div class="drugList" v-if="drugDetailShowFlag" id="drugDetailList" :style="setHeight">
                    <div class="drugDetailCell clearfix" v-for="item,index in drugDetailList">
                        <div class="drugDetailTitle">
                            <span class="fl">{{item.drugName}}</span>
                        </div>
                        <img class='fr' src="./../../assets/del.png" @click.stop="delDrug(index)">
                        <div class="drugDescription clearfix">
                            <div class="drugDesContent fl">
                                <p>规格：{{item.norms}}</p>
                                <p>生产厂家：{{item.manufacturer}}</p>
                            </div>
                            <div class="purcharseNum">
                                <label for="purcharseNum">采购数量：</label><input id="purcharseNum"  maxlength="10" type="number" v-model="item.purcharseNum" v-on:input="setValPurcharseNum(item)"  >
                            </div>
                        </div>
                        <div class='drugListGray'></div>
                    </div>
                </div>
                <div class="drugScrollBox" v-if="drugScrollBoxShow">

                </div>
            </div>
            <div class="submitContent" @click="submitDrugInfo">
                <el-button class="submit" type="primary">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {getDrugList,addOrderDetail,getDrugStoreList} from '@/api/saler'
    export default {
        data(){
            return {
                drugStoreName:'',
                drugStoreId:'',
                drugName:'',
                sendTime:'',
                drugStoreList:[],
                drugStoreFlag:false,//如果有药店的列表  其他的元素不显示 默认false
                selectStoreFlag:false,
                drugList:[],//查询出的药品列表
                drugDetailList:[],//增加的药品列表
                drugListShowFlag:false,//是否显示查询列表 true 显示
                drugDetailShowFlag:false,//是否显示添加的药品 true 显示
                saveStoreObj:[],//保存的药店信息
                setHeight:{
                    height:''
                },
                drugScrollBoxShow:true,
                purcharseNumFlag:true,//是否有未填写数量标志，如果有未填写为true
                title:'',//无数据的提示
                isSuccess:false,//是否保存成功
                onlyOneStoreFlag:false,//销售员只有一个药店Flag true 只有一个
            }
        },
        methods:{
            getDrugList(drugObj){
                getDrugList(drugObj).then(res => {
                    if(res.code ==200 ){
                        var res =  res.data ;
                        this.drugList = res.records;
                        if(this.drugList.length > 0){
                            this.title =""
                            this.drugListShowFlag = true;
                            this.setDrugListHeight()
                        }else{
                            this.title = "暂无该药品，请重新输入"
                        }
                    }else{
                        this.title = "暂无该药品，请重新输入"
                        if(res.msg){
                            console.log(res.msg)
                        }else{
                            console.log('请求失败')
                        }
                    }
                }).catch(res=>{
                    console.log(res)
                })
            },
            setScrollHeight(){
                this.drugScrollBoxShow =  true;
            },
            getDrugStoreList(drugStoreObj,searchFlag){
                getDrugStoreList(drugStoreObj).then(res => {
                    if(res.code == 200 ){
                        var res =  res.data ;
                        if(res.records.length >0){
                            if(res.records.length == 1 && searchFlag == "once"){
                                this.selectStoreFlag =  true;
                                this.onlyOneStoreFlag = true;
                                this.drugStoreFlag = false;
                                this.odDrugStoreId = res.records[0].id ;
                                this.drugStoreName = res.records[0].drugstoreName ;
                            }else{
                                this.onlyOneStoreFlag = false;
                                if(this.drugStoreName){
                                    this.drugStoreFlag =  true ;
                                }
                                this.title = ""
                                this.drugStoreList = res.records;
                            }
                        }else{
                            this.drugStoreList = {} ;
                            this.drugStoreFlag =  true;
                            this.title = '暂无此药店，请重新输入查找'
                        }
                    }else{
                        this.drugStoreFlag =  false;
                        this.drugStoreList = {} ;
                        this.title = '暂无此药店，请重新输入查找' ;
                        if(res.msg){
                            console.log(res.msg)
                        }else{
                            console.log('请求失败')
                        }
                    }
                })
            },
            setSelectFlag(){ //已选择置false
                this.selectStoreFlag =  false ;
            },
            setValPurcharseNum(item){
                // console.log(item)
                if(item.purcharseNum){
                    item.purcharseNum = item.purcharseNum.replace(/[^\d]/g,'');
                    if(item.purcharseNum == 0){
                        this.$set(item,'purcharseNum',null)
                    }else{
                        var purcharseNumber = parseInt(item.purcharseNum)
                        this.$set(item,'purcharseNum',purcharseNumber)
                    }
                }else{
                     this.$set(item,'purcharseNum',null)
                }
            },
            delDrug(index){
                this.drugDetailList.splice(index,1);
            },
            selectStore(drugStoreItem){
                this.drugStoreFlag = false;
                this.selectStoreFlag =  true;
                if(drugStoreItem){
                    this.drugStoreName = drugStoreItem.drugstoreName ;
                    this.odDrugStoreId = drugStoreItem.id ;
                }
            },
            selectDrug(drugItem){
                if(drugItem){
                    this.$set(drugItem,'purcharseNum','')
                    this.drugDetailList.unshift(drugItem);
                }
                if(this.drugDetailList.length > 0){
                    this.drugDetailShowFlag = true;
                    this.drugListShowFlag = false;
                }
            },
            submitDrugInfo(){
                var content;
                var orderObj= {};
                this.selectStoreFlag =  false ;
                if(!this.drugStoreName || this.drugStoreName.trim()==''){
                    content = '请选择药店名称';
                }else if(!this.sendTime){
                    content ='请选择配货到店日期'
                }else if(this.drugDetailList.length==0){
                    content = '请添加药品'
                }
                for(var i =0;i<this.drugDetailList.length;i++){
                    if(!this.drugDetailList[i].purcharseNum){//有未填写的购买数量
                        // this.purcharseNumFlag =  true;
                        content = '请填写药品采购数量'
                        this.$alert(content, '消息提示', {
                            confirmButtonText: '确定'
                        });
                        return ;
                    }
                    // else if(this.drugDetailList[i].purcharseNum == 0){
                    //     content = '请填写大于0 的整数'
                    // }
                }
                if(content){
                    this.$alert(content, '消息提示', {
                        confirmButtonText: '确定'
                    });
                }else{
                    this.$confirm('确定提交采购单?', '消息提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        orderObj.odDrugStoreId =  this.odDrugStoreId ;
                        orderObj.drugStoreName =  this.drugStoreName ;
                        orderObj.odDrugList =  this.drugDetailList;
                        orderObj.sendTime =  this.sendTime;
                        addOrderDetail(orderObj).then(res=>{
                            if(res.code ==200){
                                var res =  res.data;
                                this.isSuccess =  true;
                            }else{
                                this.$alert("保存失败，请重新保存", '消息提示', {
                                    confirmButtonText: '确定'
                                });
                            }
                        })
                    })
                }
            },
            setDrugListHeight(){
                var drugListHeight;
                if(this.drugListShowFlag || this.drugDetailShowFlag){
                    var clientHeight = document.documentElement.clientHeight ;
                    this.setHeight.height = clientHeight -330 +'px';
                }
            }
        },
        mounted(){
            window.onresize = ()=>{
                this.setDrugListHeight()
            }
            var drugStoreObj = {};
            drugStoreObj.drugStoreName  = '' ;
            this.getDrugStoreList(drugStoreObj,'once')
        },
        watch:{
            drugName(n,o){
                if(n){
                    this.drugScrollBoxShow = false ;
                    this.drugDetailShowFlag = false;
                    this.drugListShowFlag = true;
                    var drugStoreObj = {};
                    drugStoreObj.drugName = n ;
                    drugStoreObj.pageNum = this.pageNum ;
                    drugStoreObj.pageSize = 10 ;
                    this.getDrugList(drugStoreObj);
                }else{
                    this.drugList = {};
                    this.drugListShowFlag =  false ;
                    this.drugDetailShowFlag = true ;
                    this.title = "暂无该药品，请重新输入"
                }
            },
            drugStoreName(n,o){
                if(n){
                    this.drugStoreList = {};
                    this.drugScrollBoxShow = false ;
                    if(!this.selectStoreFlag ){
                        var drugStoreObj = {};
                        drugStoreObj.drugStoreName  = n ;
                        drugStoreObj.pageNum = this.pageNum ;
                        // drugStoreObj.pageSize = '' ;
                        this.getDrugStoreList(drugStoreObj);
                   }
                }else{
                    this.drugStoreFlag =  false ;
                    this.drugStoreList = {};
                    this.title = "暂无此药店，请重新输入查找";
                }
            }
        }
    }
</script>

<style scoped>
    .salerContent{
        position: relative;
    }
    /* .drugCell{
        background: #fff;
        margin-bottom: 10px;
        padding: 10px 15px;
    } */
    .drugCellTitle{
        display: inline-block;
        width: 30%;
        text-align: right;
        font-size: 14px
    }
    .salerDrugName {
        width: 62% !important;
        margin-left: 5px;
    }
    .drugDatePick{
        width: 62%;
        margin-left: 5px;
    }
    .drugList{
        margin-top: 15px;
        /* max-height: 346px; */
        overflow: auto;
    }
    .hiddenHeight{
        height: 80px;
    }
    .drugListCell{
        margin-left: 20px;
        text-align: center;
        border-bottom: 1px solid #f5f5f5;
    }
    .drugListCell span{
        display: inline-block;
        width: 42%;
        height: 36px;
        line-height: 36px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .specifications{
        border-left: 1px solid #f5f5f5;
    }
    .drugDetailCell{
        /* margin: 10px;
        padding: 10px; */
        background-color: #fff;
        position: relative;
    }
    .drugDetailTitle{
        margin-top: 10px;
        margin-left: 15px;
        height: 20px;
    }
    .drugDetailTitle span{
        font-weight: 600;
    }
    .drugDetailCell img{
        width: 20px;
        position: absolute;
        right: 10px;
        top: 3px;
    }
    .drugDescription{
        position: relative;
        font-size: 12px;
        height: 62px;
        margin-left: 15px;
    }
    .drugDescription p{
         color: rgba(145, 134, 134, 0.856);
    }
    .drugDesContent{
        display: inline-block;
    }
    .purcharseNum{
        position: absolute;
        right: 40px;
        top:12px;
        font-size: 14px;
    }
    .purcharseNum input{
        -webkit-appearance:none;
        border-radius:0;
        width: 80px;
        height: 25px;
        /* padding-left: 20px; */
        text-align: center;
        border: 0px;
        outline:none;
        border-bottom: 1px solid #000;
        
    }
    .submitContent{
        position: fixed;
        bottom:0;
        width: 100%;
    }
    .salerContent .submit{
        width: 96%;
        margin-left: 2%;
    }
    .drugListGray{
        width: 100%;
        height: 10px;
        background-color: #f5f5f5;
    }
    .drugStoreCell{
        height: 35px;
        background: #fff;
        line-height: 35px;
        border-bottom: 1px solid #f5f5f5;
        padding-left: 15px;
    }
    .noDrugStoreData{
        position: absolute;
        left: 30%;
        top: 120%;
    }
    .noDrugData{
        position: absolute;
        left: 25%;
        top: 243%;
    }
    .successContent{
        position: relative;
    }
    .successTip{
        position: absolute;
        left: 35%;
        top: 60px;
        color: #0EC469;
        font-size: 26px
    }
    .successTip p {
        text-align: center;
    }
    .drugScrollBox{
        height: 150px;
    }
    .saleDateCon{
        height: 50px;
        font-weight: 600
    }
    .saleInpH{
        height: 50px;
    }
    .drugCellCon {
        margin-bottom: 60px;
    }
</style>
<style>
    .el-input__inner{
        background-color: #f5f5f5 !important;
    }
    .el-message-box{
        width: 360px;
    }
    .weui-cells{
        margin-top: 0 !important;
        font-size:14px !important;
    }
    .weui-cells:before{
        border-top: none !important;
    }
    .weui-cell_access .weui-cell__ft{
        font-weight:500 !important
    }
    .saleInpH .weui-input{
        height: 50px !important;
    }
</style>

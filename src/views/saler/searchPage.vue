<template>
    <div class="salerContent">
        <div class="drugCell">
            <el-input v-model="drugStoreName" :autofocus="true" class="salerDrugName" placeholder="请输入药店首拼或关键字" prefix-icon="el-icon-search"></el-input>
        </div>
        <div class="drugStoreList" v-if="drugStoreList.length>0">
            <div class="drugStoreCell" v-for="item in drugStoreList" @click="selectStore(item)">
                {{item.drugstoreName}}
            </div>
        </div>
        <div class="noDrugStroeData">{{title}}</div>
    </div>
</template>

<script>
    import {getDrugStoreList} from '@/api/saler'
    export default {
        data(){
            return{
                drugStoreName:'',
                drugStoreList:[],
                pageNum:1,
                title:'',
                drugNameChangeFlag:false,//药店名称是否改变过
            }
        },
        methods:{
            getDrugStoreList(drugStoreObj){
                getDrugStoreList(drugStoreObj).then(res => {
                    if(res.code ==200 ){
                        var res =  res.data ;
                        console.log(res.records.length)
                        if(res.records.length >0){
                            this.title = ""
                            this.drugStoreList = res.records;
                        }else{
                            this.title = '暂无此药店，请重新输入查找'
                        }
                    }else{
                        this.title = '暂无此药店，请重新输入查找'
                        if(res.msg){
                            console.log(res.msg)
                        }else{
                            console.log('请求失败')
                        }
                    }
                })
            },
            selectStore(drugStoreItem){
                this.$router.push({name:'Saler',params:{drugStoreInfo:drugStoreItem}})
            }
        },
        watch:{
            drugStoreName(n,o){
                // this.store.commit('setDrugStoreNameChangeFlag',{"drugNameChangeFlag":true})
                if(n){
                    var drugStoreObj = {};
                    drugStoreObj.drugName = n ;
                    drugStoreObj.pageNum = this.pageNum ;
                    drugStoreObj.pageSize = 10 ;
                    this.getDrugStoreList(drugStoreObj)
                }
            }
        },
        mounted() {
            // if(this.$route.params.drugStoreName){
            //     this.drugStoreName = this.$route.params.drugStoreName ;
            // }
        },
    }
</script>

<style scoped>
    .salerContent{
        position: fixed;
        width: 100%;
        background-color: #f5f5f5;
    }
    .drugCell{
        background: #fff;
        margin-bottom: 10px;
        padding: 10px 15px;
    }
    .drugCellTitle{
        display: inline-block;
        width: 30%;
        text-align: right;
        font-size: 14px
    }
    .drugStoreCell{
        height: 35px;
        background: #fff;
        line-height: 35px;
        border-bottom: 1px solid #f5f5f5;
        padding-left: 15px;
    }
    .noDrugStroeData{
        position: absolute;
        left: 25%;
        top: 281%;
    }
</style>
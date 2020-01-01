<template>
    <div class="orderDetail_box" id="orderDetail_box">
        <x-header title="订单详情" v-if="showHeader"></x-header>
        <div v-if="orderDetail">
            <div class="orderDetail_text orderDetail_flex"><span>药店名称</span><span>{{orderDetail[0].drugstoreName}}</span></div>
            <div class="orderDetail_text orderDetail_flex" style="margin-bottom:10px;"><span>配送到店日期</span><span>{{orderDetail[0].sendTime}}</span></div>
            <div class="orderDetail_text orderDetail_padding">
                <p class="drugs_msg"><span>药品信息</span></p>
                <div v-for="item,index in orderDetail" :key="index" style="margin-bottom:5px;">
                    <p>{{index+1}}. {{item.drugName}} </p>   
                    <p class="drugs_spec"><span>{{item.norms}}</span><span>x{{item.count}}</span></p>
                    <p class="drugs_spec">{{item.manufacturer}}</p>
                </div>
            </div>
            <div class="orderDetail_text">
                <p class="orderDetail_flex"><span>订单号</span><span>{{orderDetail[0].orderId}}</span></p>
                <p class="orderDetail_flex"><span>下单时间</span><span>{{orderDetail[0].odUpdateTime}}</span></p>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { getOrderDetail } from '@/api/saler'
    import { XHeader } from 'vux'

    export default {
        components: {
            XHeader
        },
        computed: {
            ...mapGetters([
                'roles'
            ])
        },
        data:function(){
            return {
                orderDetail: null,
                showHeader: false
            }
        },
        methods: {
            getMedsheetDetail: function(){
                var that = this ;
                var userInfo,userId,orderId;
                if(localStorage.userId){
                    userId = localStorage.userId
                }else if(sessionStorage.getItem("userInfo")){
                    userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
                    userId = userInfo.content.userId
                }
                if(this.$route.query.orderId){
                    orderId = this.$route.query.orderId;
                }
                var params = 'userId='+ userId +'&orderId=' + orderId;
                getOrderDetail(params).then(function(res){
                    if(res.code == 200){
                        that.orderDetail =  res.data;
                        for(var i in that.orderDetail){
                            that.orderDetail[i].sendTime = that.orderDetail[i].sendTime.substring(0,19)
                            that.orderDetail[i].odUpdateTime = that.orderDetail[i].odUpdateTime.substring(0,19)
                        }
                    }
                    
                })
            }
        },
        mounted:function(){
            var wi=window.screen.width;
            var hi=window.screen.height;
            document.getElementById("orderDetail_box").style.width=wi+"px";
            document.getElementById("orderDetail_box").style.height=hi+"px";
            
            this.getMedsheetDetail()
            if(this.roles[0] == '销售员'){
                if( navigator.userAgent.match(/Android/i)
			    || navigator.userAgent.match(/webOS/i)
			    || navigator.userAgent.match(/iPhone/i)
			    || navigator.userAgent.match(/iPad/i)
			    || navigator.userAgent.match(/iPod/i)
			    || navigator.userAgent.match(/BlackBerry/i)
			    || navigator.userAgent.match(/Windows Phone/i)
			    ){
			    	this.showHeader = true
			    }
            }
        }
    }
</script>

<style scoped>
    .orderDetail_box {
        font-size: 14px;
        background: #f5f5f5;
    }
    .orderDetail_text {
        line-height: 1;
        padding: 10px 15px;
        border-bottom: 1px solid #eee;
        background: #fff;
    }
    .orderDetail_text p {
        line-height: 1.4;
    }
    .orderDetail_box .orderDetail_padding {
        padding: 15px 15px 20px;
    }
    .orderDetail_flex {
        display: flex;
        justify-content: space-between;
    }
    .orderDetail_flex span:nth-child(1) {
        color: #999;
    }
    .orderDetail_flex span:nth-child(2) {
        color: #666;
    }
    .drugs_msg {
        font-size: 14px;
        font-weight: bold;
        color: #333;
    }
    .orderDetail_box .drugs_spec {
        display: flex;
        justify-content: space-between;
        padding-left: 16px;
        line-height: 1.5;
        font-size: 12px;
        color: #666;
    }
</style>
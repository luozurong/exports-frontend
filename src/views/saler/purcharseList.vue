<template>
    <div class="purcharseList_box">
        <div>
            <div class="date clearfix">
                <div @click="showTimeChose" class="time">
                        <span class="timeRangeBox" v-if="!timeRangeFlag">{{time}}</span>
                        <span v-else class="rangeTime">{{starttime}} 至 {{endtime}}</span>
                        <span v-if="startEndTime"></span>
                        <span v-else></span>
                        <img v-if="iconshow" src="./../../assets/icons/down2.png" >
                        <img v-else src="./../../assets/icons/up.png">
                </div>
                <div class="vux-scrollable">
                    <popup v-model="show" position="top" :should-scroll-top-on-show='true' :show-mask='true'>
                        <!-- <group gutter="0">
                            <radio :options="times" v-model="time" class="times"></radio>
                        </group> -->
                        <div>
                            <p v-for="item,index in times" class="choseTimes" @click="choseTimes(index)">{{item}}</p>
                        </div>
                    </popup>
                </div>
                <div v-transfer-dom>
                    <popup v-model="timeshow" :show-mask='true'>
                        <popup-header left-text="取消" right-text="确定"  title="请选择时间" :show-bottom-border="false" @on-click-left="canceltime"
                        @on-click-right="confirmtime"></popup-header>
                        <group gutter="0" class="dateImg">
                            <cell @click.native="selecttime('开始时间')" title="">
                                <span slot="default"></span>
                                <span slot="inline-desc">起始时间：{{starttime}}</span>
                            </cell>
                            <cell @click.native="selecttime('结束时间')" title="">
                                <span slot="default"></span>
                                <span slot="inline-desc">截止时间：{{endtime}}</span>
                            </cell>
                        </group>
                    </popup>
                </div>
            </div>
            <div class="order_con">
                <div v-if="presList.length > 0" style="height: 47px;"></div>
                <scroller v-show="isShow" v-model="scrollerStatus" height="-90" lock-x scrollbar-y ref="scroller" :bounce="isbounce"
                :use-pullup="showUp" :pullup-config="upobj" @on-pullup-loading="selPullUp" v-if="presList.length != 0">
                    <group class="prescriptionContent">
                        <cell value-align='left' v-for="item,index in presList" :key="index" :link="{path:'/purcharseDetail', query: {orderId: item.orderId}}">
                            <div class="desText fl">
                                <p>订单号：{{item.orderId}}</p>
                                <p>下单时间：{{item.ocreateTime}}</p>
                                <p>药店名称：{{item.drugstoreName}}</p>
                            </div>
                        </cell>
                    </group>
                    <load-more :show-loading="false" v-if="noMore" tip="没有更多数据了" background-color="#fbf9fe"></load-more>
                </scroller>
                <div v-if="presList.length == 0" class="nullData">
                    暂无数据
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getOrderByUser } from '@/api/saler'
    import { Scroller,PopupHeader,Cell,Radio,Group,Popup,LoadMore,TransferDom } from 'vux'
    
    export default {
        directives: {
            TransferDom,
        },
        components: {
            Scroller,
            PopupHeader,
            Cell,
            Radio,
            Group,
            Popup,
            LoadMore,
        },
        data: function(){
            return {
                cancel: '取消',
                done: '确定',
                iconshow: true,
                show: false,
                times: ['全部', '当天', '当月', '自定义'],
                time: '全部',
                timeTemp: '',   // 临时存贮
                timeshow:false,
                starttime:'',
                endtime:'',
                timeSpanFlag: false,
                startEndTime: true,
                timeRangeFlag: false,
                timeRange:'',
                presList:[],
                PageIndex:'1',
                isShow: false,
                showUp: true,
                isbounce: true, //是否回弹
                noMore: false,  //是否有更多
                upobj: {
                    content: '',
                    pullUpHeight: 60,
                    height: 40,
                    autoRefresh: false,
                    downContent: '',
                    upContent: '上拉加载更多',
                    loadingContent: '加载中...',
                    clsPrefix: 'xs-plugin-pullup-'
                },
                scrollerStatus: {
                    pullupStatus: 'default'
                },
                statusFlag:false,
            }
        },
        methods: {
            // 选择时间
            choseTimes(index){
                console.log(index)
                if(index == 0){                 // 全部
                    this.presList = []
                    this.noMore = false ;
                    this.scrollerStatus.pullupStatus = 'default' // 下拉
                    this.show = false;
                    this.time = this.times[index]
                    this.starttime = ''
                    this.endtime = ''
                    this.timeshow = false;
                    this.PageIndex = 1;
                    this.getPrescriptions()
                }else if(index == 1){           // 当天
                    this.presList = []
                    this.noMore = false ;
                    this.scrollerStatus.pullupStatus = 'default' // 下拉
                    this.show = false;
                    this.time = this.times[index]
                    this.starttime = ''
                    this.endtime = ''
                    this.timeshow = false;
                    this.PageIndex = 1;
                    this.getPrescriptions()
                }else if(index == 2){           // 当月
                    this.presList = []
                    this.noMore = false ;
                    this.scrollerStatus.pullupStatus = 'default' // 下拉
                    this.show = false;
                    this.time = this.times[index]
                    this.starttime = ''
                    this.endtime = ''
                    this.timeshow = false;
                    this.PageIndex = 1;
                    this.getPrescriptions()
                }else if(index == 3){           // 自定义
                    this.show = false;
                    this.timeshow = true
                    this.timeTemp = this.time
                    this.time = this.times[index]
                }
            },
            showAlert:function(content){
                var  that =  this ;
                this.$vux.alert.show({
                    title: '系统提示',
                    content: content
                })
            },
            showTimeChose(){
                this.iconshow = !this.iconshow ;
                this.show = !this.show; 
            },
            canceltime(){
                this.timeshow = false
                this.time = this.timeTemp
                this.getPrescriptions()
            },
            confirmtime(){
                if(!this.starttime || !this.endtime){
                    this.showAlert('起始时间与截止时间为必填')
                    return
                }
                let startTimeArr = Date.parse(new Date(Date.parse((this.starttime+'').replace(/-/g, "/"))));
                let endTimeArr = Date.parse(new Date(Date.parse((this.endtime+'').replace(/-/g, "/"))));
                if(endTimeArr - startTimeArr < 0){
                    this.showAlert('截止时间要在起始时间之后')
                    return
                }
                this.noMore = false ;
                this.scrollerStatus.pullupStatus = 'default' // 下拉
                this.time = this.times[3]
                this.show = false;
                this.timeshow = false;
                this.iconshow = true;
                this.presList = []
                this.getPrescriptions()
            },
            selPullUp() {
                this.PageIndex++ ;
                this.getPrescriptions(false)
            },
            selecttime: function(n){
                var that =this;
                this.$vux.datetime.show({
                    cancelText: '取消',
                    confirmText: '确定',
                    format: 'YYYY-MM-DD',
                    onConfirm (val) {
                        if(n=='开始时间'){
                            that.starttime = val
                        }else if(n=='结束时间'){
                            that.endtime = val
                        }
                        if(that.starttime && that.endtime ){
                            that.timeSpanFlag = true;
                            that.timeRangeFlag  = true ;
                        }
                    }
                })
            },
            getPrescriptions: function(isEmpty){
                var that  = this ;
                var userInfo,userId;
                if(localStorage.userId){
                    userId = localStorage.userId
                }else if(sessionStorage.getItem("userInfo")){
                    userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
                    userId = userInfo.content.userId
                }
                // 时间
                var times = new Date();
                var year = times.getFullYear()  // 年
                var month = times.getMonth() + 1; //月
                var date = times.getDate(); //日 
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (date >= 0 && date <= 9) {
                    date = "0" + date;
                }

                var params = {};
                that.$vux.loading.show({
                    text: '加载中'
                })
                if(that.time == '全部' || that.time == ''){
                    // that.timeRange = 0  
                    that.timeRangeFlag  = false;
                    params = 'page='+ that.PageIndex +'&limit=10&userId=' +  userId           
                }else if(that.time == '当天'){
                    that.timeRangeFlag  = false;
                    var createTime = year + '-' + month + '-' + date
                    params = 'page='+ that.PageIndex +'&limit=10&userId=' + userId + '&startTime=' + createTime    
                    //  that.timeRange = 1
                }else if(that.time == '当月'){
                    //  that.timeRange = 2
                    that.timeRangeFlag  = false;
                    var createTime = year + '-' + month
                    params = 'page='+ that.PageIndex +'&limit=10&userId=' + userId + '&startTime=' + createTime  
                }else{
                    var startTime = that.starttime;
                    var endTime = that.endtime;
                    params = 'page='+ that.PageIndex +'&limit=10&userId=' + userId + '&startTime=' + startTime + '&endTime=' + endTime  
                }
                getOrderByUser(params).then(function(res){
                    var result  = res.data;
                    setTimeout(function () {
                        that.$vux.loading.hide()
                    }, 500)
                    if(result.code){
                        if(result.code == 200){
                            if(result.records){
                                var data = result.records;
                                if(isEmpty){
                                    that.presList = []
                                }else{
                                    if(data && data.length == 0 ){
                                        that.isShow = true;
                                        that.noMore = true ;
                                        that.scrollerStatus.pullupStatus = 'disabled' // 禁用下拉
                                        return
                                    }
                                }
                                for(var i = 0; i < data.length; i++){
                                    that.presList.push(data[i])
                                }
                                that.isShow = true;
                                if (!isEmpty) {
                                    that.scrollerStatus.pullupStatus = 'default';
                                }
                            }
                        }
                    }else{
                        if(result.records){
                            var data = result.records;
                            if(isEmpty){
                                that.presList = []
                            }else{
                                if(data && data.length ==0 ){
                                    that.isShow = true;
                                    that.noMore = true ;
                                    that.scrollerStatus.pullupStatus = 'disabled' // 禁用下拉
                                    return
                                }
                            }
                            for(var i = 0; i < data.length; i++){
                                that.presList.push(data[i])
                            }
                            that.isShow = true;
                            if (!isEmpty) {
                                that.scrollerStatus.pullupStatus = 'default';
                            }
                        }
                    }
                    
                }).catch(function(res){
                    setTimeout(function () {
                        that.$vux.loading.hide()
                    }, 500)
                })
            }
        },
        watch: {
            time:function(n, o) {
                var that = this ;
                that.PageIndex = 1;
                that.presList = [];
                if(n != o){
                    that.show = false;
                }
            },
        },
        mounted(){
            this.getPrescriptions(true);  
        }
    }
</script>

<style scoped>
    .date{
        font-size: 14px;
        color: #999;
        text-align: center;
    }
    .date img{
        width: 12px;
        height: 12px;
        vertical-align: middle;
    }
    .drugPacket{
        height: 70px;
        line-height: 70px;

    }
    .drugPacket img{
        width: 42px;
        height: 42px;
        margin-right: 17px;
        vertical-align: middle;
    }
    .desText p{
        font-size: 12px;
        color: #666;
        margin-bottom:5px;
    }
    .desText .diagnosis{
        font-size: 16px;
        color: #333;
    }
    .vux-popup-dialog {
        transition-property: none;
        transition-duration: 0ms;
        overflow-y: hidden;
    }
    .vux-popup-dialog.vux-popup-top {
        top: 90px
    }
    .vux-cell-box {
        text-align: center
    }
    .time {
        position: fixed;
        top: 50px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: #f5f5f5;
        z-index: 2;
        text-align: center;
    }
    .dateImg span img{
        width: 20px;
    }
    .times {
        font-size: 14px;
    }
    .rangeTime{
        font-size: 12px;
        color: #f47d35;
        height: 50px;
    }
    .rangeTime p{
        height: 14px;
    }
    
</style>
<style lang="less">
    @import '~vux/src/styles/reset.less';

    .purcharseList_box {
        background: #f5f5f5;
    }
    .purcharseList_box .weui-cells {   
        margin-top: 0px;
    }
    .purcharseList_box .weui-cell {      
        padding: 10px 15px !important;
    }
    .purcharseList_box .weui-cell_access .weui-cell__ft:after {
        width: 10px;
        height: 10px;
    }
    .purcharseList_box .weui-cells_radio .weui-cell__ft {
        display: none;
    }
    .purcharseList_box .choseTimes {
        padding: 10px 15px;
        background: #fff;
        border-bottom: 1px solid #eeeeee;
    }
    .vux-popup-mask {
        top: 90px !important;
    }
    /* 暂无数据 */
  .nullData {
    position: absolute;
    top: 40%;
    width: 100%;
    font-size: 16px;
    color: #999;
    text-align: center;
  }
</style>
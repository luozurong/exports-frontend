<template >
    <div class="salerContent clearfix">
        <div class="tabBox">
            <tab v-model="tabIndex" prevent-default @on-before-index-change="switchTabItem">
                <tab-item selected>采购填写</tab-item>
                <tab-item>采购记录</tab-item>
                <tab-item>个人中心</tab-item>
            </tab>
        </div>
        <div style="height:44px;"></div>
        <!-- 采购填写 -->
        <div v-if="tabIndex == 0">
            <index></index>
        </div>
        <!-- 采购记录 -->
        <div v-if="tabIndex == 1">
            <purcharseList></purcharseList>
        </div>
        <!-- 个人中心 -->
        <div v-if="tabIndex == 2">
            <mine></mine>
        </div>
    </div>
</template>

<script>
    import {getDrugList,addOrderDetail,getDrugStoreList} from '@/api/saler'
    import { Tab, TabItem } from 'vux'
    import index from '@/views/saler/index'
    import purcharseList from '@/views/saler/purcharseList'
    import mine from '@/views/log/index'

    export default {
        components: {
            Tab,
            TabItem,
            index,
            purcharseList,
            mine
        },
        data(){
            return {
                tabIndex: 0,     // tab index
            }
        },
        methods:{
            // tab切换
            switchTabItem (index) {
                console.log('on-before-index-change', index)
                this.$vux.loading.show({
                    text: '加载中'
                })
                setTimeout(() => {
                    this.$vux.loading.hide()
                    this.tabIndex = index
                }, 1000)
            }
        },
        mounted(){
        }
    }
</script>
<style>
    .tabBox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 47px;
    }
    .vux-tab .vux-tab-item.vux-tab-selected {
        color: #409EFF !important;
        border-bottom: 3px solid #409EFF !important;
    }
    .vux-tab-ink-bar {
        background-color: #409EFF !important;
    }
</style>

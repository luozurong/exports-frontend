import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import permission from './modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  getters,
  state:{
    drugStoreInfo:{
      drugStoreName:'' ,//销售员内药店的名称
      id:'' //销售员内药店的名称
    },
    drugStoreNameFlag:false,
  },
  mutations:{
    setDrugStoreInfo(state,data){
      state.drugStoreInfo.drugStoreName = data.drugStoreName;
      state.drugStoreInfo.id = data.id;
    },
    setDrugStoreNameChangeFlag(state,flag){
      state.drugStoreNameFlag = flag
    }
  }
  
})

export default store

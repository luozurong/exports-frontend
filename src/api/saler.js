import request from '@/utils/request'

//获取药店列表
export function getDrugStoreList(obj) {
  var drugName = obj.drugName;
  var pageSize = obj.pageSize;
  var pageNum = obj.pageNum;
  return request({
    url: '/api/getDrugStoreList',
    method: 'get',
    params: {
      drugStoreName: obj.drugStoreName ,
      pageSize: obj.pageSize,
      pageNum: obj.pageNum,
      }
  })
}

//获取药品列表
export  function getDrugList(drugObj){
  var drugName = drugObj.drugName;
  var pageSize = drugObj.pageSize;
  var pageNum = drugObj.pageNum;
  return request({
    url: '/api/getDrugList',
    method: 'get',
    params: {
        drugName:  drugObj.drugName,
        pageSize: drugObj.pageSize,
        pageNum: drugObj.pageNum,
      }
  })
}

//获取药房药品列表
export  function getHouseDrugList(drugObj){
  return request({
    url: '/api/getHouseDrugList',
    method: 'get',
    params: {
      houseName:  drugObj.houseName,
      drugName:  drugObj.drugName,
      page: drugObj.page,
      limit: drugObj.limit,
    }
  })
}

//获取药房下拉
export  function getHouseList(){
  return request({
    url: '/api/getHouseList',
    method: 'get',
  })
}

//添加药品订单
export  function addOrderDetail(orderObj){
  return request({
    headers:
    {
      'Content-Type': 'application/json'
    },
    url: '/api/addOrderDetail',
    method: 'post',
    data: orderObj
  })
}

//添加药品订单
export  function companyList(){
  return request({
    headers:
      {
        'Content-Type': 'application/json'
      },
    url: '/api/getCompanyList',
    method: 'get',
  })
}

//获取药品订单
export function getOrderList(orderObj){
  return request({
    headers:
    {
      // 'Content-Type': 'application/json'
    },
    url: '/api/addOrderDetail',
    method: 'post',
    data: orderObj
  })
}

//获取销售员订单
export function getOrderByUser(params){
  return request({
    url: 'api/getOrderByUser?' + params,
    method: 'get'
  })
}

//获取销售员订单详情
export function getOrderDetail(params){
  return request({
    url: 'api/getOrderDetailByOrderId?' + params,
    method: 'get'
  })
}
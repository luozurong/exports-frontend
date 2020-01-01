import request from '@/utils/request'


export function getOrderDetailList(query) {
  return request({
    url: '/api/getOrderDetailList',
    method: 'get',
    params: query
  })
}

export function getDrugStoreList(query) {
  return request({
    url: '/api/getDrugStoreList',
    method: 'get',
    params: query
  })
}

export function updateOrderDetail(data) {
  return request({
    url: '/api/updateOrderDetail',
    method: 'post',
    headers: {"Content-Type": "application/json;charset=UTF-8"},
    data
  })
}

export function getDrugList(query) {
  return request({
    url: '/api/getDrugList',
    method: 'get',
    params: query
  })
}

export function updateDrugStore(tempData) {
  return request({
    url: '/api/updateDrugHouse',
    headers: {"Content-Type": "application/json;charset=UTF-8"},
    method: 'post',
    data: tempData
  })
}

export function delDrug(data) {
  return request({
    url: '/api/delDrug/' + data,
    method: 'DELETE'
  })
}

export function statistics(query) {
  return request({
    url: '/api/statistics',
    method: 'get',
    params: query
  })
}

export function addDrug(data) {
  return request({
    url: '/api/addDrug',
    method: 'post',
    headers: {"Content-Type": "application/json;charset=UTF-8"},
    data
  })
}

export function delDrugStore(data) {
  return request({
    url: '/api/delDrugStore/' + data,
    method: 'DELETE'
  })
}

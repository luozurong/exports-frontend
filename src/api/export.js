import request from '@/utils/request'


export function selectDrugStore(query) {
  return request({
    url: '/exports/selectDrugStore',
    method: 'get',
    params: {
      page: query.page,
      limit: query.limit,
      type: query.type,
      beginTime: query.beginTime,
      endTime: query.endTime
    }
  })
}

export function selectDoctor(query) {
  return request({
    url: '/exports/selectDoctor',
    method: 'get',
    params: {
      page: query.page,
      limit: query.limit,
      type: query.type,
      beginTime: query.beginTime,
      endTime: query.endTime
    }
  })
}

export function selectDrugCompany(query) {
  return request({
    url: '/exports/selectDrugCompany',
    method: 'get',
    params: {
      page: query.page,
      limit: query.limit,
      type: query.type,
      beginTime: query.beginTime,
      endTime: query.endTime
    }
  })
}
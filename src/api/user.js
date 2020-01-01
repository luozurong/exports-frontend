import request from '@/utils/request'

export function userList(query) {
  return request({
    url: '/admin/getUserList',
    method: 'get',
    params: {
      nickName: query.nickName,
      username: query.username,
      phone: query.phone,
      page: query.page,
      userFlag: query.userFlag,
      limit: query.limit,
      roleId: query.roleId
    }
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/admin/addUser',
    method: 'post',
    data
  })
}

export function updateUser(tempData) {
  return request({
    headers:
    {
      'Content-Type': 'application/json',
      token: 'da9c79a8-f843-4cc3-b8cf-c107e84335dc'
    },
    url: '/admin/editInfo',
    method: 'post',
    data: tempData
  })
}

export function userUpdate(tempData) {
  return request({
    headers:
    {
      'Content-Type': 'application/json',
      token: 'da9c79a8-f843-4cc3-b8cf-c107e84335dc'
    },
    url: '/admin/userUpdate',
    method: 'put',
    data: tempData
  })
}

export function delUser(data) {
  return request({
    url: '/admin/del/' + data,
    method: 'DELETE'
  })
}

// export function searchUser(query) {
//   return request({
//     url: '/admin/' + query,
//     method: 'get',
//     params: {
//       phone: query.phone,
//       username: query.username
//     }
//   })
// }

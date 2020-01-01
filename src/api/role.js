import request from '@/utils/request'

export function roleList(query) {
  return request({
    url: '/admin/role/rolePage',
    method: 'get',
    params: query
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
    url: '/admin/role',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/admin/role',
    method: 'put',
    data
  })
}

export function delRole(query) {
  return request({
    url: '/admin/role/' + query,
    method: 'DELETE'
  })
}

export function fetchRoleTree(roleName) {
  return request({
    url: '/admin/menu/roleTree/' + roleName,
    method: 'get'
  })
}

export function permissionUpd(roleId, menuIds) {
  return request({
    url: '/admin/role/roleMenuUpd',
    method: 'put',
    params: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}

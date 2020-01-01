import request from '@/utils/request'
// import {setToken, getToken} from '@/utils/auth.js'

export function login(userAccount, password) {
  const params = new URLSearchParams()
  params.append('userAccount', userAccount)
  params.append('password', password)
  return request.post('/admin/login', params)
}

export function getInfo() {
  return request.post('/admin/info')
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

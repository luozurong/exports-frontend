import Cookies from 'js-cookie'

const TokenKey = 'token'
const NameKey = 'name'
const PhoneKey = 'phone'
const AddRoutersKey = 'addRouter'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setName(name) {
  return Cookies.set(NameKey, name)
}

export function getName() {
  return Cookies.get(NameKey)
}

export function setPhone(phone) {
  return Cookies.set(PhoneKey, phone)
}

export function getPhone() {
  return Cookies.get(PhoneKey)
}

export function setAddRouters(addRouter) {
  return Cookies.set(AddRoutersKey, addRouter)
}

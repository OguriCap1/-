// 引入了操作cookie 相关的包
import Cookies from 'js-cookie'
// 唯一的字符串 ： key
const TokenKey = 'vue_admin_template_token'

// 获取 token 的方法
export function getToken() {
  return Cookies.get(TokenKey)
}

// 将 token 朝 cookie 中存储的方法
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 将 token 从 cookie 中删除的方法
export function removeToken() {
  return Cookies.remove(TokenKey)
}

import router from './router'
import store from './store'
// 提示消息组件
import { Message } from 'element-ui'
// 进度条组件
import NProgress from 'nprogress' // progress bar
// 组读条组件的样式
import 'nprogress/nprogress.css' // progress bar style
// 引入了获取 token 的方法
import { getToken } from '@/utils/auth' // get token from cookie
// 引入设置页面的标题的方法
import getPageTitle from '@/utils/get-page-title'
// 进行了进度条的默认配置
NProgress.configure({ showSpinner: false }) // NProgress Configuration
// 设置白名单列表 ， 这里定义的路由是不需要访问权限的
const whiteList = ['/login'] // no redirect whitelist
// 前置守卫 - 当你页面准备开始跳转之前会执行 如 页面A 跳转到 页面B 的时候会执行
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title 设置页面的标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // 让 获取 token 的方法执行，然后去用常量 hasToken 接受了一下，然后拿着这个常量去判断，当前这个用户是否处于登录状态
  const hasToken = getToken()
  if (hasToken) {
  // token 有值的清空下
    if (to.path === '/login') {
      // 又判断了，你去的路径是登录页吗
      // if is logged in, redirect to the home page
      // 如果你处于登录状态了，就不要再进登录页了，直接重定向到 首页
      next({ path: '/' })
      // 结束进度条效果
      NProgress.done()
    } else {
      // 判断处于登录页面， 但是要去的地方不是登录页
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          // 用来获取用户信息（然后给全局状态里面的 name 和 avatar 做更新）
          await store.dispatch('user/getInfo')
          next() // 有 token ，直接放行
        } catch (error) {
          // 移除 token ，然后去登录页重新登陆
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // 提示一个错误消息
          Message.error(error || 'Has Error')
          // 重定向到 登录页面， 并且记录从哪跳转到登录页的：后续，再登陆成功之后，应该再恢复到之前操作的页面
          next(`/login?redirect=${to.path}`)
          // 让进度条效果关闭
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // 没有 token 的情况下
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      // 你要去的地址如果再白名单里面的话，直接放行
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // 其他页面（有权限的地址）让你重新去登录
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})
// 后置守卫 - 页面跳转之后会执行
router.afterEach(() => {
  // finish progress bar
  // 关闭进度条效果
  NProgress.done()
})

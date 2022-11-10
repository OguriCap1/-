import Vue from 'vue'
// reset.css 重置样式文件
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// ElementUI 组件库
import ElementUI from 'element-ui'
// ElementUI 组件库必备的样式文件
import 'element-ui/lib/theme-chalk/index.css'
// 引入的国际化 文字的种类(哪国的语言)
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 引入工程必备的样式文件
import '@/styles/index.scss' // global css
// 引入根组件
import App from './App'
// 引入 vuex 管理数据
import store from './store'
// 引入 router 路由
import router from './router'
// 一次性注册 icon
import '@/icons' // icon
// 权限控制
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})

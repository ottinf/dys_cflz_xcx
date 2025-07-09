import Vue from 'vue'
import App from './App'
import store from './store'
import './uni.promisify.adaptor'

//弹窗模块
import modal from './utils/modal.js'
//常用方法
import utilDo from './utils/index.js'
//字典
import dictionary from './utils/dictionary'
//接口
import api from './api'
//公共方法
import CommonFunction from './common/CommonFunction'
//权限
import privilege from 'privilege'
Vue.prototype.$store = store
Vue.prototype.$modal = modal
Vue.prototype.$utilDo = utilDo
Vue.prototype.$dict = dictionary
Vue.prototype.$privilege = privilege
Vue.prototype.$api = api
//使用方法实例 this.$api.base.Captcha()
Vue.prototype.$CommonFunction=CommonFunction
Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
    ...App,
    store
})
app.$mount()

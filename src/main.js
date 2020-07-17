import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// 导入request
import request from './utils/request'
Vue.use(request)

const app = new Vue({
  ...App
})
app.$mount()

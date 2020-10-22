import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'


Vue.config.productionTip = false
Vue.use(Antd)

const routes = [
  { path: '/index', component: App },
  // { path: '/bar', component: Bar }
]

new Vue({
  routes, // (缩写) 相当于 routes: routes
  render: h => h(App),
}).$mount('#app')

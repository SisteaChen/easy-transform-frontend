import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Buefy
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
// Element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import iView from 'iview';
import 'iview/dist/styles/iview.css';


// import Quill from 'quill'

// require styles


import base_html from "@/components/base/Base"


Vue.use(iView);
Vue.use(Buefy)
Vue.use(ElementUI)
// Vue.use(Quill)
Vue.use(base_html)

// 注册全局组件
Vue.component('basic_narbar', base_html)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

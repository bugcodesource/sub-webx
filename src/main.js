import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
require(`@/plugins/element-ui`)
require(`@/plugins/clipboard`)
require(`@/plugins/base64`)
require(`@/plugins/particles`)
require(`@/plugins/axios`)
require(`@/plugins/device`)

import '@/icons' // icon
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

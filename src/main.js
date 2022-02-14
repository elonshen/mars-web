import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './axios-config';

Vue.config.productionTip = false
Vue.use(Element)
Vue.use(VueCookies)
new Vue({
  router,
  store,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')




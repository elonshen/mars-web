import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Utils from './utils';
import VueCookies from 'vue-cookies'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false

Vue.use(Element)
Vue.use(Utils);
Vue.use(VueCookies)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')




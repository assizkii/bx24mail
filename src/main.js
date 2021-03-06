import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'

global.browser = require('webextension-polyfill');


import axios from 'axios'

import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);

import store from './store'



Vue.config.productionTip = false;


new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

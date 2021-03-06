import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import { firestorePlugin } from 'vuefire'
import { db } from '@/db'
import VuetifyConfirm from 'vuetify-confirm'
import Notifications from 'vue-notification'
import moment from 'moment';

Vue.use(firestorePlugin)
Vue.use(require('vue-moment'), { moment })
Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: 'Да',
  buttonFalseText: 'Нет',
  color: 'warning',
  icon: 'mdi-alert-circle-outline',
  title: 'Warning',
  width: 350,
  property: '$confirm'
})
Vue.use(Notifications)

Vue.config.productionTip = false

Vue.prototype.$db = db

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

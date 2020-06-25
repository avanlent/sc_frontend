import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueModal from '@kouts/vue-modal'
import EvaIcons from 'vue-eva-icons'
import BurgerButton from 'vue-burger-button'
import Antd from 'ant-design-vue';
import Vue2TouchEvents from 'vue2-touch-events'
import VueMobileDetection from "vue-mobile-detection";

import 'ant-design-vue/dist/antd.less';
import '@kouts/vue-modal/dist/vue-modal.css'
import 'vue-burger-button/dist/vue-burger-button.css'

Vue.use(VueMobileDetection);
Vue.use(Vue2TouchEvents)
Vue.use(EvaIcons)
Vue.component('burger-button', BurgerButton);
Vue.component('Modal', VueModal);
Vue.use(Antd);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.dispatch('user/check');
    window.setInterval(() => {
      this.$store.dispatch('user/check');
    }, 21600000);
  },
}).$mount('#app')

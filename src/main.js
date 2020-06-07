import Vue from 'vue'
import App from './App.vue'
import '@/assets/css/main.css'
import VueEllipsis from 'vue-ellipsis'
import 'es6-promise/auto'
import store from "./store/index";
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import VTooltip from 'v-tooltip'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import OpenIndicator from '@/components/vue-select/OpenIndicator.vue'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';

vSelect.props.components.default = () => ({ OpenIndicator });


Vue.config.productionTip = false
Vue.use(VueEllipsis)
Vue.use(require('vue-moment'));
Vue.use(PerfectScrollbar)
Vue.use(VTooltip)
Vue.component('v-select', vSelect)

Vue.use(VueToast);


Vue.filter('truncate', function (text, stop, clamp) {
  return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
})

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')

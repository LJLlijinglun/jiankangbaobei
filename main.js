import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$cloud = uniCloud.init({
	provider:'aliyun',
	spaceId:'03a765bd-d1cd-4209-84c0-c88b603f6fcb',
	clientSecret:'vyQjusDQVTxP2BlgAxIVkg=='
})
const app = new Vue({
    ...App
})
app.$mount()

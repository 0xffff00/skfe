// ---- Static File of SkFE Archetype v0.1 ----
import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import Routes from './routes'

import App from './app1.vue'
import 'iview/dist/styles/iview.css'
import 'skfe-ui/dist/main.css'
import 'font-awesome/css/font-awesome.css'

import appBuildConf from '../build/app.build.conf'

Vue.use(VueRouter)
Vue.use(iView)

// 开启debug模式
Vue.config.debug = true

// 路由配置
const RouterConfig = {
  mode: 'history',
  routes: Routes
}
const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  window.document.title = (to.meta && to.meta.title) || appBuildConf.title || 'SkFE Project'
  next()
})

router.afterEach(() => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
// eslint-disable-next-line
new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})

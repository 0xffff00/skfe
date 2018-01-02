import RandomTimeGrid from './views/random-time-grid.vue'
import RestApiTest from './views/rest-api-test.vue'

const routes = [
  {
    path: '/time-grid',
    name: 'namename',
    component: RandomTimeGrid,
    meta: {
      title: 'TimeGrid'
    }
  },
  {
    path: '/rest-api',
    name: 'namename',
    component: RestApiTest,
    meta: {
      title: 'Rest API'
    }
  }
]
export default routes

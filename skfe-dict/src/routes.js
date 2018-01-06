import grid from './examples/time-grid-demo.vue'
import editor from './examples/word-editor-demo2.vue'

const routes = [
  // {
  //   path: '/',
  //   component: TimeGridDemo
  // },
  {
    path: '/eg/words/:text/edit',
    component: editor
  },
  {
    path: '/eg/time-grid-demo',
    component: grid,
    meta: {
      title: 'titletitle'
    },
  }
]
export default routes
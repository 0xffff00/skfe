import TimeGridDemo from './example/time-grid-demo.vue'
import WordViewerDemo from './example/word-viewer-demo.vue'
import WordEditor from './views/word-editor.vue'

const routes = [
  {
    path: '/time-grid',
    name: 'namename',
    component: TimeGridDemo,
    meta: {
      title: 'titletitle'
    },
  },
  {
    path: '/words/:text/edit',
    name: 'WordEdit',
    component: WordEditor
  },
  {
    path: '/WordViewerDemo',
    name: 'WordViewerDemo',
    component: WordViewerDemo
  },
  // {
  //   path: '/words/:text/view',
  //   name: 'WordView',
  //   component: WordView
  // }
]
export default routes
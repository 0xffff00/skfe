import grid from './examples/time-grid-demo.vue'
import editor from './examples/word-editor-demo2.vue'
import WordsOverview from './views/words-overview.vue'
import RemoteSearchDemo from './examples/remote-search-demo.vue'

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
  },
  {
    path: '/eg/words-overview',
    component: WordsOverview
  },
  {
    path: '/eg/remote-search',
    component: RemoteSearchDemo
  }
]
export default routes
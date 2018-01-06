import grid from './examples/time-grid-demo.vue'
import editor from './examples/word-editor-demo2.vue'

const routes = [
  {
    path: '/hello',
    name: 'Hello',
    component: Hello
  },
  {
    path: '/album',
    name: 'Album',
    component: Album
  },
  {
    path: '/repo-man',
    name: 'RepoMan',
    component: RepoMan
  },
  {
    path: '/word-man',
    name: 'WordMan',
    component: WordMan
  },
  {
    path: '/words/:text/edit',
    name: 'WordEdit',
    component: WordEdit
  },
  {
    path: '/words/:text/view',
    name: 'WordView',
    component: WordView
  }
]
export default routes
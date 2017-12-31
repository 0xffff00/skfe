import RandomTimeGrid from './views/random2-time-grid.vue'
import WordEditor from './views/word-editor.vue'

const routes = [
    {
        path: '/time-grid',
        name: 'namename',
        component: RandomTimeGrid,
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
    path: '/words/:text/view',
    name: 'WordView',
    component: WordView
  }
]
export default routes
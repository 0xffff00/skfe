import Album3 from './views/album-v3.vue'
import RepoMan from './views/repo-man.vue'

const routes = [
  {
    path: '/album3',
    component: Album3
  },
  {
    path: '/repo-man',
    component: RepoMan
  },
  // {
  //   path: '/word-man',
  //   name: 'WordMan',
  //   component: WordMan
  // },
  // {
  //   path: '/words/:text/edit',
  //   component: WordEdit
  // }
]
export default routes
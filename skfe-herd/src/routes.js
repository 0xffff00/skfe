import Album from './views/album.vue'
import RepoMan from './views/repo-man.vue'

const routes = [
  {
    path: '/album',
    component: Album
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
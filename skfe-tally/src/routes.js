import EditorDemo from './examples/editor-demo.vue'
import BillEditor from './views/basic-editor.vue'

const routes = [
  // {
  //   path: '/',
  //   component: TimeGridDemo
  // },
  {
    path: '/eg/editor-demo',
    component: EditorDemo,
  },
  {
    path: '/bills/:billId/edit',
    component: BillEditor,
    meta:{
      noMenu:true
    }
  }
]
export default routes
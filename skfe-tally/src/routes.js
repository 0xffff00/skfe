import EditorDemo from './examples/editor-demo.vue'
import BillEditor from './views/basic-editor.vue'
import BillMan from './views/bill-man.vue'
import BillsOveriew from './views/bills-overview.vue'
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
    name: 'BillEditor',
    path: '/bills/:billId/edit',
    component: BillEditor,
    meta: {
      noMenu111: true
    }
  },
  {
    name: 'BillMan',
    path: '/bills/manage',
    component: BillMan
  },
  {
    name: 'BillsOveriew',
    path: '/bills/overview',
    component: BillsOveriew
  }
]
export default routes
import EditorDemo from './examples/editor-demo.vue'
import Hello1 from './examples/hello1.vue'
import BillEditor from './views/basic-editor.vue'
import BillMan from './views/bill-man.vue'
import DealsView from './views/deals-view.vue'

const routes = [
  {
    path: '/',
    name: 'Hello1',
    component: Hello1
  },
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
    name: 'DealsView',
    path: '/deals/view',
    component: DealsView
  }
]
export default routes
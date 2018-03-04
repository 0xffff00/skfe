import EditorDemo from './examples/editor-demo.vue'
import Hello1 from './examples/hello1.vue'
import BillEditor from './views/basic-editor.vue'
import DealsEditor from './views/deals-editor.vue'

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
    name: 'DealsEditor',
    path: '/buyers/:buyer/deals',
    component: DealsEditor
  }
]
export default routes
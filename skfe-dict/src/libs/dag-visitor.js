/**
 * HOW-TO use:
 *
 let visitor = new DAGVisitor(edges, edgeToVertex0, edgeToVertex1)
 visitor.visitFrom(vertexStarted)
 return Array.from(visitor.getVerticesVisited())
 */
export default class DAGVisitor {
  constructor (edges, edgeToVertex0, edgeToVertex1) {
    this.edges = edges
    this.edgeToVertex0 = edgeToVertex0
    this.edgeToVertex1 = edgeToVertex1
  }

  visitFrom (root) {
    this.verticesVisited = new Set()
    this._dfs(root)
  }

  getVerticesVisited () {
    return this.verticesVisited
  }

  _dfs (curr) {
    if (!curr || this.verticesVisited.has(curr)) return
    this.verticesVisited.add(curr)
    let nexts = this.edges.filter(e => this.edgeToVertex0(e) === curr).map(this.edgeToVertex1)
    nexts.forEach(next => this._dfs(next))
  }
}

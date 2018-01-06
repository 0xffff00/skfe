import DAGVisitor from './dag-visitor'

/**
 * ---Coding Naming Conventions---
 * ES0, EntSet0: Entity Set shallow
 * ESR, EntSetR: Entity Set recursive
 * RS0, RelSet0: Relation Set shallow
 * RSR, RelSetR: Relation Set recursive
 * RSA, RelSetA: Relation Set assembled
 * RMG: rel map grouped
 */

/**
 * RSR -> ESR
 * @param me
 * @param theRSR RSR
 * @param forward
 * @returns {Array}
 */
function fetchESR (me, theRSR, forward) {
  let visitor = forward
    ? new DAGVisitor(theRSR, r => r.src, r => r.dst)
    : new DAGVisitor(theRSR, r => r.dst, r => r.src)
  visitor.visitFrom(me)
  let res = new Set(visitor.getVerticesVisited())
  res.delete(me)
  return Array.from(res) // Set => arr
}

// utils
const rel2id = rel => rel.src + '-' + rel.attr + '-' + rel.no
const rel2attr = rel => rel.attr + (rel.attrx ? '(' + rel.attrx + ')' : '')
const rel2str = (rel) => {
  if (!rel) return ''
  return rel.key + '[' + rel.attr + '] -->' + rel.val
}
const getMaxNo = (rels) => _.max(rels, r => r.no)
const predMap = {'IS': '是', 'ARE': '仅有', 'HAS': '有'}

export default {fetchESR, rel2attr, rel2id, rel2str, getMaxNo, predMap}

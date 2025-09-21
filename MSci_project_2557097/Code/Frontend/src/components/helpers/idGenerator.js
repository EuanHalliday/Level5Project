
let nodeIdCounter = 0;
export function getNodeId() {
  return `dndnode_${nodeIdCounter++}`;
}

let edgeIdCounter = 0;
export function getEdgeId() {
  return `edge_${edgeIdCounter++}`;
}

export function resetIdCounters() {
  nodeIdCounter = 0;
  edgeIdCounter = 0;
}




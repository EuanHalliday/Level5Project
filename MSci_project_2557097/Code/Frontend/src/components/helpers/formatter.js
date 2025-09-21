export function formatEdgeId(id) {

  return id.includes('_') ? `Edge ${id.split('_')[1]}` : id;
}

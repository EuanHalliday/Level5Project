function getLabel(node) {
    return node?.data?.label || node?.id || "Unnamed";
  }
  
  export function getRoutesForSource(sourceId, nodes, edges, flows, threshold = 0.1) {
    const adj = {};
    edges.forEach((edge) => {
      const flowVal = flows[edge.id];
      if (flowVal !== undefined && flowVal > threshold) {
        if (!adj[edge.source]) {
          adj[edge.source] = [];
        }
        const alreadyExists = adj[edge.source].some((e) => e.target === edge.target);
        if (!alreadyExists) {
          adj[edge.source].push(edge);
        }
      }
    });
  
    const routes = [];
    const visited = new Set();
  
    function dfs(currentId, path) {
      const currentNode = nodes.find((n) => n.id === currentId);
      if (!currentNode) return;
  
      if (currentNode.type === 'sink') {
        routes.push([...path, getLabel(currentNode)].join(' → '));
        return;
      }
  
      visited.add(currentId);
  
      if (adj[currentId]) {
        for (const edge of adj[currentId]) {
          if (!visited.has(edge.target)) {
            dfs(edge.target, [...path, getLabel(currentNode)]);
          }
        }
      }
      visited.delete(currentId);
    }
  
    dfs(sourceId, []);
    return routes.length > 0 ? routes : ["No Route Found"];
  }
  
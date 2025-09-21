import { resetIdCounters, getNodeId, getEdgeId } from './helpers/idGenerator';
import { getAlphabetName } from './helpers/alphaName';

export function blankNetwork() {
  resetIdCounters();
  return {
    nodes: [
      {
        id: getNodeId(),
        type: 'source',
        position: { x: 400, y: 200 },
        data: { label: 'Source Node A', totalFlow: 0, outgoingHandleIds: ['source-0'] },
      },
    ],
    edges: [],
    initial_guess: [],
  };
}

export function pigouNetwork() {
  resetIdCounters();
  const sourceLabel = `Source Node ${getAlphabetName(0)}`;
  const sinkLabel = `Sink Node ${getAlphabetName(0)}`;
  const sourceId = getNodeId();
  const sinkId = getNodeId();
  const nodes = [
    { id: sourceId, type: 'source', position: { x: 100, y: 200 }, data: { label: sourceLabel, totalFlow: 1, outgoingHandleIds: ['source-0'] } },
    { id: sinkId, type: 'sink', position: { x: 500, y: 200 }, data: { label: sinkLabel, incomingHandleIds: ['target-0', 'target-1'] } },
  ];
  const edge1 = getEdgeId();
  const edge2 = getEdgeId();
  const edges = [
    { id: edge1, source: sourceId, target: sinkId, sourceHandle: 'source-0', targetHandle: 'target-0', type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 }, data: { costFunction: '1' } },
    { id: edge2, source: sourceId, target: sinkId, sourceHandle: 'source-0', targetHandle: 'target-1', type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 }, data: { costFunction: 'x' } },
  ];
  const initial_guess = edges.map(() => 1);
  return { nodes, edges, initial_guess };
}

export function braessNetwork() {
  resetIdCounters();
  const sourceAId = getNodeId();
  const nodeAId = getNodeId();
  const nodeBId = getNodeId();
  const sinkAId = getNodeId();
  const nodes = [
    { id: sourceAId, type: 'source', position: { x: -50, y: 150 }, data: { label: 'Source Node A', totalFlow: 1, outgoingHandleIds: ['source-0', 'source-1'] } },
    { id: nodeAId, type: 'node', position: { x: 200, y: 0 }, data: { label: 'Node A', incomingHandleIds: ['target-0'], outgoingHandleIds: ['source-0'] } },
    { id: nodeBId, type: 'node', position: { x: 200, y: 300 }, data: { label: 'Node B', incomingHandleIds: ['target-0'], outgoingHandleIds: ['source-0'] } },
    { id: sinkAId, type: 'sink', position: { x: 450, y: 150 }, data: { label: 'Sink Node A', incomingHandleIds: ['target-0'] } },
  ];
  const edges = [
    { id: getEdgeId(), source: sourceAId, target: nodeAId, sourceHandle: 'source-0', targetHandle: 'target-0', data: { costFunction: 'x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: sourceAId, target: nodeBId, sourceHandle: 'source-1', targetHandle: 'target-0', data: { costFunction: '1' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: nodeAId, target: sinkAId, sourceHandle: 'source-0', targetHandle: 'target-0', data: { costFunction: '1' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: nodeBId, target: sinkAId, sourceHandle: 'source-0', targetHandle: 'target-0', data: { costFunction: 'x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: nodeAId, target: nodeBId, sourceHandle: 'source-0', targetHandle: 'target-0', data: { costFunction: '0' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
  ];
  const initial_guess = edges.map(() => 1);
  return { nodes, edges, initial_guess };
}

export function complexNetwork1() {
  resetIdCounters();
  const source1Id = getNodeId();
  const source2Id = getNodeId();
  const node1Id = getNodeId();
  const node2Id = getNodeId();
  const node3Id = getNodeId();
  const node4Id = getNodeId();
  const sink1Id = getNodeId();
  const sink2Id = getNodeId();
  const nodes = [
    { id: source1Id, type: 'source', position: { x: 50, y: 100 }, data: { label: `Source Node ${getAlphabetName(0)}`, totalFlow: 2, outgoingHandleIds: ['source-0', 'source-1'] } },
    { id: source2Id, type: 'source', position: { x: 50, y: 300 }, data: { label: `Source Node ${getAlphabetName(1)}`, totalFlow: 5, outgoingHandleIds: ['source-0', 'source-1', 'source-2'] } },
    { id: node1Id, type: 'node', position: { x: 250, y: 50 }, data: { label: `Node ${getAlphabetName(0)}`, incomingHandleIds: ['target-0'], outgoingHandleIds: ['source-0', 'source-1'] } },
    { id: node2Id, type: 'node', position: { x: 250, y: 200 }, data: { label: `Node ${getAlphabetName(1)}`, incomingHandleIds: ['target-0', 'target-1'], outgoingHandleIds: ['source-0', 'source-1'] } },
    { id: node3Id, type: 'node', position: { x: 250, y: 350 }, data: { label: `Node ${getAlphabetName(2)}`, incomingHandleIds: ['target-0', 'target-1'], outgoingHandleIds: ['source-0', 'source-1'] } },
    { id: node4Id, type: 'node', position: { x: 250, y: 500 }, data: { label: `Node ${getAlphabetName(3)}`, incomingHandleIds: ['target-0'], outgoingHandleIds: ['source-0'] } },
    { id: sink1Id, type: 'sink', position: { x: 450, y: 150 }, data: { label: `Sink Node ${getAlphabetName(0)}`, incomingHandleIds: ['target-0', 'target-1', 'target-2'] } },
    { id: sink2Id, type: 'sink', position: { x: 450, y: 400 }, data: { label: `Sink Node ${getAlphabetName(1)}`, incomingHandleIds: ['target-0', 'target-1', 'target-2'] } },
  ];
  const edges = [
    { id: getEdgeId(), source: source1Id, target: node1Id, sourceHandle: 'source-0', targetHandle: 'target-0', data: { costFunction: '3*x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: source1Id, target: node2Id, sourceHandle: 'source-1', targetHandle: 'target-0', data: { costFunction: '2*x + 5' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: source2Id, target: node2Id, sourceHandle: 'source-0', targetHandle: 'target-1', data: { costFunction: 'x**2 + 3' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: source2Id, target: node3Id, sourceHandle: 'source-1', targetHandle: 'target-1', data: { costFunction: '4*x**3 - 2*x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: source2Id, target: node4Id, sourceHandle: 'source-2', targetHandle: 'target-0', data: { costFunction: '2*x + 1' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node2Id, target: node3Id, sourceHandle: 'source-1', targetHandle: 'target-0', data: { costFunction: 'x**2 - x + 2' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node1Id, target: sink1Id, sourceHandle: 'source-0', targetHandle: 'target-0', data: { costFunction: '3*x**2 + 2*x - 1' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node1Id, target: sink1Id, sourceHandle: 'source-1', targetHandle: 'target-1', data: { costFunction: '5*x - 3' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node2Id, target: sink1Id, sourceHandle: 'source-0', targetHandle: 'target-2', data: { costFunction: 'x**3 + x**2 - x + 4' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node3Id, target: sink2Id, sourceHandle: 'source-0', targetHandle: 'target-0', data: { costFunction: '2*x**2 + 3' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node4Id, target: sink2Id, sourceHandle: 'source-0', targetHandle: 'target-2', data: { costFunction: 'x + 2' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node3Id, target: sink2Id, sourceHandle: 'source-1', targetHandle: 'target-1', data: { costFunction: '4*x**2 - x + 3' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
  ];
  const initial_guess = edges.map(() => 1);
  return { nodes, edges, initial_guess };
}

export function complexNetwork2() {
  resetIdCounters();
  const source1Id = getNodeId();
  const source2Id = getNodeId();
  const source3Id = getNodeId();
  const node1Id = getNodeId();
  const node2Id = getNodeId();
  const node3Id = getNodeId();
  const node4Id = getNodeId();
  const node5Id = getNodeId();
  const node6Id = getNodeId();
  const node7Id = getNodeId();
  const node8Id = getNodeId();
  const sink1Id = getNodeId();
  const sink2Id = getNodeId();
  const sink3Id = getNodeId();
  const nodes = [
    { id: source1Id, type: 'source', position: { x: 50, y: 100 }, data: { label: `Source Node ${getAlphabetName(0)}`, totalFlow: 15 } },
    { id: source2Id, type: 'source', position: { x: 50, y: 300 }, data: { label: `Source Node ${getAlphabetName(1)}`, totalFlow: 18 } },
    { id: source3Id, type: 'source', position: { x: 50, y: 500 }, data: { label: `Source Node ${getAlphabetName(2)}`, totalFlow: 12 } },
    { id: node1Id, type: 'node', position: { x: 300, y: 100 }, data: { label: `Node ${getAlphabetName(0)}` } },
    { id: node2Id, type: 'node', position: { x: 200, y: 250 }, data: { label: `Node ${getAlphabetName(1)}` } },
    { id: node3Id, type: 'node', position: { x: 350, y: 350 }, data: { label: `Node ${getAlphabetName(2)}` } },
    { id: node4Id, type: 'node', position: { x: 250, y: 500 }, data: { label: `Node ${getAlphabetName(3)}` } },
    { id: node5Id, type: 'node', position: { x: 300, y: 700 }, data: { label: `Node ${getAlphabetName(4)}` } },
    { id: node6Id, type: 'node', position: { x: 500, y: 200 }, data: { label: `Node ${getAlphabetName(5)}` } },
    { id: node7Id, type: 'node', position: { x: 500, y: 400 }, data: { label: `Node ${getAlphabetName(6)}` } },
    { id: node8Id, type: 'node', position: { x: 500, y: 600 }, data: { label: `Node ${getAlphabetName(7)}` } },
    { id: sink1Id, type: 'sink', position: { x: 700, y: 150 }, data: { label: `Sink Node ${getAlphabetName(0)}` } },
    { id: sink2Id, type: 'sink', position: { x: 700, y: 350 }, data: { label: `Sink Node ${getAlphabetName(1)}` } },
    { id: sink3Id, type: 'sink', position: { x: 700, y: 550 }, data: { label: `Sink Node ${getAlphabetName(2)}` } }
  ];
  const edges = [
    { id: getEdgeId(), source: source1Id, target: node1Id, data: { costFunction: 'x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: source1Id, target: node2Id, data: { costFunction: 'x**2' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: source2Id, target: node3Id, data: { costFunction: 'x/2' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: source2Id, target: node2Id, data: { costFunction: '2*x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: source3Id, target: node4Id, data: { costFunction: 'x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: source3Id, target: node5Id, data: { costFunction: 'x**2 - 5' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node1Id, target: node3Id, data: { costFunction: 'x - 2' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node2Id, target: node3Id, data: { costFunction: 'x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node2Id, target: node4Id, data: { costFunction: 'x**2' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node3Id, target: node6Id, data: { costFunction: '2*x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node3Id, target: node7Id, data: { costFunction: 'x/2' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node4Id, target: node7Id, data: { costFunction: 'x**2' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node5Id, target: node8Id, data: { costFunction: '2*x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node4Id, target: node8Id, data: { costFunction: '3*x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node6Id, target: sink1Id, data: { costFunction: 'x**2 - 10' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node7Id, target: sink2Id, data: { costFunction: 'x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node8Id, target: sink3Id, data: { costFunction: 'x - 15' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node7Id, target: sink3Id, data: { costFunction: 'x**2' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node5Id, target: node7Id, data: { costFunction: 'x' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
    { id: getEdgeId(), source: node6Id, target: sink2Id, data: { costFunction: 'x/2' }, type: 'custom', markerEnd: { type: 'arrowclosed' }, style: { stroke: '#000', strokeWidth: 2 } },
  ];
  const initial_guess = edges.map(() => 1);
  return { nodes, edges, initial_guess };
}

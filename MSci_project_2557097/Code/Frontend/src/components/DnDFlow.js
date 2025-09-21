import React, { useRef, useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
} from 'react-flow-renderer';
import Sidebar from './Sidebar';
import { useDnD } from './DnDContext';
import { FaHome } from 'react-icons/fa';
import 'react-flow-renderer/dist/style.css';
import '../index.css';

import SourceNode from './nodes/SourceNode';
import DefaultNode from './nodes/DefaultNode';
import SinkNode from './nodes/SinkNode';
import CostEdge from './edges/CostEdge';

import { getNodeId, getEdgeId, resetIdCounters } from './helpers/idGenerator';
import { getAlphabetName } from './helpers/alphaName';
import ResultsModal from './Modals/ResultsModal';

const nodeTypes = {
  source: SourceNode,
  node: DefaultNode,
  sink: SinkNode,
};

const edgeTypes = {
  custom: CostEdge,
};

const defaultInitialNodes = [
  {
    id: getNodeId(),
    type: 'source',
    position: { x: 400, y: 200 },
    data: { label: 'Source Node A', totalFlow: 0, outgoingHandleIds: ['source-0'] },
  },
];

function DnDFlow({ onHowToUse, predefinedNetwork, onReturnToWelcome }) {
  const reactFlowWrapper = useRef(null);

  const initialNodesState =
    predefinedNetwork?.nodes && predefinedNetwork.nodes.length
      ? predefinedNetwork.nodes
      : defaultInitialNodes;
  const initialEdgesState = predefinedNetwork?.edges || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodesState);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesState);
  const [computationResult, setComputationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { project } = useReactFlow();
  const [type] = useDnD();

  const [sourceCounter, setSourceCounter] = useState(() =>
    initialNodesState.filter((n) => n.type === 'source').length
  );
  const [sinkCounter, setSinkCounter] = useState(() =>
    initialNodesState.filter((n) => n.type === 'sink').length
  );
  const [genericCounter, setGenericCounter] = useState(() =>
    initialNodesState.filter((n) => n.type === 'node').length
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((existingEdges) => {
        const isDuplicate = existingEdges.some(
          (edge) =>
            edge.source === params.source &&
            edge.target === params.target &&
            edge.sourceHandle === params.sourceHandle &&
            edge.targetHandle === params.targetHandle
        );
        if (isDuplicate) return existingEdges;

        const newEdge = {
          ...params,
          id: getEdgeId(),
          type: 'custom',
          markerEnd: { type: 'arrowclosed' },
          style: { stroke: '#000', strokeWidth: 2 },
          data: { costFunction: '' },
        };
        return [...existingEdges, newEdge];
      });
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowWrapper.current) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      let newNode;
      if (type === 'source') {
        const letter = getAlphabetName(sourceCounter);
        setSourceCounter((prev) => prev + 1);
        newNode = {
          id: getNodeId(),
          type: 'source',
          position,
          data: {
            label: `Source Node ${letter}`,
            totalFlow: 0,
            outgoingHandleIds: ['source-0'],
          },
        };
      } else if (type === 'sink') {
        const letter = getAlphabetName(sinkCounter);
        setSinkCounter((prev) => prev + 1);
        newNode = {
          id: getNodeId(),
          type: 'sink',
          position,
          data: {
            label: `Sink Node ${letter}`,
            incomingHandleIds: ['target-0'],
          },
        };
      } else {
        const letter = getAlphabetName(genericCounter);
        setGenericCounter((prev) => prev + 1);
        newNode = {
          id: getNodeId(),
          type: 'node',
          position,
          data: {
            label: `Node ${letter}`,
            incomingHandleIds: ['target-0'],
            outgoingHandleIds: ['source-0'],
          },
        };
      }
      setNodes((nds) => nds.concat(newNode));
    },
    [project, type, setNodes, sourceCounter, sinkCounter, genericCounter]
  );

  const handleDelete = useCallback(() => {
    setNodes((nds) => {
      const remainingNodes = nds.filter((node) => !node.selected);
      setEdges((eds) =>
        eds.filter((edge) => {
          const sourceNode = remainingNodes.find((n) => n.id === edge.source);
          const targetNode = remainingNodes.find((n) => n.id === edge.target);
          if (!sourceNode || !targetNode) return false;
          if (edge.sourceHandle && sourceNode.data?.outgoingHandleIds) {
            if (!sourceNode.data.outgoingHandleIds.includes(edge.sourceHandle)) {
              return false;
            }
          }
          if (edge.targetHandle && targetNode.data?.incomingHandleIds) {
            if (!targetNode.data.incomingHandleIds.includes(edge.targetHandle)) {
              return false;
            }
          }
          return true;
        })
      );
      return remainingNodes;
    });
  }, [setNodes, setEdges]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Delete') {
        handleDelete();
      }
    },
    [handleDelete]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setEdges((eds) =>
      eds.filter((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) return false;
        if (edge.sourceHandle && sourceNode.data?.outgoingHandleIds) {
          if (!sourceNode.data.outgoingHandleIds.includes(edge.sourceHandle)) {
            return false;
          }
        }
        if (edge.targetHandle && targetNode.data?.incomingHandleIds) {
          if (!targetNode.data.incomingHandleIds.includes(edge.targetHandle)) {
            return false;
          }
        }
        return true;
      })
    );
  }, [nodes, setEdges]);

  function getNetworkData() {
    if (nodes.length === 0) throw new Error('No nodes found! Build a network.');
    if (edges.length === 0) throw new Error('No edges found! Connect some nodes.');

    const networkNodes = nodes.map((node) => {
      const nodeObj = { id: node.id, type: node.type };
      if (node.type === 'source') {
        nodeObj.totalFlow = parseFloat(node.data.totalFlow) || 0;
      }
      return nodeObj;
    });

    const networkEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      costFunction: edge.data?.costFunction || 'x',
    }));

    const initial_guess = networkEdges.map(() => 1);
    return { nodes: networkNodes, edges: networkEdges, initial_guess };
  }

  async function handleCompute() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const networkData = getNetworkData();
      const API_URL = process.env.REACT_APP_API_URL || 'https://wardrop-server-930009363948.europe-west1.run.app';

      const response = await fetch(`${API_URL}/calculate-equilibrium`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(networkData),
      });
      
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      console.log('Equilibrium result:', result);
      setComputationResult(result);
    } catch (err) {
      setErrorMessage(`Failed to compute equilibrium: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="dndflow">
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1100 }}>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to return to the welcome page? Your current project will be lost.')) {
              onReturnToWelcome();
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          title="Return to Welcome Page"
        >
          <FaHome size={24} color="white" />
        </button>
      </div>
      <div className="page-title">Wardrop Equilibrium, Social Optimality and PoA Calculator</div>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          defaultZoom={0.6}
          minZoom={0.2}
          maxZoom={2}
        >
          <Controls />
        </ReactFlow>
        <div className="compute-container">
          <button className="compute-button" onClick={handleCompute} disabled={isLoading}>
            {isLoading ? 'Computing...' : 'Compute Wardrop'}
          </button>
          <button
            className="how-to-button"
            onClick={onHowToUse}
            style={{
              marginLeft: 20,
              padding: '10px 20px',
              cursor: 'pointer',
              borderRadius: '8px',
            }}
          >
            How To Use
          </button>
          {errorMessage && (
            <div>
              <div className="error-message">
                <strong>Error:</strong> {errorMessage}
              </div>
              <button className="close-error" onClick={() => setErrorMessage(null)}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
      <Sidebar edges={edges} setEdges={setEdges} />
      {computationResult && (
        <ResultsModal
          onClose={() => setComputationResult(null)}
          results={computationResult}
          nodes={nodes}
          edges={edges}
        />
      )}
    </div>
  );
}

export default DnDFlow;

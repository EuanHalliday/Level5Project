import React, { useEffect, useMemo } from 'react';
import { Handle, Position, useReactFlow, useUpdateNodeInternals } from 'react-flow-renderer';

const SourceNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const onFlowChange = (e) => {
    const newFlow = e.target.value;
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, totalFlow: parseFloat(newFlow) || 0 } }
          : node
      )
    );
  };

  const outgoingHandleIds = useMemo(() => data.outgoingHandleIds || ['source-0'], [data.outgoingHandleIds]);

  useEffect(() => {
    if (!data.outgoingHandleIds) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, outgoingHandleIds } }
            : node
        )
      );
    }
  }, [data.outgoingHandleIds, id, outgoingHandleIds, setNodes]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [outgoingHandleIds, id, updateNodeInternals]);

  const updateOutgoingHandleIds = (newIds) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, outgoingHandleIds: newIds } } : node
      )
    );
  };

  const handleIncreaseOutgoing = (e) => {
    e.stopPropagation();
    if (outgoingHandleIds.length >= 5) return;
    const newHandleId = `source-${outgoingHandleIds.length}`;
    const newIds = [...outgoingHandleIds, newHandleId];
    updateOutgoingHandleIds(newIds);
  };

  const handleDecreaseOutgoing = (e) => {
    e.stopPropagation();
    if (outgoingHandleIds.length <= 1) return;
    const newIds = outgoingHandleIds.slice(0, outgoingHandleIds.length - 1);
    updateOutgoingHandleIds(newIds);
  };

  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: '20%',
        backgroundColor: '#b8ff80',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '5px',
        border: '1px solid #000',
        position: 'relative',
        fontWeight: 'bold',
      }}
    >
      <div style={{ marginBottom: 4 }}>{data.label}</div>
      <input
        type="number"
        value={data.totalFlow || ''}
        onChange={onFlowChange}
        placeholder="Enter Flow"
        style={{ width: 60, textAlign: 'center', fontSize: 12 }}
      />

      {outgoingHandleIds.map((handleId, index) => (
        <Handle
          key={handleId}
          id={handleId}
          type="source"
          position={Position.Right}
          isConnectable={true}
          style={{
            top: `${(index + 1) * (100 / (outgoingHandleIds.length + 1))}%`,
            transform: 'translateY(-50%)',
            background: '#555',
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={handleIncreaseOutgoing}
          style={{
            padding: '2px',
            marginBottom: '-2px',
            fontSize: '8px',
            transform: 'scale(0.6)',
          }}
        >
          ▲
        </button>
        <button
          onClick={handleDecreaseOutgoing}
          style={{
            padding: '2px',
            fontSize: '8px',
            transform: 'scale(0.6)',
          }}
        >
          ▼
        </button>
      </div>
    </div>
  );
};

export default SourceNode;

import React, { useEffect, useMemo } from 'react';
import { Handle, Position, useReactFlow, useStore, useUpdateNodeInternals } from 'react-flow-renderer';

const SinkNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const globalEdges = useStore((state) => state.edges);

  const incomingHandleIds = useMemo(() => data.incomingHandleIds || ['target-0'], [data.incomingHandleIds]);

  useEffect(() => {
    if (!data.incomingHandleIds) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, incomingHandleIds } } : node
        )
      );
    }
  }, [data.incomingHandleIds, id, incomingHandleIds, setNodes]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [incomingHandleIds, id, updateNodeInternals]);

  const updateIncomingHandleIds = (newIds) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, incomingHandleIds: newIds } } : node
      )
    );
  };

  const handleIncreaseIncoming = (e) => {
    e.stopPropagation();
    if (incomingHandleIds.length >= 5) return;
    const newHandleId = `target-${incomingHandleIds.length}`;
    const newIds = [...incomingHandleIds, newHandleId];
    updateIncomingHandleIds(newIds);
  };

  const handleDecreaseIncoming = (e) => {
    e.stopPropagation();
    if (incomingHandleIds.length <= 1) return;
    const newIds = incomingHandleIds.slice(0, incomingHandleIds.length - 1);
    updateIncomingHandleIds(newIds);
  };

  return (
    <div
      key={`sink-${id}-${incomingHandleIds.length}`}
      style={{
        width: 80,
        height: 80,
        borderRadius: '20%',
        backgroundColor: '#f34141',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '5px',
        border: '1px solid #000',
        position: 'relative',
        fontWeight: 'bold',
      }}
    >
      <div>{data.label}</div>
      {incomingHandleIds.map((handleId, index) => (
        <Handle
          key={handleId}
          id={handleId}
          type="target"
          position={Position.Left}
          isConnectable={true}
          style={{
            top: `${(index + 1) * (100 / (incomingHandleIds.length + 1))}%`,
            transform: 'translateY(-50%)',
            background: '#555',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={handleIncreaseIncoming}
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
          onClick={handleDecreaseIncoming}
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

export default SinkNode;

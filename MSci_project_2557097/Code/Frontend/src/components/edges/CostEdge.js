import React from 'react';
import { getBezierPath } from '@xyflow/react';
import { formatEdgeId } from '../helpers/formatter';

export default function CostEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI);

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <g transform={`translate(${labelX}, ${labelY}) rotate(${angle})`}>
        <text
          fill="#000"
          fontSize="10"
          textAnchor="middle"
          dominantBaseline="middle"
          stroke="white"
          strokeWidth="3"
          paintOrder="stroke"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {formatEdgeId(id)}
        </text>
      </g>
    </>
  );
}

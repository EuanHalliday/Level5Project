import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useDnD } from './DnDContext';
import { formatEdgeId } from './helpers/formatter'; 

export default function Sidebar({ edges, setEdges }) {
  const [, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeStyle = {
    width: 80,
    height: 80,
    borderRadius: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    lineHeight: '1.2',
    padding: '5px',
    border: '1px solid #000',
    position: 'relative',
    cursor: 'grab',
    marginBottom: '10px',
    fontWeight: 'bold',
  };

  return (
    <aside>
      <div className="top-container">
        <div className="description">
          <p>You can drag these nodes to the canvas on the Left:</p>
        </div>
        <div
          className="dndnode"
          style={{ ...nodeStyle, backgroundColor: '#b8ff80' }}
          onDragStart={(event) => onDragStart(event, 'source')}
          draggable
        >
          Source Node
        </div>
        <div
          className="dndnode"
          style={{ ...nodeStyle, backgroundColor: '#b3e5fc' }}
          onDragStart={(event) => onDragStart(event, 'node')}
          draggable
        >
          Node
        </div>
        <div
          className="dndnode"
          style={{ ...nodeStyle, backgroundColor: '#f34141' }}
          onDragStart={(event) => onDragStart(event, 'sink')}
          draggable
        >
          Sink Node
        </div>
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
          <p>
            To delete a node or edge, click on it and press <b>Backspace</b> or{' '}
            <b>Delete</b>.
          </p>
        </div>
      </div>

      <div className="bottom-container">
        <h3>All Edges: Cost Function</h3>
        <p>
  Enter cost function as a valid mathematical expression using{' '}
  <strong style={{ fontSize: '1.4em' }}>x</strong> as the variable. The following operators are recommended:
  <br />
  <br />
  <strong style={{ fontSize: '1.4em' }}>+</strong> for addition,{' '}
  <strong style={{ fontSize: '1.4em' }}>-</strong> for subtraction,{' '}
  <strong style={{ fontSize: '1.4em' }}>*</strong> for multiplication,{' '}
  <strong style={{ fontSize: '1.4em' }}>/</strong> for division, and{' '}
  <strong style={{ fontSize: '1.4em' }}>**</strong> for exponentiation.
  <br />
  <br />
  For example: <strong><code>x**2 + 3*x - 5</code></strong> or <strong><code>(x+1)/2</code></strong>.
</p>
<p style={{ fontSize: '12px', color: '#777', marginTop: '8px' }}>
  More advanced operators and functions are available in SymPy. See the{' '}
  <a href="https://docs.sympy.org/latest/modules/core.html#sympy.core.sympify.sympify" target="_blank" rel="noopener noreferrer">
    SymPy documentation
  </a>{' '}
  for details.
</p>

        <div className="edges-container">
          {edges.length === 0 && <p>No edges yet.</p>}
          {edges.map((edge) => {
            const costFunction = edge.data?.costFunction || '';
            return (
              <div key={edge.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ display: 'inline-block', width: 60, textAlign: 'right', marginRight: 8 }}>
                  {formatEdgeId(edge.id)}:
                </span>
                <input
                  type="text"
                  value={costFunction}
                  onChange={(e) => {
                    const newCost = e.target.value;
                    setEdges((eds) =>
                      eds.map((ed) =>
                        ed.id === edge.id
                          ? { ...ed, data: { ...ed.data, costFunction: newCost } }
                          : ed
                      )
                    );
                  }}
                  style={{ width: 125, marginRight: 4 }}
                />
                <button
                  onClick={() => setEdges((eds) => eds.filter((ed) => ed.id !== edge.id))}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                  title="Delete Edge"
                >
                  <FaTrash />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

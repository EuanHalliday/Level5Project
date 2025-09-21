import React from 'react';
import Draggable from 'react-draggable';

export default function HowToUseModal({ onClose }) {
  return (
    <Draggable handle=".modal-header">
      <div
        style={{
          position: 'fixed',
          top: '25%',
          left: '25%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          paddingBottom: '10px',
          fontFamily: 'monospace'
        }}
      >
        <div
          className="modal-header"
          style={{
            cursor: 'move',
            padding: '10px',
            backgroundColor: '#f2f2f2',
            borderBottom: '1px solid #ccc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <strong>How to Use</strong>
          <button
            onClick={onClose}
            style={{
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              fontSize: '1.2rem',
            }}
          >
            &times;
          </button>
        </div>
        <div style={{ padding: '10px' }}>
        <ul>
  <li>
    <strong>Placing Nodes:</strong> Drag a node from the sidebar and drop it onto the canvas.
  </li>
  <br></br>
  <li>
    <strong>Connecting Nodes:</strong> Connect the node handles to create edges:
    <ul>
      <li>
        The left-side handles are for <em>incoming</em> edges, and the right-side handles are for <em>outgoing</em> edges.
      </li>
      <li>
        Each node supports up to 5 handles per side, which typically provides sufficient spacing for clarity. These handles are needed if you want to create parallel edges between the same two nodes.
      </li>
      <li>
        To create separate edges between the same pair of nodes, ensure at least one edge uses a different handle (either incoming or outgoing) from the other edge.
      </li>
    </ul>
  </li>
  <br></br>
  <li>
    <strong>Cost Functions:</strong> Enter a valid cost function (using <code>x</code> as the variable) in the sidebar for each edge.
  </li>

  <br></br>

  <li> <strong>Computation of Results:</strong> Click the "Compute" button at the bottom left of your project. A modal will appear displaying the edge flows for both Wardrop Equilibrium and Social Optimality, as well as overall network metrics—including total costs and Price of Anarchy (PoA). You can also view the routes that can be taken from each source. </li>
</ul>

          <button
            onClick={onClose}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Draggable>
  );
}

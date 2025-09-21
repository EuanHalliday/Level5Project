import React from 'react';
import Draggable from 'react-draggable';
import { formatEdgeId } from '../helpers/formatter';
import { getRoutesForSource } from '../helpers/routeFinder'; 

function getLabel(node) {
  return node?.data?.label || node?.id || "Unnamed";
}

function ResultsModal({ onClose, results, nodes, edges }) {
  const sortedEdgeKeys = Object.keys(results.flows.equilibrium_flow).sort((a, b) => {
    const numA = parseInt(a.replace(/[^\d]/g, ''), 10);
    const numB = parseInt(b.replace(/[^\d]/g, ''), 10);
    return numA - numB;
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Draggable handle=".modal-header">
        <div
          style={{
            width: '600px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            maxHeight: '80vh',
            overflowY: 'auto',
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
            <strong>Computation Results</strong>
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
            <div>
              <h3 style={{ textDecoration: 'underline' }}>Edge Flows</h3>
              <ul>
                {sortedEdgeKeys.map((edgeId) => (
                  <li key={edgeId}>
                    <strong>{formatEdgeId(edgeId)}</strong>: Equilibrium Flow = {results.flows.equilibrium_flow[edgeId]}, Social Optimal Flow = {results.flows.social_optimal_flow[edgeId]}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ textDecoration: 'underline' }}>Network Summary</h3>
              <p>
                <strong>Equilibrium Total Cost:</strong> {results.network.equilibrium_total_cost}
              </p>
              <p>
                <strong>Social Optimal Total Cost:</strong> {results.network.social_optimal_total_cost}
              </p>
              <p>
                <strong>Price of Anarchy:</strong> {results.network.price_of_anarchy}
              </p>
            </div>
            {results.results && (
              <div>
                <h3 style={{ textDecoration: 'underline' }}>Source Routes</h3>
                {Object.entries(results.results).map(([sourceId, sourceData]) => {
                  const node = nodes.find((n) => n.id === sourceId);
                  const label = getLabel(node);
                  const routes = getRoutesForSource(
                    sourceId,
                    nodes,
                    edges,
                    results.flows.equilibrium_flow
                  );

                  return (
                    <div key={sourceId}>
                      <h4 style={{ textDecoration: 'underline' }}>{label}</h4>
                      <p>
                        <strong>Total Flow:</strong> {sourceData.totalFlow}
                      </p>
                      <div>
                        <h5 style={{ textDecoration: 'underline' }}>Possible Routes</h5>
                        <ul>
                          {(sourceData.possible_routes || routes).map((route, idx) => (
                            <li key={idx}>{route}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Draggable>
    </div>
  );
}

export default ResultsModal;

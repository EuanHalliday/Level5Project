import React from 'react';
import '../index.css';

export default function WelcomePage({ onStart, onHowToUse, predefinedNetworks }) {
  return (
    <div className="welcome-container">
      <h1 className='head'>Welcome to the Wardrop Equilibrium, Social Optimality and PoA Calculator</h1>

      
      <div>
        <p>Start a new blank network:</p>
        <button
          className="compute-button"
          onClick={() => onStart(predefinedNetworks.blankNetwork)}
        >
          Blank Project
        </button>
      </div>
      
      <p>or choose one of the predefined examples:</p>
      <div className="button-group">
        <button
          className="compute-button"
          onClick={() => onStart(predefinedNetworks.pigouNetwork)}
        >
          Pigou Network
        </button>
        <button
          className="compute-button"
          onClick={() => onStart(predefinedNetworks.braessNetwork)}
        >
          Braess Network
        </button>
        <button
          className="compute-button"
          onClick={() => onStart(predefinedNetworks.complexNetwork1)}
        >
          Complex Network 1
        </button>
        <button
          className="compute-button"
          onClick={() => onStart(predefinedNetworks.complexNetwork2)}
        >
          Complex Network 2
        </button>
      </div>
      <button className="how-to-button" onClick={onHowToUse}>
        How to Use
      </button>
    </div>
  );
}

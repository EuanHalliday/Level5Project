import React, { useState } from 'react';
import DnDFlow from './components/DnDFlow';
import WelcomePage from './components/WelcomePage';
import HowToUseModal from './components/Modals/HowToUseModal';
import { ReactFlowProvider } from 'react-flow-renderer';
import { DnDProvider } from './components/DnDContext';
import {
  blankNetwork,
  pigouNetwork,
  complexNetwork1,
  complexNetwork2,
  braessNetwork,
} from './components/predefinedNetworks';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [networkConfig, setNetworkConfig] = useState(null);

  const handleStart = (configFn) => {
    setNetworkConfig(configFn());
    setShowWelcome(false);
    setShowTutorial(false);
  };

  const handleHowToUse = () => {
    setShowTutorial(true);
  };

  const handleReturnToWelcome = () => {
    setShowWelcome(true);
    setNetworkConfig(null);
  };

  if (showWelcome) {
    return (
      <>
        <WelcomePage
          onStart={handleStart}
          onHowToUse={handleHowToUse}
          predefinedNetworks={{
            blankNetwork,
            pigouNetwork,
            complexNetwork1,
            complexNetwork2,
            braessNetwork,
          }}
        />
        {showTutorial && <HowToUseModal onClose={() => setShowTutorial(false)} />}
      </>
    );
  }

  return (
    <ReactFlowProvider>
      <DnDProvider>
        {showTutorial && <HowToUseModal onClose={() => setShowTutorial(false)} />}
        <DnDFlow
          predefinedNetwork={networkConfig}
          onHowToUse={() => setShowTutorial(true)}
          onReturnToWelcome={handleReturnToWelcome}
        />
      </DnDProvider>
    </ReactFlowProvider>
  );
}

export default App;

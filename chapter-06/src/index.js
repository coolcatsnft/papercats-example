import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { PaperCatsContractProvider } from './context/PaperCatsContract';
import { Web3Provider } from './context/Web3';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Web3Provider>
      <PaperCatsContractProvider>
        <App />
      </PaperCatsContractProvider>
    </Web3Provider>
  </React.StrictMode>
);
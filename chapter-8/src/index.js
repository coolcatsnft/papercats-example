import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { PaperCatsContractProvider } from './context/PaperCatsContract';
import { PaperCatsDataProvider } from './context/PaperCatsData';
import { Web3Provider } from './context/Web3';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Web3Provider>
      <PaperCatsContractProvider>
        <PaperCatsDataProvider>
          <App />
        </PaperCatsDataProvider>
      </PaperCatsContractProvider>
    </Web3Provider>
  </React.StrictMode>
);
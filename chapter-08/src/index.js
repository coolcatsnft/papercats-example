import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { PaperCatsContractProvider } from './context/PaperCatsContract';
import { PaperCatsDataProvider } from './context/PaperCatsData';
import { Web3Provider } from './context/Web3';

export const PAPER_CATS_CONTRACT = '0xB574BC3b58fED191846D678fB1B0127d35832e9A';

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
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { Web3Provider } from './context/Web3';
import { PaperCatsProvider } from './context/PaperCats';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Web3Provider>
    <PaperCatsProvider>
      <App />
    </PaperCatsProvider>
  </Web3Provider>
);

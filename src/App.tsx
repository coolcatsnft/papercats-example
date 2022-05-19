import React from 'react';
import MintPaperCat from './components/MintPaperCat';
import { PaperCats } from './components/PaperCats';
import Web3Button from './components/Web3Widget';

function App() {
  return (
    <div className="App">
      <Web3Button />
      <MintPaperCat amount={1} />
      <MintPaperCat amount={2} />
      <MintPaperCat amount={3} />
      <PaperCats />
    </div>
  );
}

export default App;

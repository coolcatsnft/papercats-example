import React, { useEffect } from 'react';
import DarkModeToggle from './components/DarkModeToggle';
import Intro from './components/Intro';
import MintPaperCat from './components/MintPaperCat';
import { PaperCats } from './components/PaperCats';
import Web3Button from './components/Web3Widget';
import useWatchLocalStorage from './hooks/useWatchLocalStorage';

function App() {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = useWatchLocalStorage('theme', defaultDark ? 'dark' : 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme.value);
  }, [theme])

  return (
    <div className="App">
      <Intro />
      <Web3Button />
      <MintPaperCat amount={1} />
      <MintPaperCat amount={2} />
      <MintPaperCat amount={3} />
      <DarkModeToggle />
      <PaperCats />
    </div>
  );
}

export default App;

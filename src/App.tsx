import { useEffect } from 'react';
import DarkModeToggle from './components/DarkModeToggle';
import Intro from './components/Intro';
import MintPaperCat from './components/MintPaperCat';
import { PaperCats } from './components/PaperCats';
import Web3Button from './components/Web3Widget';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [theme] = useDarkMode();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
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

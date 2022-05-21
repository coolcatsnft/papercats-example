import { useEffect } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import DarkModeToggle from './components/DarkModeToggle';
import Intro from './components/Intro';
import MintButtons from './components/MintButtons';
import MintingCat from './components/MintingCat';
import Nav from './components/Nav';
import PaperCats from './components/PaperCats';
import Web3Button from './components/Web3Widget';

function App() {
  const [theme] = useDarkMode();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme])

  return (
    <>
      <MintingCat />
      <div className="App">
        <Nav>
          <Web3Button />
          <DarkModeToggle />
        </Nav>
        <Intro />
        <MintButtons />
        <PaperCats />
      </div>
    </>
  );
}

export default App;

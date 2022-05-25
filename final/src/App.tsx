import { useEffect } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import DarkModeToggle from './components/DarkModeToggle/DarkModeToggle';
import Intro from './components/Intro/Intro';
import MintButtons from './components/MintButtons/MintButtons';
import MintingCat from './components/MintingCat/MintingCat';
import Nav from './components/Nav/Nav';
import PaperCats from './components/PaperCat/PaperCats';
import Web3Widget from './components/Web3Widget/Web3Widget';
import DiscoModeToggle from './components/DiscoModeToggle/DiscoModeToggle';

function App() {
  const [theme] = useDarkMode();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }, [theme])

  return (
    <>
      <MintingCat />
      <div className="App">
        <Nav>
          <Web3Widget />
          <DarkModeToggle />
          <DiscoModeToggle />
        </Nav>
        <Intro />
        <MintButtons />
        <PaperCats />
      </div>
    </>
  );
}

export default App;

import { useEffect } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import { createGlobalStyle } from 'styled-components';
import { device } from './utils/device';

import DarkModeToggle from './components/DarkModeToggle/DarkModeToggle';
import Intro from './components/Intro/Intro';
import MintButtons from './components/MintButtons/MintButtons';
import MintingCat from './components/MintingCat/MintingCat';
import Nav from './components/Nav/Nav';
import PaperCats from './components/PaperCat/PaperCats';
import Web3Widget from './components/Web3Widget/Web3Widget';
import DiscoModeToggle from './components/DiscoModeToggle/DiscoModeToggle';
import { useWeb3 } from './context/Web3';

function App() {
  const { address } = useWeb3();
  const [theme] = useDarkMode();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }, [theme])

  return (
    <>
      <GlobalStyle />
      <MintingCat />
      <div className="App">
        <Nav>
          <Web3Widget />
          <DarkModeToggle />
          {address && <DiscoModeToggle />}
        </Nav>
        <Intro />
        <MintButtons />
        <PaperCats />
      </div>
    </>
  );
}

export default App;

const GlobalStyle = createGlobalStyle`
  :root {
    --background: white;
    --text-primary: #222;
    --text-secondary: #555;
    --border-primary: #222;
    --background-inverse: #222;
    --disabled: #999;
    --global-margin: 16px;
    --global-padding: 16px;
    --toggle-button-width: 90px;
    --toggle-button-padding: calc(var(--global-padding) * 0.25);
    --toggle-button-height: 22px;

    --border-width: 2px;
    --border-radius: 5px;

    --button-primary: #666;
    --button-secondary: #888;
    --button-text-primary: white;
    --button-height: calc(var(--toggle-button-height) + calc(var(--toggle-button-padding) * 2) + calc(var(--border-width) * 2));
    --button-background: var(--button-primary);
    --button-background-active: var(--button-secondary);
  }

  [data-theme='dark'] {
    --background: #222;
    --text-primary: white;
    --text-secondary: #bbb;
    --border-primary: #444;
    --background-inverse: white;

    --button-text-primary: #EEE;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--background);
    color: var(--text-primary);
    transition: all 0.2s;

    &,
    * {
      &,
      &:before,
      &:after {
        box-sizing: border-box;
      }
    }
  }

  .App {
    max-width: 1320px;
    margin: 0 auto;
    padding: var(--global-padding);

    @media ${device.maxwidth} {
      padding: var(--global-padding) 0;
    }

    ul li a,
    ol li a,
    p a {
      &:not(.button) {
        color: var(--text-secondary);
      }
    }

    web3-button {
      padding-top: calc(var(--button-height) + var(--global-margin));
      display: block;

      button {
        width: 100%;
      }
      @media ${device.tablet} {
        padding-top: 0;
        button {
          width: auto;
        }
      }
    }
  }

  button {
    appearance: none;
    min-height: var(--button-height);
    padding: var(--toggle-button-padding) var(--global-padding);
    border: var(--border-width) solid var(--border-primary);
    border-radius: var(--border-radius);
    background-color: var(--button-background);
    color: var(--button-text-primary);
    text-decoration: none;
    text-transform: uppercase;
    transition: all 0.1s;
    font-size: 75%;
    cursor: pointer;
    position: relative;
    font-weight: bold;
  
    &[disabled] {
      cursor: not-allowed;
      background-color: var(--disabled);
    }
  
    &:after {
      content: "";
      position: absolute;
      display: block;
      height: calc(100% - var(--border-width));
      width: calc(100% - var(--border-width));
      top: 0;
      left: 0;
      bottom: auto;
      right: auto;
      border-radius: var(--border-radius);
      border-top: var(--border-width) solid var(--button-secondary);
      border-left: var(--border-width) solid var(--button-secondary);
    }
  
    &:active {
      &:not([disabled]) {
        padding-bottom: 2px;
        &:after {
          border: 0 none;
          border-bottom: var(--border-width) solid var(--button-secondary);
          border-right: var(--border-width) solid var(--button-secondary);
          top: auto;
          left: auto;
          bottom: 0;
          right: 0;
        }
      }
    }
  }
`;
import { useDarkMode } from '../../hooks/useDarkMode';
import Toggle from '../Toggle/Toggle';

import './DarkModeToggle.scss';

export function DarkModeToggle() {
  const [theme, setTheme] = useDarkMode();

  return (
    <Toggle currentValue={theme} setter={setTheme} onValue="dark" offValue="light" className="darkmode" label="Toggle Dark Mode" />
  )
}

export default DarkModeToggle;

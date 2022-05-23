import { useDarkMode } from '../../hooks/useDarkMode';

import './DarkModeToggle.scss';

export function DarkModeToggle() {
  const [theme, setTheme] = useDarkMode();

  return (
    <label className="toggle darkmode" data-theme={theme}>
      <input
        type="checkbox"
        checked={theme === 'dark'}
        onChange={(ev) => {
          setTheme(ev.target.checked ? 'dark' : 'light');
        }}
      />
      Toggle Dark Mode
    </label>
  )
}

export default DarkModeToggle;

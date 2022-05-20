import useLocalStorage from '../hooks/useLocalStorage';
import useWatchLocalStorage from '../hooks/useWatchLocalStorage';

export function DarkModeToggle() {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage<string>('theme', defaultDark ? 'dark' : 'light');
  const darkMode = useWatchLocalStorage('theme', defaultDark ? 'dark' : 'light');

  return (
    <label data-theme={darkMode.value}>
      <input
        type="checkbox"
        checked={theme === 'dark'}
        onChange={(ev) => {
          setTheme(ev.target.checked ? 'dark' : 'light');
        }}
      />{' '}
      Dark
    </label>
  )
}

export default DarkModeToggle;

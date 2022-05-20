import useLocalStorage from "./useLocalStorage";

export function useDarkMode() {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return useLocalStorage<string>('theme', defaultDark ? 'dark' : 'light');
}
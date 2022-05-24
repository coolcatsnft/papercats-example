import useLocalStorage from "./useLocalStorage";

export function useDiscoMode() {
  return useLocalStorage<string>('disco', 'off');
}
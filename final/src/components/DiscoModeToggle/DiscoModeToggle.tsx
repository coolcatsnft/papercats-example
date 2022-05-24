import { useDiscoMode } from '../../hooks/useDiscoMode';
import Toggle from '../Toggle/Toggle';

import './DiscoMode.scss';

export function DiscoModeToggle() {
  const [discoMode, setDiscoMode] = useDiscoMode();

  return (
    <Toggle currentValue={discoMode} setter={setDiscoMode} onValue="on" offValue="off" className="discomode" label="Toggle Dark Mode" />
  )
}

export default DiscoModeToggle;

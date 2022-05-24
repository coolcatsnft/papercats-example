
import './Toggle.scss';

interface IToggle {
  currentValue: string,
  setter: Function,
  onValue: string,
  offValue: string,
  label: string,
  className?: string
}

export function Toggle({ 
  currentValue, 
  setter, 
  onValue, 
  offValue, 
  label, 
  className = ""
}: IToggle
) {
  const classNames = ['toggle', className];
  return (
    <label className={classNames.filter(c => c).join(' ')} data-checked={currentValue === onValue ? 'on' : 'off'}>
      <input
        type="checkbox"
        checked={currentValue === onValue}
        onChange={(ev) => {
          setter(ev.target.checked ? onValue : offValue);
        }}
      />
      {label}
    </label>
  )
}

export default Toggle;

import styled from 'styled-components';

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
    <ToggleLabel className={classNames.filter(c => c).join(' ')} data-checked={currentValue === onValue ? 'on' : 'off'}>
      <input
        type="checkbox"
        checked={currentValue === onValue}
        onChange={(ev) => {
          setter(ev.target.checked ? onValue : offValue);
        }}
      />
      {label}
    </ToggleLabel>
  )
}

export default Toggle;

const ToggleLabel = styled.label`
  background-color: rgba(255, 255, 255, 0.56);
  border-radius: var(--border-radius);
  overflow: hidden;
  width: var(--toggle-button-width);
  height: var(--button-height);
  padding: var(--toggle-button-padding);
  text-indent: -9999px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  border: var(--border-width) solid var(--border-primary);

  & + .toggle {
    right: calc(var(--toggle-button-width) + var(--global-margin));
  }

  &[data-checked="on"] {
    background-color: var(--button-primary);
  }
  
  &.discomode {
    &:before {
      content: "Off";
    }

    &:after {
      content: "Disco";
    }
  }
  
  &.darkmode {
    &:before {
      content: "Light";
    }
  
    &:after {
      content: "Dark";
    }
  }

  > input,
  &:before,
  &:after {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
    pointer-events: none;
    text-indent: 0;
  }

  &:before,
  &:after {
    font-size: 9px;
    text-transform: uppercase;
  }

  &:before {
    left: 0;
  }

  &:after {
    right: 0;
  }

  input {
    appearance: none;
    z-index: 1;
    background: var(--background-inverse);
    border: 0 none;
    transition: transform 300ms linear;
    margin: 2px;
    border-radius: inherit;
    transform: translateX(calc(var(--toggle-button-padding) * -1));

    &:checked {
      transform: translateX(calc(100% - (var(--toggle-button-padding) + (2px * 2))));
    }
  }
`;
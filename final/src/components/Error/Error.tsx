import { useEffect, useState } from "react";
import styled from 'styled-components';
import { device } from '../../utils/device';
import { usePaperCats } from "../../hooks/usePaperCats";

export function Error() {
  const { error } = usePaperCats();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => {
        setVisible(false);
      }
    }
  }, [error]);

  const getTranslatedError = () => {
    if (error?.message) {
      return error.message.split('MetaMask Tx Signature: ').join('');
    }

    return error?.toString();
  }

  return (
    <StyledError className={`error${visible ? ' visible' : ''}`}>
      <p>{ error && <>{getTranslatedError()}</> }</p>
    </StyledError>
  );
}

export default Error;

const StyledError = styled.div`
  position: fixed;
  top: -59px;
  width: 100%;
  left: 0;
  text-align: center;
  background: #b50e0e;
  border: 3px solid black;
  border-top: 0 none;
  color: white;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  transition: all 0.2s ease-in-out;
  z-index: 3;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  @media ${device.tablet} {
    left: calc(50% - 200px);
    max-width: 400px;
  }

  p {
    margin: 0;
    padding: var(--global-padding);
    border-bottom: 3px solid darkred;
    border-right: 3px solid darkred;
    border-bottom-left-radius: calc(var(--border-radius) * 0.25);
    border-bottom-right-radius: calc(var(--border-radius) * 0.25);
    font-weight: bold;
  }

  &.visible {
    top: 0;
  }
`;
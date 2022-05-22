import { useEffect, useState } from "react";
import { usePaperCats } from "../hooks/usePaperCats";

import './Error.scss';

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
    <div className={`error${visible ? ' visible' : ''}`}>
      <p>{ error && <>{getTranslatedError()}</> }</p>
    </div>
  );
}

export default Error;

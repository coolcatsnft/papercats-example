import React, { useEffect } from "react";
import { envDefault } from "../../utils";

export function Web3ButtonComponent() {
  useEffect(() => {
    const id = 'web3-button-script';
    if (!document.getElementById(id)) {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.id = id;
      s.innerHTML = `(function(w, d, s, o, f, js, fjs) {
        w['web3-widget'] = o;
        w[o] = w[o] || function() {
          (w[o].q = w[o].q || []).push(arguments);
        };
        js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
        js.id = o;
        js.src = f;
        js.async = 1;
        fjs.parentNode.insertBefore(js, fjs);
      }(window, document, 'script', 'mw', 'https://coolcatsnft.github.io/web3-widget/main.js'));
      mw('NETWORK_ID', ${envDefault('REACT_APP_NETWORKID', 4)});`;
      document.body.appendChild(s);
    }
  }, []);
  
  return React.createElement('web3-button', { }, null);
}

export default React.memo(Web3ButtonComponent);

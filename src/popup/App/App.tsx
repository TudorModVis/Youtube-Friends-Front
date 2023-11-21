import './App.css';
import { useState } from 'react';

import FriendsActivity from '../FriendsActivity/FriendsActivity';
import LogIn from '../LogIn/LogIn';

const browser = require("webextension-polyfill");

const App: React.FC = () => {
  const [status, setStatus] = useState(('logged-in'));
  const [isChecking, setChecking] = useState(true);
  

  browser.identity.getAuthToken({interactive: false}, function(token : string) {
    if (browser.runtime.lastError) {
      setChecking(false);
      setStatus('logged-out');
    } else {
      setChecking(false);
    }

    // var url = 'https://accounts.google.com/o/oauth2/revoke?token=' + token;
    // window.fetch(url);

    // browser.identity.removeCachedAuthToken({token: token}, function (){
    //   alert('removed');
    // });

  });

  if (isChecking) {
    return <div>Checking...</div>
  }

  if (status === 'logged-out') {
    return <LogIn setStatus={setStatus} />
  } else {
    return <FriendsActivity />
  }
}

export default App;
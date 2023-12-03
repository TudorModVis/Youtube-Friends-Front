import './App.css';
import { useState, useEffect } from 'react';

import FriendsActivity from '../FriendsActivity/FriendsActivity';
import LogIn from '../LogIn/LogIn';
import { storage } from 'webextension-polyfill';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [isChecking, setChecking] = useState(true);

  useEffect(() => {
    fetch('https://youtube-friends.onrender.com/api/check-user')
    .then((res) =>  {
      if (res.status === 401) {
        setChecking(false)
        setLoggedIn(false)
      } else {
        storage.local.get('userData').then(user => {
          if (user.userData === undefined) {
            fetch('https://youtube-friends.onrender.com/api/get-user').then(res => res.json()).then(data => {
              storage.local.set({
                "userData" : JSON.stringify(data)
              });
              setChecking(false)
            });

          } else {
            setChecking(false)
          }
        })
      }
    })
      .catch(error => {
        console.error("User is not logged in");
      });
  }, []);

  if (isChecking) {
    return <div>Checking...</div>
  }

  if (!loggedIn) {
    return <LogIn setLoggedIn={setLoggedIn} />
  } 

  return <FriendsActivity />
  
}

export default App;
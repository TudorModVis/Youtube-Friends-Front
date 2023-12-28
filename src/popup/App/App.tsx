import './App.css';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { storage } from 'webextension-polyfill';

const App: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('https://youtube-friends.onrender.com/api/check-user')
    .then((res) =>  {
      if (res.status === 401) {
        setLoggedIn(false);
      } else {
        storage.local.get('userData').then(user => {
          if (user.userData === undefined) {
            fetch('https://youtube-friends.onrender.com/api/get-user').then(res => res.json()).then(data => {
              storage.local.set({
                "userData" : JSON.stringify(data)
              });
            });
          }
        });
        setLoggedIn(true);
      }
    })
      .catch(error => {
        console.error(error);
      });
  }, []);

  if (isLoggedIn === null) {
    return <div>Checking...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <Navigate to="/activity" />;
}

export default App;
import { storage } from 'webextension-polyfill';
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

import Menu from './Menu';
import Header from './Header';
import Home from '../Home/Home';
import AddFriends from '../AddFriends/AddFriends';
import FriendRequests from '../FriendRequests/FriendRequests';

const FriendsActivity: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null)
  // State to determine which page to render
  const [page, setPage] = useState('home');
  // State to track new friend requests
  const [newFriendRequests, setNewFriendRequests] = useState(false);

  useEffect(() => {
    storage.local.get("userData").then((user) => {
      const rawUserData = JSON.parse(user.userData);
      setUserData(rawUserData);
      const url = 'https://youtube-friends.onrender.com/?id=' + rawUserData.id + '&scope=main';
      const localSocket = io(url);
      setSocket(localSocket);

      const checkForNewRequests = () => {
        fetch(`https://youtube-friends.onrender.com/api/check-received-requests?id=${rawUserData.id}`)
        .then((res) => res.json())
        .then((data) => {
          setNewFriendRequests(data.check);
        })
          .catch(error => console.error('Error:', error));
      }

      checkForNewRequests();

      localSocket.on('new-request-received', () => {
        checkForNewRequests();
      });
      
    });
  }, []);

  const setNewFriendRequestsToFalse = () => {
    setNewFriendRequests(false);
  }
  
  if (userData === null || socket === null) {
    return <div>Loading...</div>
  }

  const pageToRender = () => {
    switch (page) {
      case 'add-friends': return(
        <AddFriends userId={userData.id} socket={socket}/>
      );
      case 'home': return(
        <Home socket={socket} {...userData}/>
      );
      case 'friend-requests': return (
        <FriendRequests userId={userData.id} socket={socket} setNewFriendRequestsToFalse={setNewFriendRequestsToFalse}/>
      );
    }
  };

  return (
    <>
      <img src="../images/header/bg-gradient.png" alt="background color" className="absolute w-full h-full object-cover -z-10 left-0 top-0"/>
      <Header image={userData.image}/>
      {pageToRender()}
      <Menu setPage={setPage} page={page} newFriendRequests={newFriendRequests}/>
    </>
  );
}

export default FriendsActivity;
import { storage, tabs } from 'webextension-polyfill';
import { useState, useEffect, useCallback } from 'react';
import Header from '../Shared/Header';
import Title from '../Shared/Title';
import Activity from '../Shared/Activity';
import { io } from 'socket.io-client';


interface Friend {
  email: String,
  firstname: string,
  lastname: string | undefined,
  image: string,
  video: {
    id: string,
    time: number,
    active: boolean,
    lastUpdate: number
  }
}

const FriendsActivity: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    storage.local.get("userData").then((user) => {
      const rawUserData = JSON.parse(user.userData);
      setUserData(rawUserData);
      const url = 'http://localhost:4030?id=' + rawUserData.id;
      const socket = io(url);
      socket.on('video-update', () => {
        fetch(`http://localhost:4030/api/get-friends?id=${rawUserData.id}`)
            .then((res) => res.json())
            .then((data) => {
              setData(data);
            })
            .catch(error => console.error('Error:', error));
      });
      socket.on('new-friend', (roomId) => {
        console.log('new friend', roomId);
          socket.emit('add-friend', roomId);
      });

      fetch(`http://localhost:4030/api/get-friends?id=${rawUserData.id}`)
            .then((res) => res.json())
            .then((data) => {
              setData(data);
            })
            .catch(error => console.error('Error:', error));
    });
  }, []);
  
  if (userData === null || data === null) {
    return <div>Loading...</div>
  }

  return (
    <>
      <img src="../images/bg-light.png" alt="background color" className="absolute w-full h-full object-cover -z-10 left-0 top-0"/>
      <Header image={userData.image}/>
      <Title title1="FRIEND ACTIVITIES" title2='ON YOUTUBE' subtitle="Be friends on youtube too"/>
      {data.map((element: Friend, index: number) => {
        return <Activity {...element} index={index} key={element.email.toString()}/>;
      })}
    </>
  );
}

export default FriendsActivity;
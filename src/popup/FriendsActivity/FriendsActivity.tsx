import { storage } from 'webextension-polyfill';
import { useState, useEffect, useCallback } from 'react';
import Header from '../Shared/Header';
import Title from '../Shared/Title';
import Activity from '../Shared/Activity';
import useWebSocket, { ReadyState } from "react-use-websocket";

interface Friend {
  email: String,
  firstname: string,
  lastname: string | undefined,
  image: string,
  video: {
    id: string,
    time: number,
    active: boolean
  }
}

const FriendsActivity: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  // const getSocketUrl = useCallback(() => {
  //    const socketUrl: Promise<string> = new Promise((resolve) => {
  //     storage.local.get("userData").then((user) => {
  //       let userData = JSON.parse(user.userData);
  //       setUserData(userData);
  //       resolve(`ws://localhost:4030/api/get-friends?id=${userData.id}`);
  //     });
  //   });

  //   return socketUrl;
  // }, []);

  // const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(getSocketUrl);

  // useEffect(() => {
  //   console.log("Connection state changed")
  // }, [])

  // Run when a new WebSocket message is received (lastJsonMessage)
  // useEffect(() => {
  //   console.log(`Got a new message: ${lastJsonMessage}`)
  // }, [lastJsonMessage])

  const fetchVideoData = () => {
    storage.local.get("userData").then((user) => {
      let userData = JSON.parse(user.userData);
      setUserData(userData);

      const ws = new WebSocket(
        `ws://localhost:4030/api/get-friends?id=${userData.id}`
      );

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log(response);
      }

      // fetch(`http://localhost:4030/api/get-friends?id=${userData.id}`)
      //   .then((res) => res.json())
      //   .then((rawData) => {
      //     // localStorage.setItem('FriendData', JSON.stringify(rawData));
      //     if (data !== rawData) setData(rawData);
      //   })
      //   .catch(error => console.error('Error:', error));
    });
  }

  useEffect(() => {
    // const intervalId = setInterval(fetchVideoData, 1000);
    fetchVideoData();
  
    // return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   storage.local.get("userData").then((user) => {
  //     let userData = JSON.parse(user.userData);
  //     setUserData(userData);

  //     clearInterval(interval);
      
  //     interval = setInterval(() => {
  //       fetch(`http://localhost:4030/api/get-friends?id=${userData.id}`)
  //         .then((res) => res.json())
  //         .then((rawData) => {
  //           if (data === null) {
  //             console.log("null");
  //             localStorage.setItem('FriendData', JSON.stringify(rawData));
  //             setData(rawData);
  //             return;
  //           }

  //           let hasChanges = false;

  //           const updatedData = data.map((element: Friend, index: number) => {
  //             if (rawData[index].video.id !== element.video.id || rawData[index].video.time !== element.video.time || rawData[index].video.active !== element.video.active) {
  //               console.log(rawData[index].video.id, element.video.id, rawData[index].video.id !== element.video.id, "id");
  //               console.log(rawData[index].video.time, element.video.time, rawData[index].video.time !== element.video.time, "time");
  //               console.log(rawData[index].video.active, element.video.active, rawData[index].video.active !== element.video.active, "active");
  //               hasChanges = true;
  //               return rawData[index];
  //             }
  //             return element;
  //           });
          
  //           if (hasChanges) {
  //             // localStorage.setItem('FriendData', JSON.stringify(updatedData));
  //             setData(updatedData);
  //             console.log(getInitialState(), "localData");
  //           }
            
  //         })
  //         .catch(error => console.error('Error:', error));
  //     }, 1000);
  //   });
  // }, []);
  
  if (userData === null || data === null) {
    return <div>Loading...</div>
  }

  console.log(data);

  return (
    <>
      <img src="../images/bg-light.png" alt="background color" className="absolute w-full h-full object-cover -z-10 left-0 top-0"/>
      <Header image={userData.image}/>
      <Title title1="FRIEND ACTIVITIES" title2='ON YOUTUBE' subtitle="Be friends on youtube too"/>
      {data.map((element: Friend, index: number) => {
        return <Activity {...element} index={index} />;
      })}
    </>
  );
}

function getInitialState() {
  const data = localStorage.getItem('FriendData');
  if (data === null) return null;
  return JSON.parse(data);
}

export default FriendsActivity;
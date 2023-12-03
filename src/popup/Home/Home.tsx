import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import Activity from './Activity';
import Title from '../Shared/Title';
import VideoPlaceholder from './VideoPlaceholder';

interface HomeParams {
    socket: Socket,
    userId: string
}

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

const Home: React.FC<HomeParams> = ({ socket, userId }) => {
    const [data, setData] = useState<Array<Friend> | null>(null);

    const updateFriendsData = () => {
      fetch(`https://youtube-friends.onrender.com/api/get-friends?id=${userId}`)
                .then((res) => res.json())
                .then((data) => {
                  setData(data);
                })
      .catch(error => console.error('Error:', error));
    }
    
    useEffect(() => {
        socket.on('video-update', () => {
          updateFriendsData();
        });
    }, [socket]);

    useEffect(() => {
      updateFriendsData();
    }, []);
      
    if (data === null) {
        return (
          <>
            <Title title1="FRIEND ACTIVITIES" title2='ON YOUTUBE' subtitle="Be friends on youtube too"/>
            <VideoPlaceholder />
          </>
        );
    }

    return (
        <>
            <Title title1="FRIEND ACTIVITIES" title2='ON YOUTUBE' subtitle="Be friends on youtube too"/>
            {data.map((element: Friend) => {
                return <Activity {...element} key={element.email.toString()}/>;
            })}
        </>
    )
}

export default Home;
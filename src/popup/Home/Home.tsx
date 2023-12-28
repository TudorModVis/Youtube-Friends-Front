import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import Activity from './Activity';
import VideoPlaceholder from './VideoPlaceholder';
import { useNavigate } from 'react-router-dom';

interface HomeParams {
    socket: Socket,
    email: string,
    name: string,
    image: string,
    id: string
}


interface Friend {
    email: string,
    name: string,
    image: string,
    video: {
      id: string,
      time: number,
      active: boolean,
      lastUpdate: number
    }
  }

  interface Video {
    video: {
      id: string,
      time: number,
      active: boolean,
      lastUpdate: number
    }
  }

  interface Emoji {
    name: string,
    image: string
  }

const Home: React.FC<HomeParams> = ({ socket, id, image, name, email}) => {
    const [data, setData] = useState<Array<Friend> | null>(null);
    const [userVideo, setUserVideo] = useState<Video | null>(null);
    const [emojis, setEmojis] = useState<Array<Emoji>>([]);

    const [minimize, setMinimize] = useState(false);
    const navigate = useNavigate();

    const updateFriendsData = () => {
      fetch(`https://youtube-friends.onrender.com/api/get-friends?id=${id}`)
                .then((res) => res.json())
                .then((data) => {
                  setData(data);
                })
      .catch(error => console.error('Error:', error));
    }

    const updateUserVideo = () => {
      fetch(`https://youtube-friends.onrender.com/api/get-user-video`)
                .then((res) => res.json())
                .then((data) => {
                  setUserVideo(data);
                })
      .catch(error => console.error('Error:', error));
    }
    
    useEffect(() => {
        socket.on('video-update', () => {
          updateFriendsData();
          updateUserVideo();
        });
    }, [socket]);

    useEffect(() => {
      updateFriendsData();
      updateUserVideo();

      const updateEmoji = () => {
        fetch('https://youtube-friends.onrender.com/api/get-emoji')
        .then((res) => res.json())
        .then((data) => {
          setEmojis(data);
        })
        .catch(error => console.error("Cannot get emoji: " + error));
      }

      updateEmoji();
    }, []);

    const onLogOut = () => {
      fetch("https://youtube-friends.onrender.com/api/logout", {
            method: "POST",
            mode: "cors"
        })
        .then(res => {
            if (res.status === 401) {
              navigate('/login');
            }
        })
        .catch(error => console.error('Error when /api/log-out: ', error));
    }

    if (data === null || userVideo === null) {
      return (
        <>
          <div className="flex gap-2 justify-end mt-6 mb-2 pr-3">
            <button onClick={() => {setMinimize(false)}}> <img src="../images/home/grid-view.svg" alt="gird view" className='w-[1.67rem] scale-90' style={{opacity: !minimize? 1 : .7}}/> </button>
            <button onClick={() => {setMinimize(true)}}> <img src="../images/home/list-view.svg" alt="list view" className='w-[1.67rem] scale-90' style={{opacity: minimize? 1 : .7}}/> </button>
          </div>
          <div className='max-h-[488px] overflow-y-scroll overflow-x-hidden pl-3 pr-1 mr-1 pb-[66px]'>
              {/* <button onClick={onLogOut}>LogOut</button> */}
              <VideoPlaceholder minimize={true}/>
              <div className='h-[1px] bg-[#A0A0A0] w-full mb-4'></div>
              <VideoPlaceholder minimize={minimize}/>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex gap-2 justify-end mt-6 mb-2 pr-3">
          <button onClick={() => {setMinimize(false)}}> <img src="../images/home/grid-view.svg" alt="gird view" className='w-6' style={{opacity: !minimize? 1 : .7}}/> </button>
          <button onClick={() => {setMinimize(true)}}> <img src="../images/home/list-view.svg" alt="list view" className='w-6' style={{opacity: minimize? 1 : .7}}/> </button>
        </div>
        <div className='max-h-[488px] overflow-y-scroll overflow-x-hidden pl-3 pr-1 mr-1 pb-[66px]'>
            {/* <button onClick={onLogOut}>LogOut</button> */}
            <Activity name={name} image={image} email={email} video={userVideo.video} minimize={true} emojis={emojis}/>
            <div className='h-[1px] bg-[#A0A0A0] w-full mb-4'></div>
            {data.map((element: Friend) => {
                return <Activity {...element} key={element.email.toString()} minimize={minimize} emojis={emojis}/>;
            })}
        </div>
      </>
    )
}

export default Home;
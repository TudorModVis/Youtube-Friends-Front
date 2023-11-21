import moment from 'moment';
import { useEffect, useState } from 'react';
import { isKeyObject } from 'util/types';

interface ActivityProps {
    index: number,
    firstname: string,
    lastname: string | undefined,
    image: string
    video: {
        id: string,
        time: number,
        active: boolean
    }
}

interface VideoDataProps {
    id: string,
    time: number,
    active: boolean,
    title: string,
    chanelTitle: string,
    duration: number
}

const Activity: React.FC<ActivityProps> = ({firstname, lastname, image, video, index}) => {
    const [videoData, setVideoData] = useState<any>(getInitialData("FriendData_" + index));
    const [videoTime, setVideotime] = useState<number>(getInitialTime("FriendTime_" + index));
    let timeInterval: ReturnType<typeof setInterval>;

    useEffect(() => {
        if (videoData === null || videoData.id !== video.id || videoData.time !== video.time || videoData.active !== video.active) {
            fetchData(setVideoData, video.id, video.time, video.active, index);

            if (!video.active) {
                clearInterval(timeInterval);
                setVideotime(video.time);
                return;
            }

            setVideotime(video.time);
        }

        clearInterval(timeInterval);

        timeInterval = setInterval(() => {
            setVideotime(videoTime + 1);
        }, 1000);
        
    }, []);

    if (videoData === null) {
        return <div>Loading...</div>
    }

    const d = moment.duration(videoData.duration);
    const progress = Math.round(((videoTime / d.asSeconds() * 100) + Number.EPSILON) * 100) / 100;

    return(
        <div className="bg-semi-black border border-[#4C4C4C] rounded-md p-4 mb-4">
            <p className="font-semibold text-2xl mb-4">{videoData.title}</p>
            <div className="flex items-center gap-4">
                <div>
                    <div className="flex gap-2 items-center mb-4">
                        <img src="../images/yt-icon.svg" alt="youtube icon" className="w-8"/>
                        <p>{videoData.chanelTitle}</p>
                    </div>
                    <div className="flex gap-2 items-center mb-2">
                        <img src={image} alt="youtube icon" className="w-8 rounded-full"/>
                        <p className="opacity-70 font-light">{lastname === undefined ? firstname : firstname + ' ' + lastname}</p>
                    </div>
                    <p className="font-semibold text-sm">{getTime(videoTime)}</p>
                    <div className="w-[12.5rem] h-1 bg-white bg-opacity-50 rounded-md">
                        <div className="h-1 bg-accent rounded-md" style={{ width: progress + '%', backgroundColor: video.active? "#F74264" : "rgba(241, 241, 241, 0.50)"}}></div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <p className="text-sm font-medium" style={{opacity: video.active? 1 : .7}}>{video.active? "Watching" : "Watched"}</p>
                        <img src={video.active? "../images/logo.svg" : "../images/logo-gray.svg"} alt="logo modvis" className="w-3"/>
                    </div>
                </div>
                <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt="video thumbnail" className="h-[8.5rem] max-w-none rounded-md"/>
            </div>
            
        </div>
    );
}

const getTime = (t : number) => {
    var date = new Date(0);
    date.setSeconds(t);
  
    return date.toISOString().substr(11, 8);
  };

function getInitialData(key: string) {
    const data = localStorage.getItem(key);
    if (data === null) return null;
    return JSON.parse(data);
  }

  function getInitialTime(key: string) {
    const data = localStorage.getItem(key);
    if (data === null) return 0;
    return Number(data);
  }

  function fetchData(setVideoData: (Object: VideoDataProps) => void, videoId: string, videoTime: number, videoActive: boolean, index: number) {
    fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,snippet&key=AIzaSyAAU6ke-0Mu7FuLQRUhnOcW5K3W-G_W7Cc`)
            .then((res) => res.json())
            .then((data) => {
                const videoDataRaw: VideoDataProps = {
                    id: videoId,
                    time: videoTime,
                    active: videoActive,
                    title: data.items[0].snippet.title.slice(0, 33) + '...',
                    chanelTitle: data.items[0].snippet.channelTitle,
                    duration: data.items[0].contentDetails.duration
                }
                setVideoData(videoDataRaw);
                localStorage.setItem('FriendData_' + index, JSON.stringify(videoDataRaw));
            });
  }
  

export default Activity;
import { storage } from 'webextension-polyfill';
import { AspectRatio, Skeleton } from '@mui/joy';
import moment from 'moment';
import { useEffect, useState } from 'react';
import VideoPlaceholder from './VideoPlaceholder';

interface ActivityProps {
    firstname: string,
    lastname: string | undefined,
    image: string
    video: {
        id: string,
        time: number,
        active: boolean,
        lastUpdate: number,
    },
}

interface VideoDataProps {
    id: string,
    title: string,
    chanelTitle: string,
    duration: number
}

const Activity: React.FC<ActivityProps> = ({firstname, lastname, image, video}) => {
    const [videoData, setVideoData] = useState<VideoDataProps | null>(null);
    const [videoTime, setVideotime] = useState(() => {
        return video.active ? video.time + (Math.floor((Date.now() - video.lastUpdate) / 1000)) : video.time;
    });

    useEffect(() => {
        if (video.id === '') return;

        storage.local.get('videoData').then((data) => {

            if (data.videoData !== undefined) {
                const rawData = JSON.parse(data.videoData);
                if (rawData.id === video.id) {
                    setVideoData(rawData);
                    return;
                }
            }
            
            fetch(`https://www.googleapis.com/youtube/v3/videos?id=${video.id}&part=contentDetails,snippet&key=AIzaSyAAU6ke-0Mu7FuLQRUhnOcW5K3W-G_W7Cc`)
            .then((res) => res.json())
            .then((data) => {
                const videoDataRaw: VideoDataProps = {
                    id: video.id,
                    title: data.items[0].snippet.title.slice(0, 31) + '...',
                    chanelTitle: data.items[0].snippet.channelTitle,
                    duration: data.items[0].contentDetails.duration
                }
                setVideoData(videoDataRaw);
                storage.local.set({
                    "videoData" : JSON.stringify(videoDataRaw)
                });
            });

        });

    }, [video.id]);

    useEffect(() => {
        setVideotime(video.active ? video.time + (Math.floor((Date.now() - video.lastUpdate) / 1000)) : video.time);

        let timeInterval: ReturnType<typeof setInterval> | undefined;

        if (video.active) {
            timeInterval = setInterval(() => {
                setVideotime((prevTime) => prevTime + 1);
              }, 1000);
        } else {
            clearInterval(timeInterval);
        }

        return () => {
            clearInterval(timeInterval);
        };
        
    }, [video.active, video.time]);

    useEffect(() => {
        setVideotime(video.active ? video.time + (Math.floor((Date.now() - video.lastUpdate) / 1000)) : video.time);
    }, []);

    const openVideo = () => {
        window.open(`https://www.youtube.com/watch?v=${video.id}&t=${videoTime}s`, "_blank")
    }

    if (video.id === '') {
        return <></>;
    }

    if (videoData === null) {
        return(
            <VideoPlaceholder />
        );
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
                        <p className='text-sm'>{videoData.chanelTitle}</p>
                    </div>
                    <div className="flex gap-2 items-center mb-2">
                        <img src={image} alt="youtube icon" className="w-8 rounded-full"/>
                        <p className="opacity-70 font-light text-sm">{lastname === undefined ? firstname : firstname + ' ' + lastname}</p>
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
                <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt="video thumbnail" className="h-[8.5rem] max-w-none rounded-md cursor-pointer" onClick={openVideo}/>
            </div>
            
        </div>
    );
}

const getTime = (t : number) => {
    var date = new Date(0);
    date.setSeconds(t);
  
    return date.toISOString().substr(11, 8);
  };

export default Activity;
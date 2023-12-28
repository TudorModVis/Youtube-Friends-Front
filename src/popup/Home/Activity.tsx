import { storage } from 'webextension-polyfill';
import moment from 'moment';
import { useEffect, useState } from 'react';
import VideoPlaceholder from './VideoPlaceholder';
import { Tooltip } from '@mui/joy';

interface ActivityProps {
    name: string,
    image: string,
    email: string,
    minimize: boolean,
    emojis: Array<EmojiProps>,
    video: {
        id: string,
        time: number,
        active: boolean,
        lastUpdate: number,
    },
}

interface EmojiProps {
    name: string,
    image: string
}

interface VideoDataProps {
    id: string,
    title: string,
    chanelTitle: string,
    duration: number
}

const Activity: React.FC<ActivityProps> = ({name, image, video, email, minimize, emojis}) => {
    const [videoData, setVideoData] = useState<VideoDataProps | null>(null);
    const [emojiState, setEmojiState] = useState(false);
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
                    title: data.items[0].snippet.title,
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

    const sendEmoji = (name: string) => {
        fetch("https://youtube-friends.onrender.com/api/send-emoji", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                },
            body: JSON.stringify({
                email: email,
                emoji: name
            }),
        })
        .catch(error => console.error('Error when /api/send-emoji: ', error));
    }

    function Emoji({ image, name }: { image: string; name: string }) {
        return (
            <Tooltip arrow={true} placement="top" variant="solid" title={name} sx={{bgcolor: "#1E1E1E", border: "1px solid #A0A0A0", paddingX: "0.75rem", paddingY: "0.25rem", color: "#F1F1F1", '&::before': {border: '"1px solid #A0A0A0'}}}>
                <button onClick={() => { sendEmoji(name) }}><img src={"../images/emoji/" + image} alt={name} className='w-[1.125rem]'/></button>
            </Tooltip>
        );
    }

    if (video.id === '') {
        return <></>;
    }

    if (videoData === null) {
        return(
            <VideoPlaceholder minimize={minimize}/>
        );
    }

    const d = moment.duration(videoData.duration);
    const progress = Math.round(((videoTime / d.asSeconds() * 100) + Number.EPSILON) * 100) / 100;

    if (minimize) {
        return(
            <div className="bg-semi-black border border-[#A0A0A0] rounded-md px-4 py-1 mb-4">
                <div className='flex gap-4 items-center'>
                    <img src={image} alt="youtube icon" className="h-11 rounded-full"/>
                    <div className='h-12 w-[1px] bg-[#A0A0A0]'></div>
                    <div>
                        <p className="font-bold text-lg leading-[140%] w-[14.68rem] overflow-hidden whitespace-nowrap text-ellipsis">{videoData.title}</p>
                        <div className="flex gap-1 items-center mb-1">
                            <img src="../images/yt-icon.svg" alt="youtube icon" className="h-[11px]"/>
                            <p className='text-[0.625rem] leading-[140%] flex-1 overflow-hidden whitespace-nowrap text-ellipsis'>{videoData.chanelTitle}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <p className="font-bold text-[0.625rem] leading-[140%]">{getTime(videoTime)}</p>
                            <div className="flex-1 h-1 bg-[#A0A0A0] rounded-md">
                                <div id='video-bar' className={"h-1 rounded-md bg-white " + (video.active? "active" : "")} style={{ width: progress + '%'}}></div>
                            </div>
                        </div>
                    </div>
                    <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt="video thumbnail" className="h-12 flex-1 object-cover max-w-none rounded-md cursor-pointer" onClick={openVideo}/>
                </div>
            </div>  
        );
    }

    return(
        <div className="bg-semi-black border border-[#A0A0A0] rounded-md px-4 pb-4 pt-2 mb-4">
            <div className='flex gap-2 justify-between items-center mb-1 relative' onMouseLeave={() => {setEmojiState(false)}}>
                <p className="font-bold text-2xl leading-[140%] flex-1 overflow-hidden whitespace-nowrap text-ellipsis">{videoData.title}</p>
                <button onMouseEnter={() => {setEmojiState(true)}}> <img src={emojiState ? "../images/home/emoji-active.svg" : "../images/home/emoji.svg"} alt="emoji" className="w-6"/> </button>
                <div className='absolute z-10 right-[2rem] h-8 top-0 bg-semi-black border-[#A0A0A0] border px-3 py-2 rounded-md' style={{display: emojiState ? 'block' : 'none'}}>
                    <img src="../images/home/arrow-emoji.svg" alt="arrow" className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-full'/>
                    <div className="flex gap-2 items-center">
                    {emojis.map((element: EmojiProps) => (
                        <Emoji image={element.image} name={element.name} key={element.name}/>
                    ))}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className='max-w-[11.25rem]'>
                    <div className="flex gap-2 items-center mb-4">
                        <img src="../images/yt-icon.svg" alt="youtube icon" className="h-4"/>
                        <p className='text-xs leading-[140%] flex-1 overflow-hidden whitespace-nowrap text-ellipsis'>{videoData.chanelTitle}</p>
                    </div>
                    <div className="flex gap-2 items-center mb-4">
                        <img src={image} alt="youtube icon" className="w-6 rounded-full"/>
                        <p className="opacity-70 text-xs leading-[140%] flex-1 overflow-hidden whitespace-nowrap text-ellipsis">{name}</p>
                    </div>
                    <p className="font-bold text-xs leading-[140%]">{getTime(videoTime)}</p>
                    <div className="w-[10.25rem] h-1 bg-[#A0A0A0] rounded-md my-1">
                        <div id='video-bar' className={"h-1 rounded-md bg-white " + (video.active? "active" : "")} style={{ width: progress + '%'}}></div>
                    </div>
                    <p className="text-xs leading-[140%] font-medium" style={{opacity: video.active? 1 : .7}}> {video.active? "Watching..." : "Watched"}</p>
                </div>
                <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt="video thumbnail" className="h-[7.4rem] flex-1 object-cover max-w-none rounded-md cursor-pointer" onClick={openVideo}/>
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
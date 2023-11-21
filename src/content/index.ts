import { storage, runtime } from 'webextension-polyfill'

let timeInterval = setInterval(() => {}), lastTime = 0;
  
    async function newVideoLoaded (videoId?: string) {
      storage.local.get("userData").then((user) => {
        const userData = JSON.parse(user.userData);
        const youtubePlayer = document.getElementsByClassName('video-stream')[0] as HTMLVideoElement;
        let videoActive = false;

        if (videoId !== undefined) updateVideo(userData.id, youtubePlayer.currentTime, true, videoId);

        clearInterval(timeInterval);

        timeInterval = setInterval(() => {
          if (lastTime === youtubePlayer.currentTime) {
            if (videoActive) {
              updateVideo(userData.id, youtubePlayer.currentTime, false);
              videoActive = false;
            }
            return;
          }

          if (Math.abs(youtubePlayer.currentTime - lastTime) > 1.5) {
            updateVideo(userData.id, youtubePlayer.currentTime);
          } else {
            if (!videoActive) {
              updateVideo(userData.id, youtubePlayer.currentTime, true);
              videoActive = true;
            }
          }
    
          lastTime = youtubePlayer.currentTime;
        }, 1000);
      });
    };

    runtime.onMessage.addListener((obj, sender, response) => {
      const { type, value, videoId } = obj;

      if (type === "VIDEO") {
        newVideoLoaded(videoId);
      }
    });

  function updateVideo(id: string, videoTime: number, videoActive?: boolean, videoId?: string) {
    let sendData = {
      id: id,
      videoTime: videoTime,
    }

    if (videoId !== undefined) Object.assign(sendData, {videoId: videoId});
    if (videoActive !== undefined) Object.assign(sendData, {videoActive: videoActive});

    fetch("http://localhost:4030/api/update-video", {
      method: "POST",
      mode: "cors",
      headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify(sendData),
  })
      .catch(error => console.error('Error when /api/update-video: ', error));
  }

  newVideoLoaded();
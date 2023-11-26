import { storage, runtime } from 'webextension-polyfill'

let timeInterval = setInterval(() => {}), lastTime = 0;
  
    async function newVideoLoaded (videoId: string | null, event?: string) {
      storage.local.get("userData").then((user) => {
        const userData = JSON.parse(user.userData);
        const youtubePlayer = document.getElementsByClassName('video-stream')[0] as HTMLVideoElement;
        let videoActive = true;

        if (event === "STOP-VIDEO") {
          updateVideo(userData.id, userData.email, youtubePlayer.currentTime, videoId, false);
          clearInterval(timeInterval);
          return;
        }

        updateVideo(userData.id, userData.email, youtubePlayer.currentTime, videoId, true);

        clearInterval(timeInterval);

        timeInterval = setInterval(() => {
          if (lastTime === youtubePlayer.currentTime) {
            if (videoActive) {
              updateVideo(userData.id, userData.email, youtubePlayer.currentTime, videoId, false);
              videoActive = false;
            }
            return;
          }

          if (Math.abs(youtubePlayer.currentTime - lastTime) > 1.5) {
            updateVideo(userData.id, userData.email, youtubePlayer.currentTime, videoId);
          } else {
            if (!videoActive) {
              updateVideo(userData.id, userData.email, youtubePlayer.currentTime, videoId, true);
              videoActive = true;
            }
          }
          lastTime = youtubePlayer.currentTime;
        }, 1000);
      });
    };

  function updateVideo(id: string, email: string, videoTime: number, videoId: string | null, videoActive?: boolean) {
    let sendData = {
      id: id,
      email: email,
      videoTime: videoTime,
      lastUpdate: Date.now()
    }

    if (videoId !== null) Object.assign(sendData, {videoId: videoId});
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

  const searchParams = new URLSearchParams(window.location.search);

  if (searchParams.has('v') && !document.hidden) {
    newVideoLoaded(searchParams.get('v'));
  }

  runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "START-VIDEO" && !document.hidden) {
      newVideoLoaded(videoId);
      return;
    }

    if (type === "STOP-VIDEO") {
      clearInterval(timeInterval);
      return
    }
  });

  window.addEventListener('beforeunload', () => {
    console.log('unload');
    newVideoLoaded(searchParams.get('v'), 'STOP-VIDEO')
  });
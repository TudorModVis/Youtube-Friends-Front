import { Socket } from 'dgram';
import { io } from 'socket.io-client';
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

    fetch("https://youtube-friends.onrender.com/api/update-video", {
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

    if (type === "ACTIVE" && !document.hidden) {
      storage.local.get("userData").then((user) => {
        const rawUserData = JSON.parse(user.userData);
        const url = 'https://youtube-friends.onrender.com/?id=' + rawUserData.id + '&scope=emoji';
        const socket = io(url);
  
        socket.on('emoji-received', createPopUp);
      });
    }
  });

  window.addEventListener('load', () => {
    if (document.hidden) return;
    storage.local.get("userData").then((user) => {
      const rawUserData = JSON.parse(user.userData);
      const url = 'https://youtube-friends.onrender.com/?id=' + rawUserData.id + '&scope=emoji';
      const socket = io(url);

      socket.on('emoji-received', createPopUp);
    });
  });

  window.addEventListener('beforeunload', () => {
    newVideoLoaded(searchParams.get('v'), 'STOP-VIDEO')
  });

  interface Message {
    from: string,
    emoji: string
}

  const createPopUp = (message: Message) => {
    // Create the popup container
    var popup = document.createElement('div');
    popup.id = 'emoji';
    popup.style.position = 'fixed';
    popup.style.top = '10px';
    popup.style.right = '10px';
    popup.style.width = '200px';
    popup.style.height = '100px';
    popup.style.backgroundColor = '#f0f0f0';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '4px';
    popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = '9999';

    // Create the text content
    var text = document.createElement('p');
    text.textContent = "You've got " + message.emoji + " from " + message.from;

    // Append the text content to the popup container
    popup.appendChild(text);

    popup.addEventListener('click', () => {
      popup.remove();
    });

    // Append the popup to the body
    document.body.appendChild(popup);
  }
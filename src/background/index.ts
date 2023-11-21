import { tabs, runtime } from 'webextension-polyfill'

tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      const queryParameters = tab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
  
      tabs.sendMessage(tabId, {
        type: "VIDEO",
        videoId: urlParameters.get("v"),
      });
    }
  });
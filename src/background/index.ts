import { tabs } from 'webextension-polyfill';

tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {

      const queryParameters = tab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);

      tabs.sendMessage(tabId, {
        type: "START-VIDEO",
        videoId: urlParameters.get("v"),
      });
    }
  });

tabs.onActivated.addListener(() => {
  // Query the currently active tab
  tabs.query({ active: true, currentWindow: true }).then((activeTabs) => {
    const activeTab = activeTabs[0];

    // Check if the active tab is a YouTube tab
    if (activeTab && activeTab.url && activeTab.url.includes('youtube.com/watch') && activeTab.id !== undefined) {

      const queryParameters = activeTab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);

      tabs.sendMessage(activeTab.id, {
        type: "START-VIDEO",
        videoId: urlParameters.get("v"),
      });

      tabs.query({}).then((allTabs) => {
        allTabs.forEach(function (tab) {
          if (tab.id !== activeTab.id && tab.url && tab.url.includes('youtube.com/watch') && tab.id !== undefined) {
            tabs.sendMessage(tab.id, {
              type: "STOP-VIDEO"
            });
          }
        });
      });

    } 
  });
});

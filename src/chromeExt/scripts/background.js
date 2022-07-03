/**
 *  reference from: 
 * https://github.com/sblask/webextension-enhanced-image-viewer/blob/main/background.js
 * https://blog.logrocket.com/creating-chrome-extension-react-typescript/ 
 * https://github.com/sblask/webextension-enhanced-image-viewer
 * 
 * How to open image with image viwer?
 * - Override image tab?
 *  - how to load image?
 * - add context option to open image?
 * 
*/

chrome.webNavigation.onCommitted.addListener(tabMonitor);


function tabMonitor(details) {
  chrome.storage.local.get('enabled', data => {
    let enabled = data.enabled;

    if (!enabled) return

    const IMAGE_REGEX = /\.(jpg|jpeg|png)(?:\?|$)/
    
    const TWITTER_IMAGE_REGEX = /(?:pbs.twimg.com)/

    if ( details.url.match(IMAGE_REGEX) ) {
      openImageViewer(details.tabId)
  
    }

  });
  
}


function openImageViewer(tabId) {
  // https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/API/tabs
  /**
   * TODO:
   * how to override tab
   * and run image viewer + load image to viewer?...
   * 
   * override and inject html content to tab?
   * 
   */


  // how to parse image?
  // tabs.executeScript() load image ?
  // https://developer.chrome.com/docs/extensions/reference/runtime/
  // message communication from content.js -> react app
  // image store in storage?
  chrome.tabs.update(
    tabId,
    {
      url: 'index.html'
    }) 
}
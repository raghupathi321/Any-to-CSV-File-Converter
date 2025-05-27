document.getElementById('openOptionsBtn').addEventListener('click', () => {
  const popupWidth = 600;
  const popupHeight = 500;

  // Get screen dimensions
  chrome.system.display.getInfo((displays) => {
    const primaryDisplay = displays[0];
    const screenWidth = primaryDisplay.workArea.width;
    const screenTop = primaryDisplay.workArea.top;
    const screenLeft = primaryDisplay.workArea.left;

    const left = screenLeft + screenWidth - popupWidth; // Align to right
    const top = screenTop; // Top of the screen

    chrome.windows.create({
      url: chrome.runtime.getURL('options.html'),
      type: 'popup',
      width: popupWidth,
      height: popupHeight,
      left: left,
      top: top
    });
  });
});

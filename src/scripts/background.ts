/* chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background got a message!")
    sendResponse({})
});

chrome.identity.getAuthToken({interactive: true}, function(token) {
    console.log('got the token', token);
});

chrome.identity.getProfileUserInfo(function(info) { console.log(info); });*/

chrome.runtime.onMessage.addListener((message: {type: 'checkYoutubeAuth'}, sender, sendResponse) => {
    if (message.type === 'checkYoutubeAuth') {
        chrome.identity.getAuthToken({interactive: false}, (token) => {
            console.log('TOKEN', token);
            sendResponse({isAuthorized: !!token});
        });
    }

    return true;
});
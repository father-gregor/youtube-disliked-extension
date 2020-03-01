const YOUTUBE_DISLIKED_URL = 'https://www.googleapis.com/youtube/v3/videos';

async function getAuthToken (isInteractive: boolean): Promise<string> {
    return new Promise ((resolve) => {
        chrome.identity.getAuthToken({interactive: isInteractive}, (token) => {
            console.log('TOKEN', token);
            resolve(token);
        });
    });
}

chrome.runtime.onMessage.addListener((message: {type: 'checkYoutubeAuth', popup?: boolean}, sender, sendResponse) => {
    if (message.type === 'checkYoutubeAuth') {
        getAuthToken(message.popup).then((token: string) => {
            console.log('TOKEN', token);
            sendResponse({isAuthorized: !!token});
        });
    }
    else if (message.type === 'getDislikedVideos') {
        getAuthToken(false).then(async (token: string) => {
            try {
                const url = new URL(YOUTUBE_DISLIKED_URL);
                url.search = new URLSearchParams({
                    part: 'id,snippet',
                    myRating: 'dislike'
                }).toString();

                let options = {
                    method: 'GET',
                    async: true,
                    headers: {
                      Authorization: 'Bearer ' + token,
                      'Content-Type': 'application/json'
                    },
                    'contentType': 'json'
                };

                let response = await fetch(url.toString(), options);
                if (!response.ok) {
                    throw response;
                }

                let videos = response.json();
                sendResponse(videos);
            }
            catch (err) {
                console.log('Error occured', err)
            }
        });
    }

    return true;
});
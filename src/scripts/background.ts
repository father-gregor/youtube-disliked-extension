const YOUTUBE_DISLIKED_URL = 'https://www.googleapis.com/youtube/v3/videos';
const YOUTUBE_CURRENT_CHANNEL_URL = 'https://www.googleapis.com/youtube/v3/channels';

async function fetchUrl (url: string, query: any, token: string) {
    const urlObj = new URL(url);
    urlObj.search = new URLSearchParams(query).toString();

    let options = {
        method: 'GET',
        async: true,
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        'contentType': 'json'
    };

    let response = await fetch(urlObj.toString(), options);
    if (!response.ok) {
        throw response;
    }

    return response.json();
}

async function getAuthToken (isInteractive: boolean): Promise<string> {
    return new Promise ((resolve) => {
        chrome.identity.getAuthToken({interactive: isInteractive}, (token) => {
            console.log('TOKEN', token);
            resolve(token);
        });
    });
}

async function getCurrentUserChannel (token: string) {
    const query = {
        part: 'id,snipper',
        mine: true
    };
    return await fetchUrl(YOUTUBE_CURRENT_CHANNEL_URL, query, token);
}

async function getDislikedVideos (token: string) {
    const query = {
        part: 'id,snippet',
        myRating: 'dislike'
    };
    return await fetchUrl(YOUTUBE_DISLIKED_URL, query, token);
}

chrome.runtime.onMessage.addListener((message: {type: 'checkYoutubeAuth', popup?: boolean}, sender, sendResponse) => {
    getAuthToken(message.popup).then(async (token: string) => {
        try {
            if (message.type === 'checkYoutubeAuth') {
                console.log('TOKEN', token);
                sendResponse({isAuthorized: !!token});
            }
            else if (message.type === 'getCurrentUserChannel') {
                await getCurrentUserChannel(token);
                sendResponse('NOT IMPLEMENTED YET');
            }
            else if (message.type === 'getDislikedVideos') {
                let videosRes = await getDislikedVideos(token);
                sendResponse(videosRes);
            }
        }
        catch (err) {
            console.log('Error occured', err);
            sendResponse(err);
        }
    });

    return true;
});
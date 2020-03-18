import {parse as parseIsoDuration, Duration} from 'iso8601-duration';

import {ChromeMessageType} from './../interfaces/general.d';
import {IUserChannel} from '../interfaces/channel';
import {IGetVideosResponse, IYoutubeVideo} from '../interfaces/video';

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

function parseDuration (duration: string) {
    if (!duration) {
        return duration;
    }

    const parsedDuration: Duration = parseIsoDuration(duration);
    const days = parsedDuration.days;
    let hours = `${parsedDuration.hours || '00'}`;
    let minutes = `${parsedDuration.minutes || '00'}`;
    let seconds = `${parsedDuration.seconds || '00'}`;

    if (parsedDuration.days) {
        hours = zeroPadding(hours);
        minutes = zeroPadding(minutes);
        seconds = zeroPadding(seconds);
        return `${days}:${hours}:${minutes}:${seconds}`;
    }
    else if (parsedDuration.hours) {
        minutes = zeroPadding(minutes);
        seconds = zeroPadding(seconds);
        return `${hours}:${minutes}:${seconds}`;
    }
    else {
        seconds = zeroPadding(seconds);
        return `${minutes}:${seconds}`;
    }

    function zeroPadding (value: string) {
        return value.length < 2 ? `0${value}` : value;
    }
}

async function getAuthToken (isInteractive: boolean): Promise<string> {
    return new Promise ((resolve) => {
        chrome.identity.getAuthToken({interactive: isInteractive}, (token) => {
            resolve(token);
        });
    });
}

async function removeAuthToken (corruptedToken: string) {
    return new Promise((resolve) => {
        chrome.identity.removeCachedAuthToken({token: corruptedToken}, () => {
            resolve();
        });
    });
}

async function getCurrentUserChannel (token: string): Promise<IUserChannel> {
    const query = {
        part: 'id,snippet',
        mine: true
    };

    const response = await fetchUrl(YOUTUBE_CURRENT_CHANNEL_URL, query, token);

    let channel: IUserChannel;
    if (response.items[0]) {
        let item = response.items[0];
        channel = {
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            url: `https://www.youtube.com/channel/${item.id}`,
            thumbnail: item.snippet?.thumbnails?.medium?.url
        };
    }
    return channel;
}

async function getDislikedVideos (token: string, pageToken?: string): Promise<IGetVideosResponse> {
    const query: any = {
        part: 'id,snippet,contentDetails',
        myRating: 'dislike',
        maxResults: 15
    };

    if (pageToken) {
        query.pageToken = pageToken;
    }

    const response = await fetchUrl(YOUTUBE_DISLIKED_URL, query, token);

    return {
        videos: (response.items || []).map((v) => {
            return {
                id: v.id,
                title: v.snippet.title,
                description: v.snippet.description,
                url: `https://www.youtube.com/watch?v=${v.id}`,
                thumbnail: v.snippet.thumbnails?.medium?.url,
                duration: parseDuration(v.contentDetails.duration),
                channelId: v.snippet.channelId,
                channelTitle: v.snippet.channelTitle,
                channelUrl: `https://www.youtube.com/channel/${v.snippet.channelId}`
            } as IYoutubeVideo;
        }),
        totalCount: response.pageInfo?.totalResults,
        perPageCount: response.pageInfo?.resultsPerPage,
        nextPageToken: response.nextPageToken,
        prevPageToken: response.prevPageToken
    };
}

interface IMessageListenerData {
    type: ChromeMessageType;
    popup?: boolean;
    pageToken?: string;
}

chrome.webNavigation.onHistoryStateUpdated.addListener((data) => {
    console.log('webNavigation changed', data);
});

chrome.runtime.onMessage.addListener((message: IMessageListenerData, sender, sendResponse) => {
    getAuthToken(message.popup).then(async (token: string) => {
        try {
            if (message.type === 'checkYoutubeAuth') {
                sendResponse({isAuthorized: !!token});
            }
            else if (message.type === 'getCurrentUserChannel') {
                const channel = await getCurrentUserChannel(token);
                sendResponse(channel);
            }
            else if (message.type === 'getDislikedVideos') {
                const videosRes = await getDislikedVideos(token, message.pageToken);
                sendResponse(videosRes);
            }
        }
        catch (err) {
            sendResponse({err, authTokenRemoved: true});
        }
    });

    return true;
});
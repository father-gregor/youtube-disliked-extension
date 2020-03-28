import {parse as parseIsoDuration, Duration} from 'iso8601-duration';

import {ContentChromeMessageType} from './../interfaces/general.d';
import {IUserChannel} from '../interfaces/channel';
import {IGetVideosResponse, IYoutubeVideo} from '../interfaces/video';

const YOUTUBE_DISLIKED_URL = 'https://www.googleapis.com/youtube/v3/videos';
const YOUTUBE_CURRENT_CHANNEL_URL = 'https://www.googleapis.com/youtube/v3/channels';

interface IContentMessageListenerData {
    type: ContentChromeMessageType;
    popup?: boolean;
    pageToken?: string;
}

async function fetchUrl (url: string, query: any, token: string) {
    const urlObj = new URL(url);
    urlObj.search = new URLSearchParams(query).toString();

    let options = {
        method: 'GET',
        async: true,
        cache: 'no-store' as any,
        contentType: 'json',
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
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
    /**
     * Complete tokken purging from here - https://stackoverflow.com/a/50343218
     */
    await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${corruptedToken}`);
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
        part: 'id,snippet,contentDetails,statistics',
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
                viewCount: v.statistics.viewCount,
                publishedAt: v.snippet.publishedAt,
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

function onNavigation (details: chrome.webNavigation.WebNavigationUrlCallbackDetails) {
    if (details.url.includes('/feed/library')) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'libraryPageOpened'});
        });
    }
}
chrome.webNavigation.onHistoryStateUpdated.addListener(onNavigation, {url: [{pathSuffix: 'feed/library'}]});

chrome.runtime.onMessage.addListener((message: IContentMessageListenerData, sender, sendResponse) => {
    getAuthToken(message.popup).then(async (token: string) => {
        try {
            if (message.type === 'checkYoutubeAuth') {
                sendResponse({isAuthorized: !!token});
            }
            else if (message.type === 'removeYoutubeAuth') {
                await removeAuthToken(token);
                sendResponse({authTokenRemoved: true});
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
            sendResponse({err});
        }
    });

    return true;
});
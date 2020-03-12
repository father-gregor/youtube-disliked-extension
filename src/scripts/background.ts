import {IUserChannel} from '../interfaces/channel';
import { IGetVideosResponse, IYoutubeVideo } from "../interfaces/video";

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
            thumbnail: item.snippet?.thumbnails?.default?.url
        };
    }
    return channel;
}

async function getDislikedVideos (token: string, pageToken?: string): Promise<IGetVideosResponse> {
    const query: any = {
        part: 'id,snippet',
        myRating: 'dislike'
    };

    if (pageToken) {
        query.pageToken = pageToken;
    }

    const response = await fetchUrl(YOUTUBE_DISLIKED_URL, query, token);

    return {
        videos: response.items.map((v) => {
            return {
                id: v.id,
                title: v.snippet.title,
                description: v.snippet.description,
                thumbnail: v.snippet.thumbnails?.default?.url,
                channelId: v.snippet.channelId,
                channelTitle: v.snippet.channelTitle
            } as IYoutubeVideo;
        }),
        totalCount: response.pageInfo?.totalResults,
        perPageCount: response.pageInfo?.resultsPerPage,
        nextPageToken: response.nextPageToken,
        prevPageToken: response.prevPageToken
    };
}

interface IMessageListenerData {
    type: 'checkYoutubeAuth' | 'getCurrentUserChannel' | 'getDislikedVideos';
    popup?: boolean;
    pageToken?: string;
}

chrome.runtime.onMessage.addListener((message: IMessageListenerData, sender, sendResponse) => {
    getAuthToken(message.popup).then(async (token: string) => {
        try {
            if (message.type === 'checkYoutubeAuth') {
                console.log('TOKEN', token);
                sendResponse({isAuthorized: !!token});
            }
            else if (message.type === 'getCurrentUserChannel') {
                const channel = await getCurrentUserChannel(token);
                sendResponse(channel);
            }
            else if (message.type === 'getDislikedVideos') {
                let videosRes = await getDislikedVideos(token, message.pageToken);
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
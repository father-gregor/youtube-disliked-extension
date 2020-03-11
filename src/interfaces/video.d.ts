export interface IYoutubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelId: string;
    channelTitle: string;
}

export interface IGetVideosResponse {
    videos: IYoutubeVideo[];
    totalCount?: number;
    perPageCount?: number;
    nextPageToken?: string;
    prevPageToken?: string;
}

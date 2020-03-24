export interface IYoutubeVideo {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    duration: string;
    viewCount: number;
    viewCountLocalized?: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    channelUrl: string;
}

export interface IGetVideosResponse {
    videos: IYoutubeVideo[];
    totalCount?: number;
    perPageCount?: number;
    nextPageToken?: string;
    prevPageToken?: string;
}

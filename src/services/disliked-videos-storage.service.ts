import {ChromeMessagingService} from './chrome-messaging.service';
import {IGetVideosResponse, IYoutubeVideo} from "../interfaces/video";

export class DislikedVideosStorageService {
    private videos: IYoutubeVideo[] = [];
    private totalCount: number;
    private perPageCount: number;
    private nextPageToken: string;
    private prevPageToken: string;
    private ChromeMessaging: ChromeMessagingService
    private static instance: DislikedVideosStorageService;

    private constructor () {
        this.ChromeMessaging = ChromeMessagingService.create();
    }

    public async getVideos (isFirstLoad?: boolean) {
        if (isFirstLoad) {
            this.clearStoredVideos();
        }
        if (this.totalCount && this.videos.length >= this.totalCount) {
            return [];
        }

        const res: IGetVideosResponse = await this.ChromeMessaging.sendMessage('getDislikedVideos', {pageToken: this.nextPageToken});
        let newVideos = res.videos;

        if (!newVideos) {
            return [];
        }

        this.videos = this.videos.concat(newVideos);
        this.totalCount = res.totalCount || this.totalCount;
        this.perPageCount = res.perPageCount || this.perPageCount;
        this.nextPageToken = res.nextPageToken || this.nextPageToken;
        this.prevPageToken = res.prevPageToken || this.prevPageToken;

        return newVideos;
    }

    public isMoreVideosAvailable () {
        return this.totalCount && this.videos.length < this.totalCount;
    }

    public getTotalCount () {
        return this.totalCount;
    }

    private clearStoredVideos () {
        this.videos = [];
        this.totalCount = null;
        this.perPageCount = null;
        this.nextPageToken = null;
        this.prevPageToken = null;
    }

    public static create () {
        if (!DislikedVideosStorageService.instance) {
            DislikedVideosStorageService.instance = new DislikedVideosStorageService();
        }
        return DislikedVideosStorageService.instance;
    }
}

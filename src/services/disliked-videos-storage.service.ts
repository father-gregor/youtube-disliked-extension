import {IGetVideosResponse, IYoutubeVideo} from "../interfaces/video";

export class DislikedVideosStorageService {
    private videos: IYoutubeVideo[] = [];
    private totalCount: number;
    private perPageCount: number;
    private nextPageToken: string;
    private prevPageToken: string;
    private static instance: DislikedVideosStorageService;

    private constructor () {}

    public async getVideos () {
        if (this.totalCount && this.videos.length >= this.totalCount) {
            return [];
        }

        const res: IGetVideosResponse = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({type: 'getDislikedVideos', pageToken: this.nextPageToken}, (response: IGetVideosResponse) => {
                if (response instanceof Error) {
                    reject(response);
                }

                console.log('Videos Response', response);

                resolve(response);
            });
        });

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

    public static create () {
        if (!DislikedVideosStorageService.instance) {
            DislikedVideosStorageService.instance = new DislikedVideosStorageService();
        }
        return DislikedVideosStorageService.instance;
    }
}

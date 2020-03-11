import {IGetVideosResponse, IYoutubeVideo} from "../interfaces/video";

export class DislikedVideosStorageService {
    private videos: IYoutubeVideo[];
    private totalCount: number;
    private perPageCount: number;
    private nextPageToken: string;
    private prevPageToken: string;
    private static instance: DislikedVideosStorageService;

    private constructor () {}

    public async getVideos () {
        const res: IGetVideosResponse = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({type: 'getDislikedVideos'}, (response: IGetVideosResponse) => {
                if (response instanceof Error) {
                    reject(response);
                }

                console.log('Videos', response);

                resolve(response);
            });
        });

        let newVideos = res.videos;
        if (!this.videos) {
            this.videos = newVideos;
        }

        this.totalCount = res.totalCount || this.totalCount;
        this.perPageCount = res.perPageCount || this.perPageCount;
        this.nextPageToken = res.nextPageToken || this.nextPageToken;
        this.prevPageToken = res.prevPageToken || this.prevPageToken;

        return newVideos;
    }

    public static create () {
        if (!DislikedVideosStorageService.instance) {
            DislikedVideosStorageService.instance = new DislikedVideosStorageService();
        }
        return DislikedVideosStorageService.instance;
    }
}

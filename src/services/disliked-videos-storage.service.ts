export class DislikedVideosStorageService {
    private static instance: DislikedVideosStorageService;

    private constructor () {}

    public async getVideos () {
        await new Promise((resolve) => {
            chrome.runtime.sendMessage({type: 'getDislikedVideos'}, (videos: any[]) => {
                resolve(videos);
            });
        });
    }

    public static create () {
        if (!DislikedVideosStorageService.instance) {
            DislikedVideosStorageService.instance = new DislikedVideosStorageService();
        }
        return DislikedVideosStorageService.instance;
    }
}

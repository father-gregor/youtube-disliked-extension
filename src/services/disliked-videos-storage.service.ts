export class DislikedVideosStorageService {
    private static instance: DislikedVideosStorageService;

    private constructor () {}

    public async getVideos () {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({type: 'getDislikedVideos'}, (response: any) => {
                if (response instanceof Error) {
                    reject(response);
                }

                resolve(response);
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

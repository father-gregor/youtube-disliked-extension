export class YoutubeAuthService {
    private isAppAuthorized = false;
    private static instance: YoutubeAuthService;

    private constructor () {}

    public isAuthorized () {
        return this.isAppAuthorized;
    }

    public static async create () {
        if (!YoutubeAuthService.instance) {
            YoutubeAuthService.instance = new YoutubeAuthService();
        }
        YoutubeAuthService.instance.isAppAuthorized = await new Promise((resolve) => {
            console.log('Try to send message');
            chrome.runtime.sendMessage({type: 'checkYoutubeAuth'}, ({isAuthorized}: {isAuthorized: boolean}) => {
                console.log('Response', isAuthorized);
                resolve(isAuthorized);
            });
        });
        return YoutubeAuthService.instance;
    }
}

export class YoutubeAuthService {
    private isAppAuthorized = false;
    private static instance: YoutubeAuthService;

    private constructor () {}

    public isAuthorized () {
        return this.isAppAuthorized;
    }

    public async authorizeWithConsentPopup () {
        return this.authorize(true);
    }

    private async authorize (withPopup: boolean) {
        this.isAppAuthorized = await new Promise((resolve) => {
            chrome.runtime.sendMessage({type: 'checkYoutubeAuth', popup: withPopup}, ({isAuthorized}: {isAuthorized: boolean}) => {
                resolve(isAuthorized);
            });
        });
        return this.isAppAuthorized;
    }

    public static async create () {
        if (!YoutubeAuthService.instance) {
            YoutubeAuthService.instance = new YoutubeAuthService();
        }

        await YoutubeAuthService.instance.authorize(false);
        return YoutubeAuthService.instance;
    }
}

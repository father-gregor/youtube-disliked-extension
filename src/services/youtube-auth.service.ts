export class YoutubeAuthService {
    private isAppAuthorized = false;
    private user: any;
    private static instance: YoutubeAuthService;

    private constructor () {}

    public isAuthorized () {
        return this.isAppAuthorized;
    }

    public async authorizeWithConsentPopup () {
        return this.authorize(true);
    }

    public async getCurrentUser () {
        if (!this.user) {
            this.user = await new Promise((resolve) => {
                chrome.runtime.sendMessage({type: 'getCurrentUserChannel'}, (user: any) => {
                    resolve(user);
                });
            });
        }
        return this.user;
    }

    private async authorize (withPopup: boolean) {
        this.user = null;
        this.isAppAuthorized = await new Promise((resolve) => {
            chrome.runtime.sendMessage({type: 'checkYoutubeAuth', popup: withPopup}, ({isAuthorized}: {isAuthorized: boolean}) => {
                resolve(isAuthorized);
            });
        });

        if (this.isAppAuthorized) {
            await this.getCurrentUser();
        }
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

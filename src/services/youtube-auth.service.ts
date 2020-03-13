import {IUserChannel} from '../interfaces/channel';

export class YoutubeAuthService {
    private isAppAuthorized = false;
    private userChannel: IUserChannel;
    private static instance: YoutubeAuthService;

    private constructor () {}

    public isAuthorized () {
        return this.isAppAuthorized;
    }

    public async authorizeWithConsentPopup () {
        return this.authorize(true);
    }

    public getUserChannel () {
        return this.userChannel;
    }

    public async saveCurrentUserChannel () {
        if (!this.userChannel) {
            this.userChannel = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({type: 'getCurrentUserChannel'}, (user: IUserChannel) => {
                    console.log('CURRENT USER CHANNEL', user);
                    if (!user) {
                        reject('Cannot get channel info');
                    }
                    resolve(user);
                });
            });
        }
        return this.userChannel;
    }

    private async authorize (withPopup: boolean) {
        this.userChannel = null;
        this.isAppAuthorized = await new Promise((resolve) => {
            chrome.runtime.sendMessage({type: 'checkYoutubeAuth', popup: withPopup}, ({isAuthorized}: {isAuthorized: boolean}) => {
                resolve(isAuthorized);
            });
        });

        if (this.isAppAuthorized) {
            await this.saveCurrentUserChannel();
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

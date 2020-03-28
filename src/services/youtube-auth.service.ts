import {ChromeMessagingService} from './chrome-messaging.service';
import {IUserChannel} from '../interfaces/channel';

export class YoutubeAuthService {
    private isAppAuthorized = false;
    private userChannel: IUserChannel;
    private ChromeMessaging: ChromeMessagingService
    private static instance: YoutubeAuthService;
    private authChangeCallbacks: (() => void)[] = [];

    private constructor () {
        this.ChromeMessaging = ChromeMessagingService.create();
    }

    public isAuthorized () {
        return this.isAppAuthorized;
    }

    public subscribeToAuthChange (callback: () => void) {
        this.authChangeCallbacks.push(callback);
    }

    public unsubscribeFromAuthChange (callback: () => void) {
        this.authChangeCallbacks = this.authChangeCallbacks.filter((c) => c !== callback);
    }

    public emitOnAuthChange () {
        for (let callback of this.authChangeCallbacks) {
            callback();
        }
    }

    public async authorizeWithConsentPopup () {
        return this.authorize(true);
    }

    public async refreshAuthorization () {
        const isRemoved = await this.removeAuth(false);
        if (!isRemoved) {
            throw new Error('Cannot remove authorization token');
        }

        return this.authorizeWithConsentPopup();
    }

    public async removeAuth (emitChanges = true) {
        const res = await this.ChromeMessaging.sendMessage('removeYoutubeAuth');
        this.userChannel = null;
        this.isAppAuthorized = !res.authTokenRemoved;
        if (emitChanges) {
            this.emitOnAuthChange();
        }
        return res.authTokenRemoved;
     }

    public getUserChannel () {
        return this.userChannel;
    }

    public async saveCurrentUserChannel () {
        if (!this.userChannel) {
            this.userChannel = await this.ChromeMessaging.sendMessage('getCurrentUserChannel');
        }

        return this.userChannel;
    }

    private async authorize (withPopup: boolean) {
        try {
            this.userChannel = null;
            const res: {isAuthorized: boolean} = await this.ChromeMessaging.sendMessage('checkYoutubeAuth', {popup: withPopup});
            this.isAppAuthorized = res.isAuthorized;

            if (this.isAppAuthorized) {
                await this.saveCurrentUserChannel();
            }

            this.emitOnAuthChange();
            return this.isAppAuthorized;
        }
        catch (err) {
            return false;
        }
    }

    public static async create () {
        if (!YoutubeAuthService.instance) {
            YoutubeAuthService.instance = new YoutubeAuthService();
        }

        await YoutubeAuthService.instance.authorize(false);
        return YoutubeAuthService.instance;
    }
}

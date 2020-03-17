import {ChromeMessageType, GeneralErrorType} from '../interfaces/general';

export class ChromeMessagingService {
    private errorSubs: {id: number, callback: (type: GeneralErrorType) => any}[] = [];
    private static instance: ChromeMessagingService;

    private constructor () {}

    public subscribeToErrors (callback: (type: GeneralErrorType) => any) {
        let id = Date.now();
        this.errorSubs.push({id, callback});
        return id;
    }

    public unsubscribe (id: number) {
        this.errorSubs = this.errorSubs.filter((s) => s.id === id);
    }

    public async sendMessage (type: ChromeMessageType, data: any = {}): Promise<any> {
        return new Promise((resolve) => {
            try {
                chrome.runtime.sendMessage({type, ...data}, (resp: any) => {
                    resolve(resp);
                });
            }
            catch (err) {
                if (err.message && err.message.includes('Extension context invalidated')) {
                    this.handleError('reloadRequired');
                }
            }
        });
    }

    private handleError (errorType: GeneralErrorType) {
        for (let sub of this.errorSubs) {
            sub.callback(errorType);
        }
    }

    public static create () {
        if (!ChromeMessagingService.instance) {
            ChromeMessagingService.instance = new ChromeMessagingService();
        }
        return ChromeMessagingService.instance;
    }
}

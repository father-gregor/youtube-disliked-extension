export class I18nService {
    private currentLanguage: string;
    private messages: {[key: string]: {[key: string]: any, message: string, description?: string}};

    public static defaultLocale: string;
    private static instanceForLocale: {[key: string]: I18nService} = {};

    private constructor (locale: string) {
        this.currentLanguage = locale.split('-')[0];
    }

    public getCurrentLanguage () {
        return this.currentLanguage;
    }

    public getElement (id: string) {
        return this.messages[id];
    }

    public getMessage (id: string) {
        return this.messages[id].message;
    }

    private async loadMessages () {
        try {
            const messagesUrl = chrome.runtime.getURL(`../_locales/${this.currentLanguage}/messages.json`);
            const response: Response = await fetch(messagesUrl);
            this.messages = await response.json();
        }
        catch (err) {
            if (this.currentLanguage !== 'en') {
                this.currentLanguage = 'en';
                await this.loadMessages();
            }
            else {
                throw err;
            }
        }
    }

    public static async create (customLocale?: string) {
        let locale = customLocale || document.documentElement.lang || I18nService.defaultLocale;
        let instance;
        if (I18nService.instanceForLocale[locale]) {
            instance = I18nService.instanceForLocale[locale];
        }
        else {
            instance = new I18nService(locale);
            await instance.loadMessages();
            I18nService.instanceForLocale[locale] = instance;
        }
        return instance;
    }
}

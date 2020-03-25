import {ChromeMessagingService} from './chrome-messaging.service';
import {I18nService} from './i18n.service';
import {IGetVideosResponse, IYoutubeVideo} from "../interfaces/video";

export class DislikedVideosStorageService {
    private videos: IYoutubeVideo[] = [];
    private totalCount: number;
    private perPageCount: number;
    private nextPageToken: string;
    private prevPageToken: string;
    private ChromeMessaging: ChromeMessagingService;
    private I18n: I18nService;
    private viewCountTiers = ['', 'thousands', 'millions', 'billions'];
    private static instance: DislikedVideosStorageService;

    private constructor () {
        this.ChromeMessaging = ChromeMessagingService.create();
        I18nService.create().then((instance: I18nService) => {
            this.I18n = instance;
        });
    }

    public async getVideos (isFirstLoad?: boolean) {
        if (isFirstLoad) {
            this.clearStoredVideos();
        }
        if (this.totalCount && this.videos.length >= this.totalCount) {
            return [];
        }

        const res: IGetVideosResponse = await this.ChromeMessaging.sendMessage('getDislikedVideos', {pageToken: this.nextPageToken});
        let newVideos = res.videos;

        if (!newVideos) {
            return [];
        }

        this.videos = this.videos.concat(newVideos.map((video) => {
            if (!video.viewCountLocalized) {
                video.viewCountLocalized = this.localizeViewCount(video.viewCount);
            }
            video.publishedAt = this.localizePublishedDate(video.publishedAt);
            return video;
        }));
        this.totalCount = res.totalCount || this.totalCount;
        this.perPageCount = res.perPageCount || this.perPageCount;
        this.nextPageToken = res.nextPageToken || this.nextPageToken;
        this.prevPageToken = res.prevPageToken || this.prevPageToken;

        return newVideos;
    }

    public isMoreVideosAvailable () {
        return this.totalCount && this.videos.length < this.totalCount;
    }

    public getTotalCount () {
        return this.totalCount;
    }

    private localizeViewCount (viewCount: number){
        const tier = Math.log10(viewCount) / 3 | 0;
        const viewsWord = this.I18n.getMessage('viewCount@viewsWord');

        if (tier === 0) {
            return viewCount + ' ' + viewsWord;
        }

        const suffix = this.viewCountTiers[tier];
        const scale = Math.pow(10, tier * 3);
        const scaled = viewCount / scale;

        return scaled.toFixed(suffix === 'thousands' ? 0 : 1).replace('.', ',') + this.I18n.getMessage(`viewCount@${suffix}`) + ' ' + viewsWord;
    }

    private localizePublishedDate (date: string) {
        const currentDate = new Date();
        const videoDate = new Date(date);

        const yearDiff = currentDate.getUTCFullYear() - videoDate.getUTCFullYear();
        const monthDiff = currentDate.getUTCMonth() - videoDate.getUTCMonth();
        const dayDiff = currentDate.getUTCDate() - videoDate.getUTCDate();

        let resultDiff;
        let tier;
        if (yearDiff > 0) {
            if (yearDiff >= 2) {
                tier = 'yearPlural';
                resultDiff = yearDiff;
            }
            else if (monthDiff <= 0) {
                tier = 'yearSingular';
                resultDiff = yearDiff;
            }
            else {
                tier = 'monthPlural';
                resultDiff = monthDiff;
            }
        }
        else if (monthDiff > 0) {
            tier = 'monthPlural';
            resultDiff = monthDiff;
        }
        else if (dayDiff > 0) {
            tier = 'weekPlural';
            resultDiff = dayDiff;
        }
        else {
            tier = 'today';
        }

        if (tier === 'today') {
            return this.I18n.getMessage('publishDate@today');
        }

        return `${resultDiff} ${this.I18n.getMessage(`publishDate@${tier}`)} ${this.I18n.getMessage('publishDate@agoWord')}`;
    }

    private clearStoredVideos () {
        this.videos = [];
        this.totalCount = null;
        this.perPageCount = null;
        this.nextPageToken = null;
        this.prevPageToken = null;
    }

    public static create () {
        if (!DislikedVideosStorageService.instance) {
            DislikedVideosStorageService.instance = new DislikedVideosStorageService();
        }
        return DislikedVideosStorageService.instance;
    }
}

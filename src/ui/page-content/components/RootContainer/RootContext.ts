import React from 'react';

import {I18nService} from '../../../../services/i18n.service';
import {YoutubeAuthService} from '../../../../services/youtube-auth.service';
import {DislikedListService} from '../../../../services/disliked-list.service';
import {DislikedVideosStorageService} from '../../../../services/disliked-videos-storage.service';
import {ChromeMessagingService} from '../../../../services/chrome-messaging.service';

export interface IRootContext {
    DislikedList: DislikedListService,
    I18n: I18nService,
    YoutubeAuth: YoutubeAuthService,
    DislikedVideosStorage: DislikedVideosStorageService,
    ChromeMessaging: ChromeMessagingService 
}

export type RootContextType = React.ContextType<React.Context<IRootContext>>;

const RootContext = React.createContext<IRootContext>({
    DislikedList: null,
    I18n: null,
    YoutubeAuth: null,
    DislikedVideosStorage: null,
    ChromeMessaging: null
});

export function createRootContext () {
    return RootContext;
}

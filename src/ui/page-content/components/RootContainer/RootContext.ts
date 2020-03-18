import React from 'react';

import {I18nService} from '../../../../services/i18n.service';
import {YoutubeAuthService} from '../../../../services/youtube-auth.service';
import {DislikedVideosPopupService} from '../../../../services/disliked-videos-popup.service';
import {DislikedVideosStorageService} from '../../../../services/disliked-videos-storage.service';
import {ChromeMessagingService} from '../../../../services/chrome-messaging.service';

export interface IRootContext {
    DislikedVideosPopup: DislikedVideosPopupService,
    I18n: I18nService,
    YoutubeAuth: YoutubeAuthService,
    DislikedVideosStorage: DislikedVideosStorageService,
    ChromeMessaging: ChromeMessagingService 
}

export type RootContextType = React.ContextType<React.Context<IRootContext>>;

const RootContext = React.createContext<IRootContext>({
    DislikedVideosPopup: null,
    I18n: null,
    YoutubeAuth: null,
    DislikedVideosStorage: null,
    ChromeMessaging: null
});

export function createRootContext () {
    return RootContext;
}

import React from 'react';

import {I18nService} from '../../../../services/i18n.service';
import {YoutubeAuthService} from '../../../../services/youtube-auth.service';
import {DislikedListService} from '../../../../services/disliked-list.service';
import {DislikedVideosStorageService} from '../../../../services/disliked-videos-storage.service';

export interface IRootContext {
    DislikedList: DislikedListService,
    I18n: I18nService,
    YoutubeAuth: YoutubeAuthService,
    DislikedVideosStorage: DislikedVideosStorageService
}

export type RootContextType = React.ContextType<React.Context<IRootContext>>;

const RootContext = React.createContext<IRootContext>({
    DislikedList: null,
    I18n: null,
    YoutubeAuth: null,
    DislikedVideosStorage: null
});

export function createRootContext () {
    return RootContext;
}

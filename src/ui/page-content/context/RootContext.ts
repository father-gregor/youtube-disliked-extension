import React from 'react';

import {I18nService} from '../../../services/i18n.service';
import {YoutubeAuthService} from '../../../services/youtube-auth.service';
import {DislikedVideosPopupService} from '../../../services/disliked-videos-popup.service';
import {DislikedVideosStorageService} from '../../../services/disliked-videos-storage.service';
import {ChromeMessagingService} from '../../../services/chrome-messaging.service';
import {ThemeService} from './../../../services/theme.service';
import {DislikedVideosLibrarySectionService} from './../../../services/disliked-videos-library-section.service';

export interface IRootContext {
    refreshAuth: () => void;
    DislikedVideosPopup: DislikedVideosPopupService;
    I18n: I18nService;
    YoutubeAuth: YoutubeAuthService;
    DislikedVideosStorage: DislikedVideosStorageService;
    ChromeMessaging: ChromeMessagingService;
    Theme: ThemeService;
    DislikedVideosLibrarySection: DislikedVideosLibrarySectionService;
}

export type RootContextType = React.ContextType<React.Context<IRootContext>>;

export function createRootContext () {
    const functionDef = createRootContext as any;
    if (!functionDef.RootContext) {
        functionDef.RootContext = React.createContext<IRootContext>({
            refreshAuth: null,
            DislikedVideosPopup: null,
            I18n: null,
            YoutubeAuth: null,
            DislikedVideosStorage: null,
            ChromeMessaging: null,
            Theme: null,
            DislikedVideosLibrarySection: null
        });
    }
    return functionDef.RootContext;
}

export async function initRuntimeRootContext () {
    const runtimeContext: IRootContext = {
        DislikedVideosPopup: DislikedVideosPopupService.create(),
        DislikedVideosStorage: DislikedVideosStorageService.create(),
        DislikedVideosLibrarySection: DislikedVideosLibrarySectionService.create(),
        ChromeMessaging: ChromeMessagingService.create(),
        Theme: ThemeService.create()
    } as IRootContext;

    const [YoutubeAuth, I18n] = await Promise.all([
        new Promise<YoutubeAuthService>(async (resolve) => {
            const instance: YoutubeAuthService = await YoutubeAuthService.create();
            setTimeout(() => resolve(instance), 1000);
        }),
        I18nService.create()
    ]);

    runtimeContext.YoutubeAuth = YoutubeAuth;
    runtimeContext.I18n = I18n;

    return runtimeContext;
}

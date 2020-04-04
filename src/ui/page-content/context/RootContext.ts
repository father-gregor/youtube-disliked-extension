import React from 'react';

import {I18nService} from '../../../services/i18n.service';
import {YoutubeAuthService} from '../../../services/youtube-auth.service';
import {RendererPopupService} from '../../../services/renderer-popup.service';
import {DislikedVideosStorageService} from '../../../services/disliked-videos-storage.service';
import {ChromeMessagingService} from '../../../services/chrome-messaging.service';
import {ThemeService} from './../../../services/theme.service';
import {RendererLibrarySectionService} from '../../../services/renderer-library-section.service';

export interface IRootContext {
    RendererPopup: RendererPopupService;
    I18n: I18nService;
    YoutubeAuth: YoutubeAuthService;
    DislikedVideosStorage: DislikedVideosStorageService;
    ChromeMessaging: ChromeMessagingService;
    Theme: ThemeService;
    RendererLibrarySection: RendererLibrarySectionService;
}

export type RootContextType = React.ContextType<React.Context<IRootContext>>;

export function createRootContext () {
    const functionDef = createRootContext as any;
    if (!functionDef.RootContext) {
        functionDef.RootContext = React.createContext<IRootContext>({
            RendererPopup: null,
            I18n: null,
            YoutubeAuth: null,
            DislikedVideosStorage: null,
            ChromeMessaging: null,
            Theme: null,
            RendererLibrarySection: null
        });
    }
    return functionDef.RootContext;
}

export async function initRuntimeRootContext () {
    const runtimeContext: IRootContext = {
        RendererPopup: RendererPopupService.create(),
        DislikedVideosStorage: DislikedVideosStorageService.create(),
        RendererLibrarySection: RendererLibrarySectionService.create(),
        ChromeMessaging: ChromeMessagingService.create(),
        Theme: ThemeService.create()
    } as IRootContext;

    const [YoutubeAuth, I18n] = await Promise.all([
        YoutubeAuthService.create(),
        I18nService.create()
    ]);

    runtimeContext.YoutubeAuth = YoutubeAuth;
    runtimeContext.I18n = I18n;

    return runtimeContext;
}

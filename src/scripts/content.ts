import {contentPopup} from './content-popup';
import {contentLibrary} from './content-library';

import {I18nService} from '../services/i18n.service';
import {RendererPopupService} from '../services/renderer-popup.service';
import {RendererLibrarySectionService} from '../services/renderer-library-section.service';

import {BackgroundChromeMessageType} from '../interfaces/general';

import '../styles/content.scss';

let I18n: I18nService;
let RendererPopup: RendererPopupService = RendererPopupService.create();
let RendererLibrarySection: RendererLibrarySectionService = RendererLibrarySectionService.create();

(async () => {
    I18n = await I18nService.create();

    contentPopup({RendererPopup, I18n});

    if (location.href.includes('/feed/library')) {
        contentLibrary({RendererLibrarySection});
    }

    chrome.runtime.onMessage.addListener((data: {type: BackgroundChromeMessageType}, sender, sendResponse) => {
        if (data.type === 'libraryPageOpened') {
            contentLibrary({RendererLibrarySection});
        }
        sendResponse();
    });
})();
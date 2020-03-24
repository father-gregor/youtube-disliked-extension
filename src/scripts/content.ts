import {contentSidedrawer} from './content-sidedrawer';
import {contentLibrary} from './content-library';

import {I18nService} from '../services/i18n.service';
import {DislikedVideosPopupService} from '../services/disliked-videos-popup.service';

import '../styles/content.scss';
import {BackgroundChromeMessageType} from '../interfaces/general';
import { DislikedVideosLibrarySectionService } from "../services/disliked-videos-library-section.service";

let I18n: I18nService;
let DislikedVideosPopup: DislikedVideosPopupService = DislikedVideosPopupService.create();
let DislikedVideosLibrarySection: DislikedVideosLibrarySectionService = DislikedVideosLibrarySectionService.create();

(async () => {
    I18n = await I18nService.create();

    contentSidedrawer({DislikedVideosPopup, I18n});

    if (location.href.includes('/feed/library')) {
        contentLibrary({DislikedVideosLibrarySection});
    }

    chrome.runtime.onMessage.addListener((data: {type: BackgroundChromeMessageType}, sender, sendResponse) => {
        if (data.type === 'libraryPageOpened') {
            contentLibrary({DislikedVideosLibrarySection});
        }
        sendResponse();
    });
})();
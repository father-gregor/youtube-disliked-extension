import React from 'react';

import {renderRootComponent} from '../ui/page-content/components/RootContainer/RootContainer';
import {DislikedVideosSectionRoot} from '../ui/page-content/components/#library-section/DislikedVideosSectionRoot/DislikedVideosSectionRoot';

export class DislikedVideosLibrarySectionService {
    private static instance: DislikedVideosLibrarySectionService;

    private constructor () {}

    public renderSection (insertionPoint: HTMLElement) {
        renderRootComponent(insertionPoint, <DislikedVideosSectionRoot></DislikedVideosSectionRoot>);
    }

    public static create () {
        if (!DislikedVideosLibrarySectionService.instance) {
            DislikedVideosLibrarySectionService.instance = new DislikedVideosLibrarySectionService();
        }
        return DislikedVideosLibrarySectionService.instance;
    }
}

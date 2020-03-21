import React from 'react';

import {renderRootComponent} from '../ui/page-content/components/RootContainer/RootContainer';
import {DislikedVideosLibrarySection} from '../ui/page-content/components/DislikedVideosLibrarySection/DislikedVideosLibrarySection';

export class DislikedVideosLibrarySectionService {
    private static instance: DislikedVideosLibrarySectionService;

    private constructor () {}

    public renderSection (insertionPoint: HTMLElement) {
        renderRootComponent(insertionPoint, <DislikedVideosLibrarySection></DislikedVideosLibrarySection>);
    }

    public static create () {
        if (!DislikedVideosLibrarySectionService.instance) {
            DislikedVideosLibrarySectionService.instance = new DislikedVideosLibrarySectionService();
        }
        return DislikedVideosLibrarySectionService.instance;
    }
}

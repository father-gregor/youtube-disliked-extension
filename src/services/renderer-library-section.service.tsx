import React from 'react';

import {renderRootComponent} from '../ui/page-content/components/RootContainer/RootContainer';
import {DislikedVideosSectionRoot} from '../ui/page-content/components/#library-section/DislikedVideosSectionRoot/DislikedVideosSectionRoot';

export class RendererLibrarySectionService {
    private static instance: RendererLibrarySectionService;

    private constructor () {}

    public renderSection (insertionPoint: HTMLElement) {
        renderRootComponent(insertionPoint, <DislikedVideosSectionRoot></DislikedVideosSectionRoot>, {isContentCloseable: false});
    }

    public static create () {
        if (!RendererLibrarySectionService.instance) {
            RendererLibrarySectionService.instance = new RendererLibrarySectionService();
        }
        return RendererLibrarySectionService.instance;
    }
}

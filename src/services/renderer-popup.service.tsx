import React from 'react';

import {DislikedVideosPopupRoot} from '../ui/page-content/components/#popup/DislikedVideosPopupRoot/DislikedVideosPopupRoot';
import {renderRootComponent} from '../ui/page-content/components/RootContainer/RootContainer';

export class RendererPopupService {
    private listRootElem: Element;
    private isOpened: boolean;
    private isListInserted = false;
    private PAGE_MANAGE_SELECTOR = 'ytd-page-manager';
    private LIST_POPUP_ID = 'extension-root-disliked-popup';
    private LIST_OPENED_BODY_CLASS = 'body_disliked-list-opened';

    private static instance: RendererPopupService;

    private constructor () {}

    public get uiState () {
        return this.isOpened;
    }

    public toggleList () {
        if (this.isOpened) {
            this.closePopup();
        }
        else {
            this.openList();
        }
    }

    public openList () {
        if (!this.isListInserted) {
            if (document.querySelector(`#${this.LIST_POPUP_ID}`)) {
                throw new Error ('Disliked list root was already created!');
            }

            const container = document.querySelector(this.PAGE_MANAGE_SELECTOR);
            this.listRootElem = document.createElement('div');
            this.listRootElem.id = this.LIST_POPUP_ID;
            container.appendChild(this.listRootElem);

            this.isListInserted = true;
        }

        renderRootComponent(this.listRootElem, <DislikedVideosPopupRoot></DislikedVideosPopupRoot>, {isContentCloseable: true});
        document.body.classList.add(this.LIST_OPENED_BODY_CLASS);
        this.isOpened = true;
    }

    public closePopup () {
        renderRootComponent(this.listRootElem, null);
        document.body.classList.remove(this.LIST_OPENED_BODY_CLASS);
        this.isOpened = false;
    }

    public static create () {
        if (!RendererPopupService.instance) {
            RendererPopupService.instance = new RendererPopupService();
        }
        return RendererPopupService.instance;
    }
}

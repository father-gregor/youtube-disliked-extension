import React from 'react';

import {DislikedVideosPopupRoot} from '../ui/page-content/components/#popup/DislikedVideosPopupRoot/DislikedVideosPopupRoot';
import {renderRootComponent} from '../ui/page-content/components/RootContainer/RootContainer';

export class DislikedVideosPopupService {
    private listRootElem: Element;
    private isOpened: boolean;
    private isListInserted = false;
    private PAGE_MANAGE_SELECTOR = 'ytd-page-manager';
    private LIST_ROOT_ID = 'extension-root-disliked-list';
    private LIST_OPENED_BODY_CLASS = 'body_disliked-list-opened';

    private static instance: DislikedVideosPopupService;

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
            if (document.querySelector(`#${this.LIST_ROOT_ID}`)) {
                throw new Error ('Disliked list root was already created!');
            }

            const container = document.querySelector(this.PAGE_MANAGE_SELECTOR);
            this.listRootElem = document.createElement('div');
            this.listRootElem.id = this.LIST_ROOT_ID;
            container.appendChild(this.listRootElem);

            this.isListInserted = true;
        }

        renderRootComponent(this.listRootElem, <DislikedVideosPopupRoot></DislikedVideosPopupRoot>, true);
        document.body.classList.add(this.LIST_OPENED_BODY_CLASS);
        this.isOpened = true;
    }

    public closePopup () {
        renderRootComponent(this.listRootElem, null);
        document.body.classList.remove(this.LIST_OPENED_BODY_CLASS);
        this.isOpened = false;
    }

    public static create () {
        if (!DislikedVideosPopupService.instance) {
            DislikedVideosPopupService.instance = new DislikedVideosPopupService();
        }
        return DislikedVideosPopupService.instance;
    }
}

import { renderRootComponent } from "../ui/page-content/components/RootContainer/RootContainer";

export class DislikedVideosPopupService {
    private listRootElem: Element;
    private isOpened: boolean;
    private currentThemeMode: 'light' | 'dark';
    private isListInserted = false;
    private PAGE_MANAGE_SELECTOR = 'ytd-page-manager';
    private LIST_ROOT_ID = 'extension-root-disliked-list';
    private LIST_OPENED_BODY_CLASS = 'body_disliked-list-opened';

    private static instance: DislikedVideosPopupService;

    private constructor () {
        this.updateCurrentThemeMode();
    }

    public get uiState () {
        return this.isOpened;
    }

    public getCurrentThemeMode () {
        return this.currentThemeMode;
    }

    public toggleList () {
        if (this.isOpened) {
            this.closePopup();
        }
        else {
            this.openList();
        }
    }

    public updateCurrentThemeMode () {
        this.currentThemeMode = document.documentElement.getAttribute('dark') ? 'dark' : 'light';
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

        renderRootComponent(this.listRootElem, true);
        document.body.classList.add(this.LIST_OPENED_BODY_CLASS);
        this.isOpened = true;
    }

    public closePopup () {
        renderRootComponent(this.listRootElem, false);
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

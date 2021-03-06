import {RendererLibrarySectionService} from '../services/renderer-library-section.service';

interface IContentLibraryDependencies {
    RendererLibrarySection: RendererLibrarySectionService
}

export function contentLibrary ({RendererLibrarySection}: IContentLibraryDependencies) {
    const ITEM_SECTION_SELECTOR = 'ytd-app ytd-browse[role^="main"] ytd-section-list-renderer #contents ytd-item-section-renderer';
    const ITEM_SECTION_ID = 'extension-root-disliked-section';

    if (isAlreadyInserted()) {
        return;
    }

    const maxTries = 20;
    let currentTry = 0;
    const intervalId = setInterval(() => {
        const itemSectionContainerElem = getItemSectionContainer();
        if (itemSectionContainerElem) {
            clearInterval(intervalId);
            let dislikedSectionContainerElem: HTMLElement = itemSectionContainerElem.cloneNode(true) as HTMLElement;
            setupDislikedSectionProps(dislikedSectionContainerElem);
            dislikedSectionContainerElem = itemSectionContainerElem.parentNode.insertBefore(dislikedSectionContainerElem, itemSectionContainerElem.nextSibling);
            RendererLibrarySection.renderSection(dislikedSectionContainerElem);
        }
        else if (currentTry >= maxTries) {
            clearInterval(intervalId);
        }
        else {
            currentTry++;
        }
    }, 1000);

    function isAlreadyInserted () {
        const elem = document.querySelector(`#${ITEM_SECTION_ID}`);
        return !!elem;
    }

    function getItemSectionContainer () {
        const entryList = Array.from(document.querySelectorAll(ITEM_SECTION_SELECTOR));
        return entryList[3] as HTMLElement;
    }

    function setupDislikedSectionProps (container: HTMLElement) {
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
        container.id = ITEM_SECTION_ID;
    }
}

interface IContentLibraryDependencies {}

export function contentLibrary ({}: IContentLibraryDependencies) {
    const ITEM_SECTION_SELECTOR = 'ytd-app ytd-browse[role^="main"] ytd-section-list-renderer #contents ytd-item-section-renderer';

    const maxTries = 20;
    let currentTry = 0;
    const intervalId = setInterval(() => {
        const itemSectionContainerElem = getItemSectionContainer();
        if (itemSectionContainerElem) {
            clearInterval(intervalId);
            let dislikedSectionContainerElem: HTMLElement = itemSectionContainerElem.cloneNode(true) as HTMLElement;
            dislikedSectionContainerElem = itemSectionContainerElem.parentNode.insertBefore(dislikedSectionContainerElem, itemSectionContainerElem.nextSibling);
            setupDislikedSectionProps(dislikedSectionContainerElem, itemSectionContainerElem);
        }
        else if (currentTry >= maxTries) {
            clearInterval(intervalId);
        }
        else {
            currentTry++;
        }
    }, 1000);

    function getItemSectionContainer () {
        const entryList = Array.from(document.querySelectorAll(ITEM_SECTION_SELECTOR));
        return entryList[3] as HTMLElement;
    }

    function setupDislikedSectionProps (container: HTMLElement, originalContainer: HTMLElement) {
        container.style.height = '600px';
    }
}

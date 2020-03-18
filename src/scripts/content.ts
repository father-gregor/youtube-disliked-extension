import {I18nService} from '../services/i18n.service';
import {DislikedVideosPopupService} from '../services/disliked-videos-popup.service';

import '../styles/content.scss';

let I18n: I18nService;
let DislikedVideosPopup: DislikedVideosPopupService = DislikedVideosPopupService.create();

const LIKED_BUTTON_SELECTOR = 'ytd-app #sections ytd-guide-section-renderer ytd-guide-collapsible-section-entry-renderer #section-items ytd-guide-entry-renderer';

function getLikedButtonContainer () {
    const entryList = Array.from(document.querySelectorAll(LIKED_BUTTON_SELECTOR));
    return entryList[3];
}

function toggleDislikedList (event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    DislikedVideosPopup.toggleList();
}

function setupDislikedButtonProps (container: Element, originalContainer: Element) {
    container.setAttribute('data-disliked-button', 'true');

    // Removing href attribute from <a> tag and setting custom title
    const dislikedButtonElem = container.firstElementChild;
    dislikedButtonElem.removeAttribute('href');
    dislikedButtonElem.setAttribute('title', I18n.getMessage('dislikedButtonText'));

    // Replacing original title of button with custom one
    const buttonTitleElem = dislikedButtonElem.firstElementChild.getElementsByTagName('yt-formatted-string')[0];
    buttonTitleElem.innerHTML = I18n.getMessage('dislikedButtonText');

    // Copying 'Like' icon's html code and rotating it 
    let originalButtonIconElem: HTMLElement = originalContainer.firstElementChild.getElementsByTagName('yt-icon')[0] as HTMLElement;
    let buttonIconElem: HTMLElement = dislikedButtonElem.firstElementChild.getElementsByTagName('yt-icon')[0] as HTMLElement;
    buttonIconElem.innerHTML = originalButtonIconElem.innerHTML;
    buttonIconElem.style.transform = 'rotate(180deg)';

    // Removing element that gives extra padding
    const buttonShadowElem = dislikedButtonElem.firstElementChild.getElementsByTagName('yt-img-shadow')[0];
    dislikedButtonElem.firstElementChild.removeChild(buttonShadowElem);

    container.addEventListener('click', toggleDislikedList, true);
}

(async () => {
    I18n = await I18nService.create();
    
    const maxTries = 20;
    let currentTry = 0;
    const intervalId = setInterval(() => {
        const likedButtonContainerElem = getLikedButtonContainer();
        if (likedButtonContainerElem) {
            clearInterval(intervalId);
            let dislikedButtonContainerElem: Element = likedButtonContainerElem.cloneNode(true) as Element;
            dislikedButtonContainerElem = likedButtonContainerElem.parentNode.insertBefore(dislikedButtonContainerElem, likedButtonContainerElem.nextSibling);
            setupDislikedButtonProps(dislikedButtonContainerElem, likedButtonContainerElem);
        }
        else if (currentTry >= maxTries) {
            clearInterval(intervalId);
        }
        else {
            currentTry++;
        }
    }, 1000);
})();
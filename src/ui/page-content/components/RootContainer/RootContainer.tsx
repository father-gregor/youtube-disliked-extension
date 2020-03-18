import React from 'react';
import ReactDOM from 'react-dom';
import {Theme, ThemeProvider} from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import {LoadingSpinner} from '../LoadingSpinner/LoadingSpinner';
import {CloseListButton} from '../CloseListButton/CloseListButton';
import {PreAuthScreen} from '../PreAuthScreen/PreAuthScreeen';
import {MessageWithButton} from '../MessageWithButton/MessageWithButton';
import {ThemeChangeListener} from '../ThemeChangeListener/ThemeChangeListener';
import {DislikedVideosContainer} from '../DislikedVideosContainer/DislikedVideosContainer';

import {Bind} from '../../decorators/Bind.decorator';
import {createRootContext, IRootContext} from './RootContext';
import {createRootTheme} from './RootTheme';
import {GeneralErrorType} from '../../../../interfaces/general';
import {DislikedListService} from '../../../../services/disliked-list.service';
import {YoutubeAuthService} from '../../../../services/youtube-auth.service';
import {I18nService} from '../../../../services/i18n.service';
import {DislikedVideosStorageService} from '../../../../services/disliked-videos-storage.service';
import {ChromeMessagingService} from '../../../../services/chrome-messaging.service';

import './RootContainer.scss';

const RootContext = createRootContext();

interface IRootContainerState {
    isAuthorized: boolean;
    isRootContextLoaded: boolean;
    rootContext: IRootContext;
    rootTheme: Theme;
    currentError: string;
}

let PreMountError: string = null;

export class RootContainer extends React.Component<{}, IRootContainerState> {
    private rootContext: IRootContext = {
        DislikedList: null,
        I18n: null,
        YoutubeAuth: null,
        DislikedVideosStorage: null,
        ChromeMessaging: null
    };
    private mounted: boolean;
    private messagingSubId: number;

    constructor (props) {
        super(props);

        this.updateRootContext({
            DislikedList: DislikedListService.create(),
            DislikedVideosStorage: DislikedVideosStorageService.create(),
            ChromeMessaging: ChromeMessagingService.create()
        });

        this.messagingSubId = this.rootContext.ChromeMessaging.subscribeToErrors((errorType: GeneralErrorType) => {
            if (this.mounted) {
                this.setState({currentError: errorType});
            }
            else {
                PreMountError = errorType;
            }
        });

        this.state = {
            isAuthorized: this.rootContext.YoutubeAuth ? this.rootContext.YoutubeAuth.isAuthorized() : false,
            isRootContextLoaded: false,
            rootContext: this.rootContext,
            rootTheme: createRootTheme(this.rootContext.DislikedList.getCurrentThemeMode()),
            currentError: PreMountError
        };

        if (PreMountError) {
            PreMountError = null;
        }

        this.initAsyncContext();
    }

    initAsyncContext () {
        YoutubeAuthService.create().then((instance) => {
            setTimeout(() => this.updateRootContext({YoutubeAuth: instance}), 1000);
        });

        I18nService.create().then((instance: I18nService) => {
            this.updateRootContext({I18n: instance});
        });
    }

    updateRootContext (newContext: object) {
        this.rootContext = {...this.rootContext, ...newContext};

        for (let key of Object.keys(this.rootContext)) {
            if (!this.rootContext[key]) {
                return false;
            }
        }

        this.setState({
            isRootContextLoaded: true,
            rootContext: this.rootContext
        });
    }

    @Bind
    updateRootTheme (currentTheme: 'dark' | 'light') {
        this.setState({
            rootTheme: createRootTheme(currentTheme)
        });
    }

    @Bind
    handleSuccessAuth () {
        this.setState({
            isAuthorized: true
        });
    }

    @Bind
    handleCloseList () {
        this.rootContext.DislikedList.closeList();
    }

    componentDidMount () {
        this.mounted = true;
        if (PreMountError) {
            this.setState({
                currentError: PreMountError
            });
            PreMountError = null;
        }
    }

    componentWillUnmount () {
        this.mounted = false;
        PreMountError = null;
        if (this.messagingSubId) {
            this.rootContext.ChromeMessaging.unsubscribe(this.messagingSubId);
        }
    }

    render () {
        let content;
        let isCentered = true;
        if (this.state.isRootContextLoaded) {
            const YoutubeAuth = this.state.rootContext.YoutubeAuth;
            const I18n = this.rootContext.I18n;

            if (this.state.currentError) {
                content = <MessageWithButton message={I18n.getMessage(`${this.state.currentError}Error`)}></MessageWithButton>;
            }
            else {
                if (YoutubeAuth.isAuthorized()) {
                    content = <DislikedVideosContainer></DislikedVideosContainer>;
                    isCentered = false;
                }
                else {
                    content = <PreAuthScreen onSuccessAuth={this.handleSuccessAuth}></PreAuthScreen>;
                }
            }
        }
        else {
            content = <LoadingSpinner/>
        }

        return (
            <RootContext.Provider value={this.state.rootContext}>
                <ThemeProvider theme={this.state.rootTheme}>
                    <ClickAwayListener onClickAway={this.handleCloseList}>
                        <div className={`react-root-disliked-list-container ${isCentered ? 'centered' : ''}`}>
                            <CloseListButton onClose={this.handleCloseList}></CloseListButton>
                            {content}
                        </div>
                    </ClickAwayListener>

                    <ThemeChangeListener onThemeChange={this.updateRootTheme}></ThemeChangeListener>
                </ThemeProvider>
            </RootContext.Provider>
        );
    }
}

export function renderRootComponent (elem: Element, isOpened: boolean) {
    ReactDOM.render(
        isOpened ? <RootContainer/> : null,
        elem
    )
}

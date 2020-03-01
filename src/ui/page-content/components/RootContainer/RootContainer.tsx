import React from 'react';
import ReactDOM from 'react-dom';
import {Theme, ThemeProvider} from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import {LoadingSpinner} from '../LoadingSpinner/LoadingSpinner';
import {CloseListButton} from '../CloseListButton/CloseListButton';
import {PreAuthScreen} from '../PreAuthScreen/PreAuthScreeen';
import {ThemeChangeListener} from '../ThemeChangeListener/ThemeChangeListener';
import {DislikedVideos} from '../DislikedVideos/DislikedVideos';

import {Bind} from '../../decorators/Bind.decorator';
import {createRootContext, IRootContext} from './RootContext';
import {createRootTheme} from './RootTheme';
import {DislikedListService} from '../../../../services/disliked-list.service';
import {YoutubeAuthService} from '../../../../services/youtube-auth.service';
import {I18nService} from '../../../../services/i18n.service';
import {DislikedVideosStorageService} from '../../../../services/disliked-videos-storage.service';

import './RootContainer.scss';

const RootContext = createRootContext();

export class RootContainer extends React.Component<{}, {isAuthorized: boolean, rootContext: IRootContext, rootTheme: Theme}> {
    private rootContext: IRootContext = {
        DislikedList: null,
        I18n: null,
        YoutubeAuth: null,
        DislikedVideosStorage: null
    };

    constructor (props) {
        super(props);

        this.initContext();

        this.state = {
            isAuthorized: this.rootContext.YoutubeAuth ? this.rootContext.YoutubeAuth.isAuthorized() : false,
            rootContext: this.rootContext,
            rootTheme: createRootTheme(this.rootContext.DislikedList.getCurrentThemeMode())
        };
    }

    initContext () {
        this.updateRootContext({
            DislikedList: DislikedListService.create(),
            DislikedVideosStorage: DislikedVideosStorageService.create()
        });

        YoutubeAuthService.create().then((instance) => {
            setTimeout(() => {
                this.updateRootContext({YoutubeAuth: instance});
            }, 1000);
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

    render () {
        const YoutubeAuth = this.state.rootContext.YoutubeAuth;
        let content;

        if (YoutubeAuth) {
            if (YoutubeAuth.isAuthorized()) {
                content = <DislikedVideos></DislikedVideos>;
            }
            else {
                content = <PreAuthScreen onSuccessAuth={this.handleSuccessAuth}></PreAuthScreen>;
            }
        }
        else {
            content = <LoadingSpinner/>
        }

        return (
            <RootContext.Provider value={this.state.rootContext}>
                <ThemeProvider theme={this.state.rootTheme}>
                    <ClickAwayListener onClickAway={this.handleCloseList}>
                        <div className='react-root-disliked-list-container'>
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

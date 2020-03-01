import React from 'react';
import ReactDOM from 'react-dom';

import {LoadingSpinner} from '../LoadingSpinner/LoadingSpinner';
import {CloseListButton} from '../CloseListButton/CloseListButton';
import {PreAuthScreen} from '../PreAuthScreen/PreAuthScreeen';

import {Bind} from '../../decorators/Bind.decorator';
import {createRootContext, IRootContext} from "./RootContext";
import {DislikedListService} from '../../../../services/disliked-list.service';
import {YoutubeAuthService} from "../../../../services/youtube-auth.service";
import {I18nService} from "../../../../services/i18n.service";

import './DislikedListContainer.scss';

const RootContext = createRootContext();

export class DislikedListContainer extends React.Component<{}, {rootContext: IRootContext}> {
    private rootContext: IRootContext = {
        DislikedList: null,
        I18n: null,
        YoutubeAuth: null
    };

    constructor (props) {
        super(props);

        this.state = {
            rootContext: this.rootContext
        };

        this.initContext();
    }

    initContext () {
        this.updateRootContext({DislikedList: DislikedListService.create()})

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
    handleCloseList () {
        this.rootContext.DislikedList.closeList();
    }

    render () {
        const YoutubeAuth = this.state.rootContext.YoutubeAuth;
        let content;

        if (YoutubeAuth) {
            if (YoutubeAuth.isAuthorized()) {
                content = <p>Test React Render</p>;
            }
            else {
                content = <PreAuthScreen></PreAuthScreen>;
            }
        }
        else {
            content = <LoadingSpinner/>
        }

        return (
            <RootContext.Provider value={this.state.rootContext}>
                <div className='react-root-disliked-list-container'>
                    <CloseListButton onClose={this.handleCloseList}></CloseListButton>
                    {content}
                </div>
            </RootContext.Provider>
        );
    }
}

export function renderRootComponent (elem: Element, isOpened: boolean) {
    ReactDOM.render(
        isOpened ? <DislikedListContainer/> : null,
        elem
    )
}

import React from 'react';
import ReactDOM from 'react-dom';

import {LoadingSpinner} from '../LoadingSpinner/LoadingSpinner';
import {CloseListButton} from '../CloseListButton/CloseListButton';

import {Bind} from '../../decorators/Bind.decorator';
import {DislikedListService} from '../../../../services/disliked-list.service';
import {YoutubeAuthService} from "../../../../services/youtube-auth.service";

import './DislikedListContainer.scss';

export class DislikedListContainer extends React.Component<{}, {isAuthLoaded: boolean}> {
    private DislikedList: DislikedListService;
    private YoutubeAuth: YoutubeAuthService;

    constructor (props) {
        super(props);

        this.state = {
            isAuthLoaded: null
        };

        this.DislikedList = DislikedListService.create();
        YoutubeAuthService.create().then((instance) => {
            this.YoutubeAuth = instance;
            setTimeout(() => {
                this.setState({
                    isAuthLoaded: this.YoutubeAuth.isAuthorized()
                });
            }, 1000);
        });
    }

    @Bind
    handleCloseList () {
        this.DislikedList.closeList();
    }

    render () {
        let content;

        if (this.state.isAuthLoaded != null) {
            content = <p>Test React Render</p>;
        }
        else {
            content = <LoadingSpinner/>
        }

        return (
            <div className='react-root-disliked-list-container'>
                <CloseListButton onClose={this.handleCloseList}></CloseListButton>
                {content}
            </div>
        );
    }
}

export function renderRootComponent (elem: Element, isOpened: boolean) {
    ReactDOM.render(
        isOpened ? <DislikedListContainer/> : null,
        elem
    )
}

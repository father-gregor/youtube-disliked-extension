import React from 'react';
import Grid from '@material-ui/core/Grid';
import {ic_refresh} from 'react-icons-kit/md/ic_refresh'

import {LoadingSpinner} from '../LoadingSpinner/LoadingSpinner';
import {MessageWithButton} from '../MessageWithButton/MessageWithButton';
import {DislikedVideosInfoPanel} from '../DislikedVideosInfoPanel/DislikedVideosInfoPanel';
import {DislikedVideosList} from '../DislikedVideosList/DislikedVideosList';

import {Bind} from '../../decorators/Bind.decorator';
import {IRootContext, createRootContext, RootContextType} from '../RootContainer/RootContext';
import {IYoutubeVideo} from "../../../../interfaces/video";

import './DislikedVideosContainer.scss';
import { IUserChannel } from "../../../../interfaces/channel";

interface IDislikedVideosContainerState {
    videos: IYoutubeVideo[];
    isMoreVideosAvailable: boolean;
    loadedState?: 'notReady' | 'ready' | 'failed';
}

export class DislikedVideosContainer extends React.Component<{}, IDislikedVideosContainerState> {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    constructor (props) {
        super(props);

        this.state = {
            videos: [],
            isMoreVideosAvailable: true,
            loadedState: 'notReady'
        };
    }

    componentDidMount() {
        this.loadVideos();
    }

    @Bind
    async loadVideos () {
        try {
            const videos: IYoutubeVideo[] = await this.context.DislikedVideosStorage.getVideos();
            this.setState((state: IDislikedVideosContainerState) => {
                const newState: IDislikedVideosContainerState = {
                    videos: state.videos.concat(videos),
                    isMoreVideosAvailable: this.context.DislikedVideosStorage.isMoreVideosAvailable()
                };
                if (state.loadedState !== 'ready') {
                    newState.loadedState = 'ready';
                }
                return newState;
            });
        }
        catch (err) {
            this.setState({
                loadedState: 'failed'
            });
        }
    }

    render () {
        let content;
        let isCentered = false;
        let channel = this.context.YoutubeAuth.getUserChannel();

        if (this.state.loadedState === 'notReady') {
            content = <LoadingSpinner/>;
            isCentered = true;
        }
        else if (this.state.loadedState === 'ready') {
            content =
                <DislikedVideosList videos={this.state.videos}
                                    showLoadVideosButton={this.state.isMoreVideosAvailable}
                                    loadVideos={this.loadVideos}>
                </DislikedVideosList>;
        }
        else if (this.state.loadedState === 'failed') {
            content = 
                <MessageWithButton message={this.context.I18n.getMessage('failedToLoadVideosMessage')}
                                buttonTitle={this.context.I18n.getMessage('failedToLoadVideosButton')}
                                buttonIcon={ic_refresh}
                                buttonDisabled={false}
                                onButtonClick={this.loadVideos}>
                </MessageWithButton>;
        }

        return (
            <div className='disliked-videos-container'>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <DislikedVideosInfoPanel channelTitle={channel.title} channelAvatar={channel.thumbnail}></DislikedVideosInfoPanel>
                    </Grid>
                    <Grid className={isCentered ? 'centered' : ''} item xs={12} sm={8}>
                        {content}
                    </Grid>
                </Grid>
            </div>
        );
    }
}
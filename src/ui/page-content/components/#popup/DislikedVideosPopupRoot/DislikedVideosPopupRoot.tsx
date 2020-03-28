import React from 'react';
import Grid from '@material-ui/core/Grid';
import {ic_refresh} from 'react-icons-kit/md/ic_refresh'

import {LoadingSpinner} from '../../LoadingSpinner/LoadingSpinner';
import {MessageWithButton} from '../../MessageWithButton/MessageWithButton';
import {DislikedVideosInfoPanel} from '../DislikedVideosInfoPanel/DislikedVideosInfoPanel';
import {DislikedVideosList} from '../DislikedVideosList/DislikedVideosList';
import {NoVideosError} from '../../NoVideosError/NoVideosError';

import {Bind} from '../../../decorators/Bind.decorator';
import {IRootContext, createRootContext, RootContextType} from '../../../context/RootContext';
import {IYoutubeVideo} from '../../../../../interfaces/video';

import './DislikedVideosPopupRoot.scss';

interface IDislikedVideosPopupRootState {
    videos: IYoutubeVideo[];
    videosTotalCount?: number;
    isMoreVideosAvailable: boolean;
    isVideosLoading?: boolean;
    loadedState?: 'notReady' | 'ready' | 'failed';
}

export class DislikedVideosPopupRoot extends React.Component<{}, IDislikedVideosPopupRootState> {
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
        this.loadVideos(true);
    }

    @Bind
    async loadVideos (isFirstLoad?: boolean) {
        try {
            this.setState({
                isVideosLoading: true
            });
            const videos: IYoutubeVideo[] = await this.context.DislikedVideosStorage.getVideos(isFirstLoad);
            this.setState((state: IDislikedVideosPopupRootState) => {
                const newState: IDislikedVideosPopupRootState = {
                    videos: state.videos.concat(videos),
                    videosTotalCount: this.context.DislikedVideosStorage.getTotalCount(),
                    isVideosLoading: false,
                    isMoreVideosAvailable: this.context.DislikedVideosStorage.isMoreVideosAvailable()
                };
                if (state.videosTotalCount == null) {
                    newState.videosTotalCount = this.context.DislikedVideosStorage.getTotalCount();
                }
                if (state.loadedState !== 'ready') {
                    newState.loadedState = 'ready';
                }
                return newState;
            });
        }
        catch (err) {
            this.setState({
                loadedState: 'failed',
                isVideosLoading: false
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
                                    totalCount={this.state.videosTotalCount}
                                    showLoadVideosButton={this.state.isMoreVideosAvailable}
                                    disableLoadVideosButton={this.state.isVideosLoading}
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
                {channel 
                    ? <Grid container spacing={0} className='root-grid'>
                        <Grid className={'info-column-grid'} item xs={12} sm={4} md={3}>
                            <DislikedVideosInfoPanel channelTitle={channel.title}
                                                    channelAvatar={channel.thumbnail}
                                                    channelUrl={channel.url}
                                                    videosTotalCount={this.state.videosTotalCount}>
                            </DislikedVideosInfoPanel>
                        </Grid>
                        <Grid className={`content-column-grid ${isCentered ? 'centered' : ''}`} item xs={12} sm={8} md={9}>
                            {content}
                        </Grid>
                    </Grid>
                    : <div className='centered'>
                        <NoVideosError></NoVideosError>
                    </div>
                }
            </div>
        );
    }
}
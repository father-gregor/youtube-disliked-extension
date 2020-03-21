import React from 'react';
import {ic_refresh} from 'react-icons-kit/md/ic_refresh'

import {LoadingSpinner} from '../../LoadingSpinner/LoadingSpinner';
import {DislikedVideosHeader} from '../DislikedVideosHeader/DislikedVideosHeader';
import {MessageWithButton} from '../../MessageWithButton/MessageWithButton';
import {DislikedVideosSlider} from '../DislikedVideosSlider/DislikedVideosSlider';

import {Bind} from '../../../decorators/Bind.decorator';
import {createRootContext, IRootContext, RootContextType} from '../../../context/RootContext';
import {IYoutubeVideo} from '../../../../../interfaces/video';

interface IDislikedVideosPopupRootState {
    videos: IYoutubeVideo[];
    videosTotalCount?: number;
    loadedState?: 'notReady' | 'ready' | 'failed';
}

export class DislikedVideosSectionRoot extends React.Component<{}, IDislikedVideosPopupRootState> {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    constructor (props) {
        super(props);

        this.state = {
            videos: [],
            loadedState: 'notReady'
        };
    }

    componentDidMount() {
        this.loadVideos(true);
    }

    @Bind
    async loadVideos (isFirstLoad?: boolean) {
        try {
            const videos: IYoutubeVideo[] = await this.context.DislikedVideosStorage.getVideos(isFirstLoad);
            this.setState((state: IDislikedVideosPopupRootState) => {
                const newState: IDislikedVideosPopupRootState = {
                    videos: state.videos.concat(videos)
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
                loadedState: 'failed'
            });
        }
    }

    render () {
        let content;
        let isCentered = false;

        if (this.state.loadedState === 'notReady') {
            isCentered = true;
            content = <LoadingSpinner/>;
        }
        else if (this.state.loadedState === 'ready') {
            content = <DislikedVideosSlider videos={this.state.videos}></DislikedVideosSlider>;
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
            <div className='disliked-videos-section-root'>
                <DislikedVideosHeader videosTotalCount={this.state.videosTotalCount}></DislikedVideosHeader>
                <section className={isCentered ? 'centered' : ''}>
                    {content}
                </section>
            </div>
        );
    }
}

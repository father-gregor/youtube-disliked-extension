import React from 'react';

import {MessageWithButton} from '../MessageWithButton/MessageWithButton';

import {Bind} from '../../decorators/Bind.decorator';
import {IRootContext, createRootContext, RootContextType} from '../RootContainer/RootContext';
import {IYoutubeVideo} from '../../../../interfaces/video';

interface IDislikedVideosListProps {
    videos: IYoutubeVideo[];
    showLoadVideosButton: boolean;
    loadVideos: () => void;
}

export class DislikedVideosList extends React.Component<IDislikedVideosListProps> {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    @Bind
    handleLoadVideosClick () {
        this.props.loadVideos();
    }

    render () {
        let videos = [];
        for (let video of this.props.videos) {
            videos.push(<div key={video.id}>{video.title}</div>);
        }

        return (
            <div className='disliked-videos-list'>
                <div>
                    {videos}
                </div>
                {this.props.showLoadVideosButton &&
                    <MessageWithButton buttonTitle={this.context.I18n.getMessage('loadMoreVideosButton')}
                                    onButtonClick={this.handleLoadVideosClick}>
                    </MessageWithButton>
                }
            </div>
        );
    }
}
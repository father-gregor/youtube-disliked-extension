import React from 'react';

import {DislikedVideoItem} from '../DislikedVideoItem/DislikedVideoItem';
import {MessageWithButton} from '../MessageWithButton/MessageWithButton';

import {Bind} from '../../decorators/Bind.decorator';
import {IRootContext, createRootContext, RootContextType} from '../../context/RootContext';
import {IYoutubeVideo} from '../../../../interfaces/video';

import './DislikedVideosList.scss';

interface IDislikedVideosListProps {
    videos: IYoutubeVideo[];
    totalCount: number;
    showLoadVideosButton: boolean;
    disableLoadVideosButton: boolean;
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
        this.props.videos.forEach((video, index) => {
            videos.push(<DislikedVideoItem key={video.id} video={video} index={index + 1}></DislikedVideoItem>);
        });

        return (
            <div className='disliked-videos-list'>
                {videos}
                {this.props.showLoadVideosButton &&
                    <MessageWithButton buttonTitle={this.context.I18n.getMessage('loadMoreVideosButton')}
                                       onButtonClick={this.handleLoadVideosClick}
                                       buttonDisabled={this.props.disableLoadVideosButton}>
                    </MessageWithButton>
                }
            </div>
        );
    }
}
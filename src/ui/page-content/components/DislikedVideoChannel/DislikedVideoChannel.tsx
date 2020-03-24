import React from 'react';

import {Bind} from '../../decorators/Bind.decorator';

import './DislikedVideoChannel.scss';

interface IDislikedVideoChannel {
    channelUrl: string;
    channelTitle: string;
}

export class DislikedVideoChannel extends React.Component<IDislikedVideoChannel> {
    @Bind
    handleOpenChannelLink (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        e.stopPropagation();
    }

    render () {
        return (
            <div className='disliked-video-channel'>
                <a className='channel-url' href={this.props.channelUrl} onClick={this.handleOpenChannelLink}>{this.props.channelTitle}</a>
            </div>
        );
    }
}

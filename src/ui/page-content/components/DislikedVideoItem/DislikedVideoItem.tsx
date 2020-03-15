import React from 'react';
import Grid from '@material-ui/core/Grid';

import {IYoutubeVideo} from '../../../../interfaces/video';

import './DislikedVideoItem.scss';

import {Bind} from '../../decorators/Bind.decorator';

interface IDislikedVideoItemProps {
    video: IYoutubeVideo;
    index: number;
}

export class DislikedVideoItem extends React.Component<IDislikedVideoItemProps> {
    private videoLinkTag: React.RefObject<HTMLAnchorElement>;
    
    constructor (props) {
        super(props);

        this.videoLinkTag = React.createRef<HTMLAnchorElement>();
    }

    @Bind
    handleOpenVideoLink () {
        this.videoLinkTag.current.click();
    }

    @Bind
    handleOpenChannelLink (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        e.stopPropagation();
    }

    render () {
        return (
            <Grid className='disliked-video-item' container spacing={0} onClick={this.handleOpenVideoLink}>
                <Grid item className='item-index'>{this.props.index}</Grid>
                <Grid item xs={12} sm container className='item-metadata'>
                    <Grid item className='item-thumbnail'>
                        <a href={this.props.video.url}>
                            <img alt={this.props.video.title} width={120} src={this.props.video.thumbnail}></img>
                        </a>
                        <div className='item-duration'>{this.props.video.duration}</div>
                    </Grid>
                    <Grid item xs container direction='column'>
                        <div className='item-title'>
                            <a href={this.props.video.url}>{this.props.video.title}</a>
                        </div>
                        <div className='item-channel-title'>
                            <a href={this.props.video.channelUrl} onClick={this.handleOpenChannelLink}>{this.props.video.channelTitle}</a>
                        </div>
                    </Grid>
                </Grid>
                <a ref={this.videoLinkTag}
                   href={this.props.video.url}
                   target='_blank'
                   style={{display: 'none'}}>
                </a>
            </Grid>
        );
    }
}

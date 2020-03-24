import React from 'react';
import Grid from '@material-ui/core/Grid';

import {DislikedVideoContainer} from '../../DislikedVideoContainer/DislikedVideoContainer';
import {DislikedVideoThumbnail} from '../../DislikedVideoThumbnail/DislikedVideoThumbnail';
import {DislikedVideoChannel} from '../../DislikedVideoChannel/DislikedVideoChannel';

import {IYoutubeVideo} from '../../../../../interfaces/video';

import './DislikedVideoItem.scss';

interface IDislikedVideoItemProps {
    video: IYoutubeVideo;
    index: number;
}

export class DislikedVideoItem extends React.Component<IDislikedVideoItemProps> {
    render () {
        return (
            <section className='disliked-video-item'>
                <DislikedVideoContainer video={this.props.video}>
                    <Grid item className='item-index'>{this.props.index}</Grid>
                    <Grid item xs={12} sm container className='item-metadata'>
                        <DislikedVideoThumbnail video={this.props.video} width={120}></DislikedVideoThumbnail>
                        <Grid item xs container direction='column'>
                            <div className='item-title'>
                                <a href={this.props.video.url}>{this.props.video.title}</a>
                            </div>
                            <DislikedVideoChannel channelUrl={this.props.video.channelUrl} channelTitle={this.props.video.channelTitle}></DislikedVideoChannel>
                        </Grid>
                    </Grid>
                </DislikedVideoContainer>
            </section>
        );
    }
}

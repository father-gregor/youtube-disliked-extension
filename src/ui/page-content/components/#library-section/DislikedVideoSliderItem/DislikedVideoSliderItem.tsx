import React from 'react';
import Grid from '@material-ui/core/Grid';

import {DislikedVideoContainer} from '../../DislikedVideoContainer/DislikedVideoContainer';
import {DislikedVideoThumbnail} from '../../DislikedVideoThumbnail/DislikedVideoThumbnail';
import {DislikedVideoChannel} from '../../DislikedVideoChannel/DislikedVideoChannel';

import {IYoutubeVideo} from '../../../../../interfaces/video';

import './DislikedVideoSliderItem.scss';

interface IDislikedVideoSliderItemProps {
    video: IYoutubeVideo;
}

export class DislikedVideoSliderItem extends React.Component<IDislikedVideoSliderItemProps> {
    private maxWidth = 210;

    render () {
        return (
            <section className='disliked-video-slider-item'>
                <DislikedVideoContainer video={this.props.video}>
                    <Grid item xs={12} sm container direction='column'>
                        <DislikedVideoThumbnail video={this.props.video} width={this.maxWidth}></DislikedVideoThumbnail>
                        <div className='slider-item-title' style={{maxWidth: this.maxWidth}}>
                            <a href={this.props.video.url}>{this.props.video.title}</a>
                        </div>
                        <DislikedVideoChannel channelUrl={this.props.video.channelUrl} channelTitle={this.props.video.channelTitle}></DislikedVideoChannel>
                        <div className='slider-item-viewcount'>
                            {this.props.video.viewCountLocalized}
                        </div>
                        <div className='slider-item-published'>
                            {this.props.video.publishedAt}
                        </div>
                    </Grid>
                </DislikedVideoContainer>
            </section>
        );
    }
}

import React from 'react';
import Grid from '@material-ui/core/Grid';

import {IYoutubeVideo} from '../../../../interfaces/video';

import './DislikedVideoThumbnail.scss';

interface IDislikedVideoThumbnail {
    video: IYoutubeVideo;
    width: number;
}

export class DislikedVideoThumbnail extends React.Component<IDislikedVideoThumbnail> {
    render () {
        return (
            <section className='disliked-video-thumbnail'>
                <Grid item>
                    <a href={this.props.video.url}>
                        <img alt={this.props.video.title} width={this.props.width} src={this.props.video.thumbnail}></img>
                    </a>
                    <div className='item-duration'>{this.props.video.duration}</div>
                </Grid>
            </section>
        );
    }
}

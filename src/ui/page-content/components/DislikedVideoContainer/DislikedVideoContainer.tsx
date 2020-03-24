import React from 'react';
import Grid from '@material-ui/core/Grid';

import {IYoutubeVideo} from '../../../../interfaces/video';
import {Bind} from '../../decorators/Bind.decorator';

import './DislikedVideoContainer.scss';

interface IDislikedVideoThumbnail {
    video: IYoutubeVideo;
}

export class DislikedVideoContainer extends React.Component<IDislikedVideoThumbnail> {
    private videoLinkTag: React.RefObject<HTMLAnchorElement>;

    constructor (props) {
        super(props);

        this.videoLinkTag = React.createRef<HTMLAnchorElement>();
    }

    @Bind
    handleOpenVideoLink () {
        this.videoLinkTag.current.click();
    }

    render () {
        return (
            <Grid className='disliked-video-container' container spacing={0} onClick={this.handleOpenVideoLink}>
                {this.props.children}
                <a ref={this.videoLinkTag}
                   href={this.props.video.url}
                   target='_blank'
                   style={{display: 'none'}}>
                </a>
            </Grid>
        );
    }
}
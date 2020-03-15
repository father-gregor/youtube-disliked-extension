import React from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

import './DislikedVideosInfoPanel.scss';

interface IDislikedVideosInfoPanelProps {
    channelTitle: string
    channelAvatar: string;
    channelUrl: string;
}

export class DislikedVideosInfoPanel extends React.Component<IDislikedVideosInfoPanelProps> {
    render () {
        return (
            <div className='disliked-videos-info-panel'>
                <Grid container item xs={12} spacing={3}>
                    <Grid item>
                        <a href={this.props.channelUrl}>
                            <Avatar alt={this.props.channelTitle} src={this.props.channelAvatar}></Avatar>
                        </a>
                    </Grid>
                    <Grid item className='channel-title-container'>
                        <a href={this.props.channelUrl}>{this.props.channelTitle}</a>
                    </Grid>
                </Grid>
                <Divider/>
                <Grid container item xs={12}></Grid>
            </div>
        );
    }
}
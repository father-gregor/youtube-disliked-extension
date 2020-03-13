import React from 'react';
import {Icon} from 'react-icons-kit';
import {ic_clear} from 'react-icons-kit/md/ic_clear';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

import {Bind} from "../../decorators/Bind.decorator";

import './DislikedVideosInfoPanel.scss';

interface IDislikedVideosInfoPanelProps {
    channelTitle: string
    channelAvatar: string;
}

export class DislikedVideosInfoPanel extends React.Component<IDislikedVideosInfoPanelProps> {
    @Bind
    handleCloseList () {
        // this.props.onClose();
    }

    render () {
        return (
            <div className='disliked-videos-info-panel'>
                <Grid container item xs={12} spacing={3}>
                    <Grid item>
                        <Avatar alt={this.props.channelTitle} src={this.props.channelAvatar}></Avatar>
                    </Grid>
                    <Grid item className='channel-title-container'>
                        <span>{this.props.channelTitle}</span>
                    </Grid>
                </Grid>
                <Divider/>
                <Grid container item xs={12}></Grid>
            </div>
        );
    }
}
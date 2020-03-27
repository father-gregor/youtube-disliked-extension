import React from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import {Icon} from 'react-icons-kit';
import {exit} from 'react-icons-kit/icomoon/exit'

import {IRootContext, createRootContext, RootContextType} from '../../../context/RootContext';
import {Bind} from '../../../decorators/Bind.decorator';

import './DislikedVideosInfoPanel.scss';

interface IDislikedVideosInfoPanelProps {
    channelTitle: string
    channelAvatar: string;
    channelUrl: string;
    videosTotalCount: number;
}

export class DislikedVideosInfoPanel extends React.Component<IDislikedVideosInfoPanelProps> {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    @Bind
    async handleAuthLogoutClick () {
        await this.context.YoutubeAuth.removeAuth();
        this.context.refreshAuth();
    }

    render () {
        return (
            <div className='disliked-videos-info-panel'>
                <Grid container item xs={12}>
                    <Grid container item>
                        <h3 className='info-panel-header'>{this.context.I18n.getMessage('infoPanel@header')}</h3>
                    </Grid>
                    {this.props.videosTotalCount != null &&
                    <Grid container item className='info-panel-videos-count'>
                        {this.props.videosTotalCount} {this.context.I18n.getMessage('infoPanel@videoCountTitlePart')}
                    </Grid>
                    }
                </Grid>
                <Divider/>
                <Grid container item xs={12} spacing={3}>
                    <Grid item>
                        <a href={this.props.channelUrl}>
                            <Avatar alt={this.props.channelTitle} src={this.props.channelAvatar}></Avatar>
                        </a>
                    </Grid>
                    <Grid item className='channel-inline channel-title-container'>
                        <a href={this.props.channelUrl}>{this.props.channelTitle}</a>
                    </Grid>
                    <Grid item className='channel-inline'>
                        <div className='channel-logout' onClick={this.handleAuthLogoutClick}>
                            <Icon size='100%' icon={exit}></Icon>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
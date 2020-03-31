import React from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import {ChannelPanel} from '../../ChannelPanel/ChannelPanel';

import {IRootContext, createRootContext, RootContextType} from '../../../context/RootContext';

import './DislikedVideosInfoPanel.scss';

interface IDislikedVideosInfoPanelProps {
    channelTitle: string
    channelAvatar: string;
    channelUrl: string;
    videosTotalCount?: number;
}

export class DislikedVideosInfoPanel extends React.Component<IDislikedVideosInfoPanelProps> {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

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
                <ChannelPanel title={this.props.channelTitle} avatar={this.props.channelAvatar} url={this.props.channelUrl}></ChannelPanel>
            </div>
        );
    }
}
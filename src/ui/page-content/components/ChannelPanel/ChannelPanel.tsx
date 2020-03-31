import React from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import {Icon} from 'react-icons-kit';
import {exit} from 'react-icons-kit/icomoon/exit'

import {IRootContext, createRootContext, RootContextType} from '../../context/RootContext';
import {Bind} from '../../decorators/Bind.decorator';

import './ChannelPanel.scss';

interface IChannelPanelProps {
    title: string
    avatar: string;
    url: string;
    onUrlClick?: (string?) => any;
}

export class ChannelPanel extends React.Component<IChannelPanelProps> {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;
    
    @Bind
    handleUrlClick (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        if (this.props.onUrlClick) {
            event.stopPropagation();
            event.preventDefault();
            this.props.onUrlClick(this.props.url);
        }
    }

    @Bind
    async handleAuthLogoutClick () {
        await this.context.YoutubeAuth.removeAuth();
    }

    render () {
        return (
            <Grid className='channel-panel' container item xs={12} spacing={3}>
                <Grid item xs={8} className='channel-info-container'>
                    <a href={this.props.url} onClick={this.handleUrlClick}>
                        <Avatar alt={this.props.title} src={this.props.avatar}></Avatar>
                    </a>
                    <a className='channel-title' href={this.props.url} onClick={this.handleUrlClick}>
                        {this.props.title}
                    </a>
                </Grid>
                <Grid item xs={4} className='channel-inline channel-logout-container'>
                    <div className='channel-logout' onClick={this.handleAuthLogoutClick}>
                        <Icon size='100%' icon={exit}></Icon>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

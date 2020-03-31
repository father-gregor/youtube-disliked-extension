import React from 'react';
import Grid from '@material-ui/core/Grid';

import {ChannelPanel} from '../../../page-content/components/ChannelPanel/ChannelPanel';
import {NoVideosError} from '../../../page-content/components/NoVideosError/NoVideosError';

import {IRootContext, RootContextType, createRootContext} from '../../../page-content/context/RootContext';

import './ToolbarPopupRoot.scss';
import {Bind} from '../../../page-content/decorators/Bind.decorator';

export class ToolbarPopupRoot extends React.Component {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    @Bind
    handleChannelUrlClick (url: string) {
        chrome.tabs.create({active: true, url});
    }

    render() {
        const channel = this.context.YoutubeAuth.getUserChannel();
        return (
            <div className='toolbar-popup-root'>
                {channel
                    ? <Grid container spacing={0} className='toolbar-popup-container'>
                        <ChannelPanel title={channel.title}
                                      url={channel.url}
                                      avatar={channel.thumbnail}
                                      onUrlClick={this.handleChannelUrlClick}>
                        </ChannelPanel>
                    </Grid>
                    : <div className='centered'>
                        <NoVideosError></NoVideosError>
                    </div>
                }
            </div>
        )
    }
}

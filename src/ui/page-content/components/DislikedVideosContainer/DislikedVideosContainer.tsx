import React from 'react';
import Grid from '@material-ui/core/Grid';
import {ic_refresh} from 'react-icons-kit/md/ic_refresh'

import {LoadingSpinner} from '../LoadingSpinner/LoadingSpinner';
import {MessageWithButton} from '../MessageWithButton/MessageWithButton';
import {DislikedVideosInfoPanel} from '../DislikedVideosInfoPanel/DislikedVideosInfoPanel';

import {Bind} from '../../decorators/Bind.decorator';
import {IRootContext, createRootContext, RootContextType} from '../RootContainer/RootContext';

interface IDislikedVideosListState {
    loadedState: 'notReady' | 'ready' | 'failed';
}

export class DislikedVideosContainer extends React.Component<{}, IDislikedVideosListState> {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    constructor (props) {
        super(props);

        this.state = {
            loadedState: 'notReady'
        };
    }

    componentDidMount() {
        this.loadVideos();
    }

    @Bind
    loadVideos () {
        return this.context.DislikedVideosStorage.getVideos().then((videos: any) => {
            console.log(videos);
            this.setState({
                loadedState: 'ready'
            })
        }).catch(() => {
            this.setState({
                loadedState: 'failed'
            });
        });
    }

    render () {
        let content;

        if (this.state.loadedState === 'notReady') {
            content = <LoadingSpinner/>;
        }
        else if (this.state.loadedState === 'ready') {
            content = 
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <DislikedVideosInfoPanel></DislikedVideosInfoPanel>
                </Grid>
                <Grid item xs={12} sm={8}>
                    
                </Grid>
            </Grid>;
        }
        else if (this.state.loadedState === 'failed') {
            content = 
                <MessageWithButton message={this.context.I18n.getMessage('failedToLoadVideosMessage')}
                                buttonTitle={this.context.I18n.getMessage('failedToLoadVideosButton')}
                                buttonIcon={ic_refresh}
                                buttonDisabled={false}
                                onButtonClick={this.loadVideos}>
                </MessageWithButton>;
        }

        return (
            <div className='disliked-videos-container'>
                {content}
            </div>
        );
    }
}
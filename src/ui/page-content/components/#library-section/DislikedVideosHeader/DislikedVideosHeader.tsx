import React from 'react';
import Button from '@material-ui/core/Button';

import {createRootContext, IRootContext, RootContextType} from '../../../context/RootContext';

import './DislikedVideosHeader.scss';
import { Bind } from '../../../decorators/Bind.decorator';

interface IDislikedVideosHeaderProps {
    videosTotalCount: number;
}

export class DislikedVideosHeader extends React.Component<IDislikedVideosHeaderProps> {
    private dislikedIconSvg = 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z';

    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    constructor (props) {
        super(props);
    }

    @Bind
    handleOpenPopup () {
        this.context.RendererPopup.openList();
    }

    render () {
        return (
            <div className='disliked-videos-header'>
                <section className='header-left'>
                    <span className='header-icon-and-text' onClick={this.handleOpenPopup}>
                        <span className='header-icon'>
                            <svg className='style-scope yt-icon'
                                viewBox='0 0 24 24'
                                preserveAspectRatio='xMidYMid meet'
                                focusable='false'>
                                <g><path d={this.dislikedIconSvg}></path></g>
                            </svg>
                        </span>
                        <span className='header-text'>
                            {this.context.I18n.getMessage('infoPanel@header')}
                        </span>
                    </span>
                    {this.props.videosTotalCount != null &&
                    <span className='header-videos-count'>
                        {this.props.videosTotalCount}
                    </span>
                    }
                </section>
                <section className='header-right'>
                    <Button className='header-open-more-videos' onClick={this.handleOpenPopup}>
                        {this.context.I18n.getMessage('openMoreVideosButton').toUpperCase()}
                    </Button>
                </section>
            </div>
        );
    }
}

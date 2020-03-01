import React from 'react';
import {Icon} from 'react-icons-kit';

import {Bind} from '../../decorators/Bind.decorator';
import {IRootContext, createRootContext, RootContextType} from '../RootContainer/RootContext';

export class DislikedVideos extends React.Component {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    constructor (props) {
        super(props);
    }

    componentDidMount() {
        this.context.DislikedVideosStorage.getVideos();
    }

    render () {
        return (
            <div>
                
            </div>
        );
    }
}
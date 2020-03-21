import React from 'react';

import {createRootContext, IRootContext, RootContextType} from '../../context/RootContext';

export class DislikedVideosLibrarySection extends React.Component {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    constructor (props) {
        super(props);
    }

    render () {
        return <div>Library Content</div>;
    }
}

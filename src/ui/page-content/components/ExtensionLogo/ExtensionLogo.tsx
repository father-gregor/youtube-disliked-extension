import React from 'react';

import {createRootContext, IRootContext, RootContextType} from '../../context/RootContext';

import './ExtensionLogo.scss';

export class ExtensionLogo extends React.Component {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    render () {
        return (
            <div className='extension-logo'>
                <p>{this.context.I18n.getMessage('extensionName')}</p>
            </div>
        );
    }
}

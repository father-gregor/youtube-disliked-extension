import React from 'react';
import Button from '@material-ui/core/Button';

import {createRootContext, IRootContext} from "../DislikedListContainer/RootContext";
import {Bind} from '../../decorators/Bind.decorator';

import './PreAuthScreen.scss';

export class PreAuthScreen extends React.Component {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: React.ContextType<React.Context<IRootContext>>;

    constructor (props) {
        super(props);
    }

    @Bind
    async handleAskForAuthorization () {
        const isAuthorized = await this.context.YoutubeAuth.authorizeWithConsentPopup();
        console.log(isAuthorized);
    }

    render () {
        return (
            <div className='pre-auth-screen'>
                <p className='pre-auth-message'>{this.context.I18n.getMessage('askForAuthorizationMessage')}</p>
                <Button variant='contained' className='pre-auth-button' onClick={this.handleAskForAuthorization}>{this.context.I18n.getMessage('askForAuthorizationButton')}</Button>
            </div>
        );
    }
}

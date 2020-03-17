import React from 'react';
import Button from '@material-ui/core/Button';
import {Icon} from 'react-icons-kit';
import {google} from 'react-icons-kit/fa/google'

import {MessageWithButton} from '../MessageWithButton/MessageWithButton';

import {createRootContext, IRootContext, RootContextType} from "../RootContainer/RootContext";
import {Bind} from '../../decorators/Bind.decorator';

import './PreAuthScreen.scss';

export class PreAuthScreen extends React.Component<{onSuccessAuth: () => void}, {authButtonDisabled: boolean}> {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    constructor (props) {
        super(props);

        this.state = {
            authButtonDisabled: false
        };
    }

    @Bind
    async handleAskForAuthorization () {
        this.toggleAuthButton(true);
        const isAuthorized = await this.context.YoutubeAuth.authorizeWithConsentPopup();
        this.toggleAuthButton(false);
        if (isAuthorized) {
            this.props.onSuccessAuth();
        }
    }

    toggleAuthButton (state: boolean) {
        this.setState({authButtonDisabled: state});
    }

    render () {
        return (
            <MessageWithButton message={this.context.I18n.getMessage('askForAuthorizationMessage')}
                            buttonTitle={this.context.I18n.getMessage('askForAuthorizationButton')}
                            buttonIcon={google}
                            buttonDisabled={this.state.authButtonDisabled}
                            onButtonClick={this.handleAskForAuthorization}>
            </MessageWithButton>
        );
    }
}

import React from 'react';
import {google} from 'react-icons-kit/fa/google'

import {MessageWithButton} from '../MessageWithButton/MessageWithButton';
import {ExtensionLogo} from '../ExtensionLogo/ExtensionLogo';

import {createRootContext, IRootContext, RootContextType} from "../../context/RootContext";
import {Bind} from '../../decorators/Bind.decorator';

import './PreAuthScreen.scss';

export class PreAuthScreen extends React.Component<{onSuccessAuth: () => void}, {authButtonDisabled: boolean}> {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;
    private mounted: boolean;

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
        if (this.mounted) {
            this.setState({authButtonDisabled: state});
        }
    }

    componentDidMount () {
        this.mounted = true;
    }

    componentWillUnmount () {
        this.mounted = false;
    }

    render () {
        return (
            <div className='pre-auth-screen'>
                <MessageWithButton message={this.context.I18n.getMessage('askForAuthorizationMessage')}
                                   buttonTitle={this.context.I18n.getMessage('askForAuthorizationButton')}
                                   buttonIcon={google}
                                   buttonDisabled={this.state.authButtonDisabled}
                                   onButtonClick={this.handleAskForAuthorization}>
                                    <ExtensionLogo></ExtensionLogo>
                </MessageWithButton>
            </div>
        );
    }
}

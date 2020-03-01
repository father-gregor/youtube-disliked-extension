import React from 'react';
import Button from '@material-ui/core/Button';
import {Icon} from 'react-icons-kit';
import {google} from 'react-icons-kit/fa/google'

import {createRootContext, IRootContext, RootContextType} from "../RootContainer/RootContext";
import {Bind} from '../../decorators/Bind.decorator';

import './PreAuthScreen.scss';

export class PreAuthScreen extends React.Component<{onSuccessAuth: () => void}, {authButtonDisabled: boolean}> {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    constructor (props) {
        super(props);

        console.log('CONTEXT', this.context);
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
        console.log(isAuthorized);
    }

    toggleAuthButton (state: boolean) {
        this.setState({authButtonDisabled: state});
    }

    render () {
        return (
            <div className='pre-auth-screen'>
                <p className='pre-auth-message'>{this.context.I18n.getMessage('askForAuthorizationMessage')}</p>
                <Button variant='contained' 
                        color='primary'
                        disabled={this.state.authButtonDisabled}
                        className='pre-auth-button'
                        startIcon={<div style={{width: 25}}><Icon size='100%' icon={google}></Icon></div>}
                        onClick={this.handleAskForAuthorization}>
                    {this.context.I18n.getMessage('askForAuthorizationButton')}
                </Button>
            </div>
        );
    }
}

import React from 'react';
import {ic_autorenew} from 'react-icons-kit/md/ic_autorenew'

import {MessageWithButton} from '../MessageWithButton/MessageWithButton';
import {ExtensionLogo} from '../ExtensionLogo/ExtensionLogo';

import {createRootContext, IRootContext, RootContextType} from '../../context/RootContext';
import {Bind} from '../../decorators/Bind.decorator';

export class NoVideosError extends React.Component {
    static contextType: React.Context<IRootContext> = createRootContext();
    context!: RootContextType;

    @Bind
    async handleAuthRefreshClick () {
        await this.context.YoutubeAuth.refreshAuthorization();
        this.context.refreshAuth();
    }

    render () {
        return (
            <div className='no-videos-error'>
                <MessageWithButton message={this.context.I18n.getMessage('noVideosErrorMessage')}
                                   buttonTitle={this.context.I18n.getMessage('noVideosErrorButton')}
                                   buttonIcon={ic_autorenew}
                                   onButtonClick={this.handleAuthRefreshClick}>
                                    <ExtensionLogo></ExtensionLogo>
                </MessageWithButton>
            </div>
        );
    }
}

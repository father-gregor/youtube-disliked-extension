import React from 'react';
import Button from '@material-ui/core/Button';
import {Icon} from 'react-icons-kit';

import {Bind} from '../../decorators/Bind.decorator';

import './MessageWithButton.scss';

interface IMessageWithButtonProps {
    message?: string;
    buttonTitle?: string;
    buttonIcon?: any;
    buttonDisabled?: boolean;
    onButtonClick?: () => void;
}

export class MessageWithButton extends React.Component<IMessageWithButtonProps> {
    constructor (props) {
        super(props);
    }

    @Bind
    handleButtonClick () {
        this.props.onButtonClick();
    }

    render () {
        let messageContent = null;
        let iconContent = null;

        if (this.props.message) {
            messageContent = <p className='message-with-button-msg'>{this.props.message}</p>;
        }
        if (this.props.buttonIcon) {
            iconContent = 
                <div className='message-with-button-icon'>
                    <Icon size='100%' icon={this.props.buttonIcon}></Icon>
                </div>;
        }

        return (
            <div className='message-with-button'>
                {this.props.children}
                {messageContent}
                {this.props.buttonTitle && <Button variant='contained' 
                        color='primary'
                        disabled={this.props.buttonDisabled != null && this.props.buttonDisabled}
                        className='message-with-button-btn'
                        startIcon={iconContent}
                        onClick={this.handleButtonClick}>
                    {this.props.buttonTitle}
                </Button>}
            </div>
        );
    }
}

import React from 'react';
import Button from '@material-ui/core/Button';
import {Icon} from 'react-icons-kit';

import {Bind} from '../../decorators/Bind.decorator';

import './MessageWithButton.scss';

interface IMessageWithButtonProps {
    message: string;
    buttonTitle: string;
    buttonIcon?: any;
    buttonDisabled?: boolean;
    onButtonClick: () => void;
}

export class MessageWithButton extends React.Component<IMessageWithButtonProps> {
    constructor (props) {
        super(props);
    }

    @Bind
    async handleButtonClick () {
        this.props.onButtonClick();
    }

    render () {
        let iconContent = null;

        if (this.props.buttonIcon) {
            iconContent = 
                <div style={{width: 25}}>
                    <Icon size='100%' icon={this.props.buttonIcon}></Icon>
                </div>;
        }

        return (
            <div className='message-with-button'>
                <p className='message-with-button_msg'>{this.props.message}</p>
                <Button variant='contained' 
                        color='primary'
                        disabled={this.props.buttonDisabled != null && this.props.buttonDisabled}
                        className='message-with-button_btn'
                        startIcon={iconContent}
                        onClick={this.handleButtonClick}>
                    {this.props.buttonTitle}
                </Button>
            </div>
        );
    }
}

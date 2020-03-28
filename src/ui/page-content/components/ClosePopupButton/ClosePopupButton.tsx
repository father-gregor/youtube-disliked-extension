import React from 'react';
import {Icon} from 'react-icons-kit';
import {ic_clear} from 'react-icons-kit/md/ic_clear';

import {Bind} from '../../decorators/Bind.decorator';

import './ClosePopupButton.scss';
import { Button } from '@material-ui/core';

export class ClosePopupButton extends React.Component<{onClose: () => void}> {
    @Bind
    handleCloseList () {
        this.props.onClose();
    }

    render () {
        return (
            <div className='close-list-button'>
                <Button size='small' onClick={this.handleCloseList}>
                    <Icon size='100%' icon={ic_clear}/>
                </Button>
            </div>
        );
    }
}
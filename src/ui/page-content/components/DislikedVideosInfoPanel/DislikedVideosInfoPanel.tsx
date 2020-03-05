import React from 'react';
import {Icon} from 'react-icons-kit';
import {ic_clear} from 'react-icons-kit/md/ic_clear';

import {Bind} from "../../decorators/Bind.decorator";

import './CloseListButton.scss';

export class DislikedVideosInfoPanel extends React.Component {
    @Bind
    handleCloseList () {
        this.props.onClose();
    }

    render () {
        return (
            <div className='close-list-button'>
                <Icon size='100%' icon={ic_clear} onClick={this.handleCloseList}/>
            </div>
        );
    }
}
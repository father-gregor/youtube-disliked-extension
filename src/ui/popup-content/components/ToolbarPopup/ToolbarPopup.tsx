import React from 'react';

import './ToolbarPopup.scss';

export class ToolbarPopup extends React.Component {
    render() {
        return (
            <div className='toolbar-popup'>
                <h1>{chrome.i18n.getMessage("dislikedButtonText")}</h1>
            </div>
        )
    }
}

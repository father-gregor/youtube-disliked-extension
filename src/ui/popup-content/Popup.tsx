import React from "react"
import ReactDOM from "react-dom"

import "../../styles/Popup.scss"

class Popup extends React.Component {
    render() {
        return (
            <div className="popup-padded">
                <h1>{chrome.i18n.getMessage("dislikedButtonText")}</h1>
            </div>
        )
    }
}

ReactDOM.render(
    <Popup />,
    document.getElementById('root')
)
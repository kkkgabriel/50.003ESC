import React from 'react'
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

const DialogHome = (props) => {
    return (
        <Dialog title={"Please confirm"} onClose={props.toggleDialog}>
            <p style={{ margin: "25px", textAlign: "center" }}>{props.name} is trying to connect to you. Do you want to accept?</p>
            <DialogActionsBar>
                <button className="k-button" onClick={props.toggleDialog}>Decline</button>
                <button className="k-button" onClick={props.toggleisAvailable}>Accept</button>
            </DialogActionsBar>
        </Dialog>
    )
}

export default DialogHome


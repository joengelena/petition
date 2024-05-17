import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";


interface LogInDialogProps {
    open: boolean;
    onClose: () => void;
}

const LogInDialog: React.FC<LogInDialogProps> = (props) => {
    const navigate = useNavigate();

    const handleLogInDialogClose = () => {
        props.onClose();
    };


    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="login-modal-title"
            aria-describedby="login-modal-description"
        >
            <DialogTitle id="login-dialog-title">Login Required</DialogTitle>
            <DialogContent>
                <DialogContentText id="logout-dialog-description">
                    You need to be logged in to proceed.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button style={{color: '#FF3333'}} onClick={handleLogInDialogClose}>Cancel</Button>
                <Button onClick={()=>(navigate('/login'))} autoFocus>
                    Log In
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default LogInDialog;
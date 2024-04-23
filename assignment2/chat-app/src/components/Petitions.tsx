import axios from 'axios';
import React from "react";
import {Link, useNavigate} from 'react-router-dom';
import CSS from 'csstype';
import {
    Alert, AlertTitle,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Paper, Snackbar, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}

interface HeadCell {
    id: string;
    label: string;
    numeric: boolean;
}
const headCells: readonly HeadCell[] = [
    { id: 'ID', label: 'id', numeric: true },
    { id: 'username', label: 'Username', numeric: false },
    { id: 'link', label: 'Link', numeric: false },
    { id: 'actions', label: 'Actions', numeric: false }
];

const Petitions = ()=> {
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    if (errorFlag) {
        return (
            <div>
                <h1>Users</h1>
                {errorFlag &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}
            </div>
        )
    } else {
        return (
            <h2>Petitions</h2>
        )
    }

}


export default Petitions;
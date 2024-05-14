import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Grid,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import React from "react";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

const CreatePetition = () => {
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    if (errorFlag) {
        return (
            <div>
                <h1>Petitions</h1>
                {errorFlag &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}
            </div>
        )
    } else {
        return (
            <div style={{padding: 50}}>
                <Paper elevation={3} style={{padding: 20, margin: 'auto', maxWidth: 1200}}>

                </Paper>
            </div>

        )
    }
}

export default CreatePetition;

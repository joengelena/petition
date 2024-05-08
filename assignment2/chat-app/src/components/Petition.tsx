import React from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import {Alert, AlertTitle, Paper, TableCell, TableRow} from "@mui/material";
import CSS from "csstype";
const baseUrl = "http://localhost:4941/api/v1";
const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}
const Petition = ()=> {
    const {petitionId} = useParams();
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [petition, setPetition] = React.useState<Petition>();


    React.useEffect(() => {
        getPetition()
    },[petitionId])

    const getPetition = () => {
        axios.get(baseUrl + `/petitions/${petitionId}`)
            .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setPetition(response.data)
                },
                (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString());
                })
    }

    const petition_detail = () => {
        return (
            <div>
                <h1>Petition Title</h1>

            </div>

        )
    }

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
            <div style={{padding: 15}}>
                <Paper elevation={3} style={{padding: 20, margin: 'auto', maxWidth: 1200}}>
                    <React.Fragment>
                        <h1>Petition {petitionId}</h1>
                        <p>{petition?.title}</p>
                        <img src={`${baseUrl}/petitions/${petitionId}/image`} width="700" height="700"/>
                        <hr/>
                    </React.Fragment>

                </Paper>

            </div>

        )
    }

}

export default Petition;
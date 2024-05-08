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
        console.log({petitionId})
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
            <div>
                <Paper elevation={3} style={card}>
                    <React.Fragment>
                        <h1>Petition {petitionId}</h1>
                        <p>{petition?.title}</p>
                    </React.Fragment>

                </Paper>

            </div>

        )
    }

}

export default Petition;
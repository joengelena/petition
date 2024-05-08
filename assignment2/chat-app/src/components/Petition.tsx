import React from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import {Alert, AlertTitle, Avatar, Box, Grid, Paper, TableCell, TableRow, Typography} from "@mui/material";
import CSS from "csstype";
const baseUrl = "http://localhost:4941/api/v1";

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
                    <React.Fragment>
                        <Typography variant="h3" style={{fontWeight: 'bold', padding: 10}}>
                            {petition?.title}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <img src={`${baseUrl}/petitions/${petitionId}/image`} width="550" height="550"/>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h4" style={{padding: 10}}>
                                    Description
                                </Typography>
                                <Typography variant="body1">{petition?.description}</Typography>

                                <Typography variant="h4" style={{padding: 10}}>
                                    Total Money Raised
                                </Typography>
                                <Typography variant="body1">${petition?.moneyRaised}</Typography>
                            </Grid>
                        </Grid>
                        <hr/>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={3}>
                                <Avatar
                                    src={`${baseUrl}/users/${petition?.ownerId}/image`}
                                    alt={`${petition?.ownerLastName}`}
                                    style={{width: 200, height: 200}} // Smaller Avatar for a cleaner look
                                />
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1" style={{padding: 10}}
                                            align='left'>{petition?.creationDate}</Typography>
                                <Typography variant="h3" style={{padding: 10, fontWeight: 'bold'}} align='left'>
                                    {petition?.ownerFirstName + " " + petition?.ownerLastName}
                                </Typography>
                            </Grid>
                        </Grid>
                        <hr/>
                        <Typography variant="h5" style={{padding: 10}}>Total {petition?.numberOfSupporters} existing supporters</Typography>
                        <Box display="flex"
                             alignItems="center"
                             gap={4}
                             p={2}
                             sx={{ border: '2px solid #0068cf'}}
                        >
                            {petition?.numberOfSupporters}
                        </Box>
                    </React.Fragment>
                </Paper>
            </div>

        )
    }

}

export default Petition;
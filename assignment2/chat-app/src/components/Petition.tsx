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
    const [supporters, setSupporters] = React.useState<Supporter[]>();

    React.useEffect(() => {
        getPetition()
    },[petitionId])

    React.useEffect(() => {
        axios.get(baseUrl + `/petitions/${petitionId}/supporters`)
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setSupporters(response.data);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }, [petitionId]);


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


    const getSupportTiers = () => {
        return petition?.supportTiers.map((tier, index) => (
                <Box
                    key={index}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    p={3}
                    sx={{
                        border: '4px solid #0067cd',
                        borderRadius: 2,
                        backgroundColor: '#f5f5f5',
                        maxWidth: '300px',
                        width: '100%',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <h3 style={{marginBottom: '8px', color: '#000000'}}>{tier.title}</h3>
                    <p style={{marginBottom: '16px', color: '#414141'}}>{tier.description}</p>
                    <p style={{color: '#0067cd', fontWeight: 'bold'}}>Cost: {tier.cost}</p>
                </Box>
            )
        )
    }
    const getSupporters = () => {
        if (!supporters) return null; // or display a loading indicator
        return supporters
            .filter(supporter => supporter.supportTierId && petition?.supportTiers.some(tier => tier.supportTierId === supporter.supportTierId))
            .map((supporter, index) => (
                <Box
                    key={index}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    p={3}
                    sx={{
                        border: '4px solid #0067cd',
                        borderRadius: 2,
                        backgroundColor: '#f5f5f5',
                        maxWidth: '300px',
                        width: '100%',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <h3 style={{marginBottom: '8px', color: '#000000'}}>{supportTierTitle(supporter.supportTierId)}</h3>
                    <Box key={index} display="flex" alignItems="center" justifyContent='center' gap={2}>
                        <Avatar
                            src={`${baseUrl}/users/${supporter?.supporterId}/image`}
                            alt={`${supporter?.supporterLastName}`}
                            style={{width: 50, height: 50}}
                        />
                        <div>
                            <p style={{marginBottom: '8px', fontWeight: 'bold'}}>{supporter.supporterFirstName} {supporter.supporterLastName}</p>
                        </div>
                    </Box>
                    {supporter.message && (
                        <p style={{marginBottom: '8px', color: '#414141'}}>"{supporter.message}"</p>
                    )}
                    <p style={{marginBottom: '8px', color: '#545454'}}>{supporter.timestamp}</p>
                </Box>
            ));
    }


    const supportTierTitle = (supportTierId: number) => {
        const supportTier = petition?.supportTiers.find(tier => tier.supportTierId === supportTierId);
        return supportTier?.title;
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
                        <Typography variant="h3" style={{fontWeight: 'bold', padding: 10, marginBottom: "10px"}}>
                            {petition?.title}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <img src={`${baseUrl}/petitions/${petitionId}/image`} width="550" height="550"/>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                                    <div style={{flex: 1}}>
                                        <Typography variant="h4" style={{padding: 10}}>
                                            Description
                                        </Typography>
                                        <Typography variant="body1">{petition?.description}</Typography>

                                        <Typography variant="h4" style={{padding: 10}}>
                                            Total Money Raised
                                        </Typography>
                                        <Typography variant="body1">${petition?.moneyRaised}</Typography>
                                    </div>
                                    <Grid container spacing={2} justifyContent='center' alignItems="center">
                                        <Avatar
                                            src={`${baseUrl}/users/${petition?.ownerId}/image`}
                                            alt={`${petition?.ownerLastName}`}
                                            style={{width: 60, height: 60}}
                                        />
                                        <Typography variant="h5" style={{padding: 10, fontWeight: 'bold'}}>
                                            {petition?.ownerFirstName + " " + petition?.ownerLastName}
                                        </Typography>
                                        <Typography variant="body1" style={{padding: 10}}>
                                            {petition?.creationDate}
                                        </Typography>
                                    </Grid>
                                </div>
                            </Grid>
                        </Grid>
                        <hr/>
                        <h2 style={{padding: '10px', marginBottom: "10px"}}>Available Support Tiers</h2>
                        <Box
                            display="flex"
                            justifyContent="center"
                            gap={3}
                        >
                            {getSupportTiers()}
                        </Box>
                        <hr/>
                        <h2 style={{padding: '10px', marginBottom: "10px"}}>Supporters</h2>
                        <Box
                            display="flex"
                            justifyContent="center"
                            gap={3}
                        >
                            {getSupporters()}
                        </Box>

                        <Typography variant="body1" style={{padding: 10, textAlign: 'right'}}>Total {petition?.numberOfSupporters} existing supporters</Typography>
                    </React.Fragment>
                </Paper>
            </div>

        )
    }

}

export default Petition;
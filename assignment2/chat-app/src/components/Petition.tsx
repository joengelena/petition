import React from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Grid,
    Paper,
    Table, TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import CSS from "csstype";
const baseUrl = "http://localhost:4941/api/v1";

const Petition = ()=> {
    const {petitionId} = useParams();
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [petition, setPetition] = React.useState<Petition>();
    const [supporters, setSupporters] = React.useState<Supporter[]>();
    const [similarPetitions, setSimilarPetitions] = React.useState<Array<Petition>>([]);
    const [similarOwnerId, setSimilarOwnerId] = React.useState<Array<Petition>>([]);
    const [similarCategory, setSimilarCategory] = React.useState<Array<Petition>>([]);
    const [concatReady, setConcatReady] = React.useState(false)

    const [maxPage, setMaxPage] = React.useState(1)
    const [categories, setCategories] = React.useState<Array<Category>>([]);


    React.useEffect(() => {
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
        const getCategories = () => {
            axios.get(baseUrl + `/petitions/categories`)
                .then((response) => {
                        setErrorFlag(false);
                        setErrorMessage("");
                        setCategories(response.data)
                    },
                    (error) => {
                        setErrorFlag(true);
                        setErrorMessage(error.toString());
                    }
                );
        }
        getPetition()
        getCategories()
    }, [petitionId]);



    React.useEffect(() => {
        const getSupporters = () => {
            axios.get(baseUrl + `/petitions/${petition?.petitionId}/supporters`)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setSupporters(response.data)
                })
                .catch((error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }

        const getPetitionsCategoryId = () => {
            const query = `categoryIds=${petition?.categoryId}`
            axios.get(`${baseUrl}/petitions?count=10&${query}`)
                .then((response) => {
                    setErrorMessage('')
                    setErrorFlag(false)
                    setConcatReady(true)
                    setSimilarCategory(response.data.petitions)
                })
                .catch((error) => {
                    setErrorFlag(true)
                    setErrorMessage('Error fetching petitions: ' + error)
                });
        }

        const getPetitionsOwnerId = () => {
            const query = `ownerId=${petition?.ownerId}`
            axios.get(`${baseUrl}/petitions?count=10&${query}`)
                .then((response) => {
                    setErrorMessage('')
                    setErrorFlag(false)
                    setConcatReady(true)
                    setSimilarOwnerId(response.data.petitions)
                })
                .catch((error) => {
                    setErrorFlag(true)
                    setErrorMessage('Error fetching petitions: ' + error)
                })
        }

        const getSimilarPetitions = () => {
            getPetitionsCategoryId()
            getPetitionsOwnerId()
        };

        if (petition !== null && petition?.categoryId !== 0 && petition?.ownerId !== 0) {
            getSupporters()
            getSimilarPetitions()
        };
    }, [petition]);

    React.useEffect(() => {
        const concatenateSimilarPetitions = () => {
            const array = require("lodash/array")
            if (similarCategory.length > 0 && similarOwnerId.length > 0) {
                const similarPetitions = array.uniqBy([...similarCategory, ...similarOwnerId], "petitionId")
                const similarPetitionsCurrent = similarPetitions.filter((p: Petition) => p.petitionId !== petition?.petitionId)
                setSimilarPetitions(similarPetitionsCurrent)
            } else {
                setConcatReady(false)
            }
        }

        if (concatReady) {
            concatenateSimilarPetitions()
        }
    }, [similarCategory, similarOwnerId, concatReady, petition]);


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
                        justifyContent: 'space-between'
                    }}
                >
                    <div>
                        <h3 style={{marginBottom: '8px', color: '#000000'}}>{tier.title}</h3>
                        <p style={{marginBottom: '16px', color: '#414141'}}>{tier.description}</p>
                    </div>
                    <p style={{color: '#0067cd', fontWeight: 'bold'}}>Cost: {tier.cost}</p>
                </Box>
            )
        )
    }
    const getSupporters = () => {
        if (!supporters || supporters.length === 0) {
            return (
                <Typography variant="h6">No supporters yet</Typography>
            );
        }
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
                        justifyContent: 'space-between'
                    }}
                >
                    <div>
                        <h3 style={{marginBottom: '15px', color: '#000000'}}>{supportTierTitle(supporter.supportTierId)}</h3>
                        <Box key={index} display="flex" alignItems="center" gap={2}>
                            <Avatar
                                src={`${baseUrl}/users/${supporter?.supporterId}/image`}
                                alt={`${supporter?.supporterLastName}`}
                                style={{width: 50, height: 50}}
                            />
                            <div>
                                <p style={{fontWeight: 'bold'}}>{supporter.supporterFirstName} {supporter.supporterLastName}</p>
                            </div>
                        </Box>
                        {supporter.message && (
                            <p style={{marginBottom: '8px', color: '#414141'}}>"{supporter.message}"</p>
                        )}
                    </div>
                    <p style={{marginBottom: '8px', color: '#545454'}}>{supporter.timestamp}</p>
                </Box>
            ));
    }

    const supportTierTitle = (supportTierId: number) => {
        const supportTier = petition?.supportTiers.find(tier => tier.supportTierId === supportTierId);
        return supportTier?.title;
    }

    const similarPetition_rows = () => {
        if (similarPetitions.length === 1) {
            return (
                <TableRow>
                    <TableCell colSpan={7} align="center">
                        <Typography variant="body1">No similar petitions found at the moment.</Typography>
                    </TableCell>
                </TableRow>
            );
        }

        return similarPetitions
            .filter(similarPetition => petitionId && similarPetition.petitionId.toString() !== petitionId)
            .map((similarPetition: Petition) =>
                <TableRow
                    hover
                    tabIndex={-1}
                    key={similarPetition.petitionId}
                    component={Link}
                    to={`/petitions/${similarPetition.petitionId}`}
                    sx={{
                        '&:hover': {textDecoration: 'none'}
                    }}
                >
                    <TableCell>
                        <img src={`${baseUrl}/petitions/${similarPetition.petitionId}/image`} width="100" height="100"/>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body1">
                            {similarPetition.title}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body1">
                            {similarPetition.creationDate}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body1">
                            {categories.find(category => category.categoryId === similarPetition.categoryId)?.name || "Unknown"}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body1">
                            {similarPetition.ownerFirstName + " " + similarPetition.ownerLastName}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Avatar
                            src={`${baseUrl}/users/${similarPetition.ownerId}/image`}
                            alt={`${similarPetition.ownerLastName}`}
                            style={{ width: 80, height: 80 }}
                        />
                    </TableCell>
                    <TableCell>
                        {similarPetition.supportingCost}
                    </TableCell>
                </TableRow>
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
            <div style={{padding: 50}}>
                <Paper elevation={3} style={{padding: 20, margin: 'auto', maxWidth: 1200}}>
                    <React.Fragment>
                        <Typography variant="h3" style={{fontWeight: 'bold', padding: 10, marginBottom: "10px"}}>
                            {petition?.title}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <img
                                    src={`${baseUrl}/petitions/${petitionId}/image`}
                                    alt="Petition Image"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="h4" style={{padding: 10}}>
                                            Description
                                        </Typography>
                                        <Typography variant="body1">{petition?.description}</Typography>

                                        <Typography variant="h4" style={{padding: 10}}>
                                            Total Money Raised
                                        </Typography>
                                        <Typography variant="body1">
                                            {petition?.moneyRaised !== null
                                                ? `$${petition?.moneyRaised}`
                                                : 'No money raised yet'}
                                        </Typography>
                                    </div>
                                    <Grid
                                        container
                                        spacing={2}
                                        justifyContent="center"
                                        alignItems="center"
                                        style={{ padding: '10px 0' }}
                                    >
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
                        <Typography variant="body1" style={{
                            padding: 10,
                            textAlign: 'right'
                        }}>Total {petition?.numberOfSupporters} existing supporters</Typography>
                        <hr/>
                        <h2 style={{padding: '10px', marginBottom: "10px"}}>Similar Petitions</h2>
                        <TableContainer component={Paper} style={{marginTop: 20}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Creation Date</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Owner Name</TableCell>
                                        <TableCell>Owner Image</TableCell>
                                        <TableCell>Supporting Cost</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {similarPetition_rows()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </React.Fragment>
                </Paper>
            </div>

        )
    }

}

export default Petition;
import React, {ChangeEvent} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Avatar,
    Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, List, ListItem, ListItemAvatar, ListItemText,
    Paper, Table, TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import LogInDialog from "./LogInDialog";
import {useUserInfoStorage} from "../store";
const baseUrl = "http://localhost:4941/api/v1";

const Petition = ()=> {
    const {petitionId} = useParams();
    const navigate = useNavigate();
    const userLocal = useUserInfoStorage(state => state.user);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [petition, setPetition] = React.useState<Petition>({
        petitionId: -1,
        title: "",
        description: "",
        creationDate: "",
        imageFileName: "",
        ownerId: -1,
        ownerFirstName: "",
        ownerLastName: "",
        supportingCost: 0,
        categoryId: 0,
        ownerImage: "",
        numberOfSupporters: 0,
        moneyRaised: 0,
        supportTiers: []
    });

    const [supporters, setSupporters] = React.useState<Supporter[]>();
    const [similarPetitions, setSimilarPetitions] = React.useState<Array<Petition>>([]);
    const [similarOwnerId, setSimilarOwnerId] = React.useState<Array<Petition>>([]);
    const [similarCategory, setSimilarCategory] = React.useState<Array<Petition>>([]);

    const [concatReady, setConcatReady] = React.useState(false)
    const [categories, setCategories] = React.useState<Array<Category>>([]);

    const [logInDialogOpen, setLogInDialogOpen] = React.useState(false);
    const [supportDialogOpen, setSupportDialogOpen] = React.useState(false);

    const [supportTierId, setSupportTierId] = React.useState(-1);
    const [message, setMessage] = React.useState<String | null>(null);

    React.useEffect(() => {
        const getPetition = () => {
            axios.get(baseUrl + `/petitions/${petitionId}`)
                .then((response) => {
                        setErrorFlag(false)
                        setErrorMessage("")
                        setPetition(response.data)
                        getSimilarPetitions(response.data)
                    },
                    (error) => {
                        setErrorFlag(true)
                        setErrorMessage(error.response.statusText);
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
                        setErrorMessage(error.response.statusText);
                    }
                );
        }
        getPetition()
        getCategories()
    }, [petitionId]);

    const getSupporters = (petition: Petition) => {
        axios.get(baseUrl + `/petitions/${petition.petitionId}/supporters`)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setSupporters(response.data)
            })
            .catch((error) => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText);
            })
    }

    const getSimilarPetitions = (petition: Petition) => {
        const getPetitionsCategoryId = () => {
            const query = `categoryIds=${petition.categoryId}`
            axios.get(`${baseUrl}/petitions?${query}`)
                .then((response) => {
                    setErrorMessage('')
                    setErrorFlag(false)
                    setConcatReady(true)
                    setSimilarCategory(response.data.petitions)
                })
                .catch((error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText);
                });
        }

        const getPetitionsOwnerId = () => {
            const query = `ownerId=${petition.ownerId}`
            axios.get(`${baseUrl}/petitions?count=10&${query}`)
                .then((response) => {
                    setErrorMessage('')
                    setErrorFlag(false)
                    setConcatReady(true)
                    setSimilarOwnerId(response.data.petitions)
                })
                .catch((error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText);
                })
        }

        if (petition !== null && petition.categoryId !== 0 && petition.ownerId !== 0) {
            getSupporters(petition)
            getPetitionsCategoryId()
            getPetitionsOwnerId()
        }
    }

    React.useEffect(() => {
        const concatenateSimilarPetitions = () => {
            const array = require("lodash/array")
            if (similarCategory.length > 0 && similarOwnerId.length > 0) {
                const similarPetitions = array.uniqBy([...similarCategory, ...similarOwnerId], "petitionId")
                const similarPetitionsCurrent = similarPetitions.filter((p: Petition) => p.petitionId !== petition.petitionId)
                setSimilarPetitions(similarPetitionsCurrent)
            } else {
                setConcatReady(false)
            }
        }

        if (concatReady) {
            concatenateSimilarPetitions()
        }
    }, [similarCategory, similarOwnerId, concatReady, petition]);

    const changeTimeStamp = (timeStamp: string) =>  {
        const date = new Date(timeStamp).toLocaleDateString();
        const time = new Date(timeStamp).toLocaleTimeString();
        return date + '\n' + time;
    }

    const supportATier = () => {
        const data = message !== null
            ? { supportTierId, message }
            : { supportTierId };

        axios.post(`${baseUrl}/petitions/${petitionId}/supporters`, data, {
            headers: {
                "X-Authorization": userLocal.token
            }
        })
            .then((response) => {
                window.location.reload()
                setMessage(null)
                setErrorMessage('');
                setErrorFlag(false);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.response.statusText);
            });
    }


    const handleSupportTierClick = (tierId: number) => {
        if (userLocal.token !== "" && String(userLocal.userId) !== "") {
            setSupportTierId(tierId);
            setSupportDialogOpen(true);
        } else {
            setLogInDialogOpen(true);
        }
    }
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event && event.target) {
            setMessage(event.target.value);
        }
    }

    const handleSupportNow = () => {
        supportATier();
        setSupportDialogOpen(false);
    };

    const handleLogInDialogClose = () => {
        setLogInDialogOpen(false);
    };

    const handleSupportTierDialogClose = () => {
        setSupportDialogOpen(false);
        setMessage(null)
    }
    const supportATierDialog = () => {
        return (
            <Dialog
                open={supportDialogOpen}
                onClose={() => (setSupportDialogOpen(false))}
                aria-labelledby="support-modal-title"
                aria-describedby="support-modal-description"
            >
                <DialogTitle id="support-dialog-title">Leave a message!</DialogTitle>
                <DialogContent>
                    <DialogContentText id="support-dialog-description">
                        <TextField
                            label="Message"
                            multiline
                            variant="outlined"
                            value={message}
                            onChange={handleInputChange}
                            InputProps={{
                                style: {
                                    width: 350,
                                    height:200,
                                    resize: 'vertical',
                                    overflow: 'auto',
                                },
                            }}
                            style={{ marginTop: 8, marginBottom: 8 }}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{color: '#C70000'}} onClick={handleSupportTierDialogClose}>Cancel</Button>
                    <Button onClick={handleSupportNow}>
                        Support Now
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const disableSupport = (tier: SupportTier) => {
        return supporters?.some(supporter => supporter.supportTierId === tier.supportTierId && supporter.supporterId === userLocal.userId)
    }

    const getSupportTiers = () => {
        return petition.supportTiers.map((tier, index) => (
            <Grid
                item
                key={index}
                p={3}
                xs={10}
                md={4}
            >
                <div
                    style={{
                        border: '4px solid #0f574a',
                        borderRadius: 9,
                        backgroundColor: '#f5f5f5',
                        height: 300,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        alignContent: "center",
                        justifyContent: 'space-between',
                        padding: "10px",
                        overflow: 'auto'
                    }}
                    >
                <div>
                    <Typography
                        variant="h4"
                        style={{
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: '#000000',
                        wordWrap: 'break-word'
                    }}>
                        {tier.title}
                    </Typography>
                    <Typography
                        variant="body1"
                        style={{
                        marginBottom: '16px',
                        color: '#414141',
                        wordWrap: 'break-word'
                    }}>
                        {tier.description}
                    </Typography>
                </div>
                <div>
                    <p style={{color: '#0f574a', fontWeight: 'bold'}}>
                        {tier.cost === 0 ? "FREE" : `$${tier.cost}`}
                    </p>
                    {petition.ownerId !== userLocal.userId &&
                        <Button
                            variant="contained"
                            style={{ backgroundColor: disableSupport(tier) ? '#bbbbbb' : '#0f574a' }}
                            onClick={()=>(handleSupportTierClick(tier.supportTierId))}
                            disabled={disableSupport(tier)}
                    >
                        {disableSupport(tier) ? "Supported" : "Support"}
                    </Button>}
                    {supportATierDialog()}
                    <LogInDialog open={logInDialogOpen} onClose={handleLogInDialogClose}/>
                </div>
                </div>
            </Grid>
            )
        )
    }
    const displaySupporters = () => {
        if (!supporters || supporters.length === 0) {
            return (
                <Typography variant="h6">No supporters yet</Typography>
            );
        }
        return supporters
            .map((supporter, index) => (
                <ListItem
                    key={index}
                    sx={{
                        backgroundColor: '#f5f5f5',
                        width: '100%',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid black'
                    }}
                    alignItems="flex-start"
                >
                    <ListItemAvatar style={{ marginRight: 16, justifyContent: 'center'}}>
                        <Avatar
                            src={`${baseUrl}/users/${supporter.supporterId}/image`}
                            alt={`${supporter.supporterLastName}`}
                            style={{width: 70, height: 70}} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography
                                variant="h4"
                                style={{wordWrap: 'break-word'}}
                            >
                                {supportTierTitle(supporter.supportTierId)}
                            </Typography>
                        }
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{display: 'inline'}}
                                    component="span"
                                    variant="h6"
                                    color="text.primary"
                                >
                                    {supporter.supporterFirstName} {supporter.supporterLastName}
                                </Typography>
                                <br/>
                                {supporter.message && (
                                    <Typography
                                        component="span"
                                        style={{
                                            color: '#414141',
                                            wordWrap: 'break-word'
                                        }}>
                                        "{supporter.message}"
                                    </Typography>
                                )}
                            </React.Fragment>
                        }
                    />
                    <Typography
                        variant="body1"
                        component="div"
                        style={{
                            marginBottom: '16px',
                            color: '#414141',
                            wordWrap: 'break-word'
                        }}>
                        {changeTimeStamp(supporter.timestamp)}
                    </Typography>
                </ListItem>
            ));
    }

    const supportTierTitle = (supportTierId: number) => {
        const supportTier = petition.supportTiers.find(tier => tier.supportTierId === supportTierId);
        return supportTier?.title;
    }

    const similarPetition_rows = () => {
        if (similarPetitions.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={7} align="center">
                        <Typography variant="body1">No similar petitions found.</Typography>
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
                    onClick={() => navigate(`/petitions/${similarPetition.petitionId}`)}
                    sx={{
                        '&:hover': {textDecoration: 'none'}
                    }}
                >
                    <TableCell>
                        <Avatar
                            src={`${baseUrl}/petitions/${similarPetition.petitionId}/image`}
                            style={{ width: 160, height: 100, borderRadius: 3 }}
                        >
                            <ImageNotSupportedIcon/>
                        </Avatar>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body1">
                            {similarPetition.title}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body1">
                            {changeTimeStamp(similarPetition.creationDate)}
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
                            style={{ width: 100, height: 100 }}
                        />
                    </TableCell>
                    <TableCell>
                        $ {similarPetition.supportingCost}
                    </TableCell>
                </TableRow>
            )
    }

    if (errorFlag) {
        return (
            <div style={{padding: 50}}>
                <Paper elevation={3} style={{padding: 20, margin: 'auto', maxWidth: 1200}}>
                    <Typography variant="h3" style={{ color: 'error', fontWeight: 'bold'}} >
                        {errorMessage}
                    </Typography>
                </Paper>
            </div>
        )
    } else {
        return (
            <div style={{padding: 50}}>
                <Paper elevation={3} style={{padding: 20, margin: 'auto', maxWidth: 1200}}>
                    <React.Fragment>
                        <Typography variant="h3" style={{
                            fontWeight: 'bold',
                            padding: 10,
                            marginBottom: "10px",
                            wordWrap: 'break-word'
                        }}>
                            {petition.title}
                        </Typography>
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            {errorFlag &&
                                <Alert severity="error" sx={{width: 400}}>
                                    <AlertTitle>Error</AlertTitle>
                                    {errorMessage}
                                </Alert>}
                        </Box>
                        <hr/>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={9}>
                                <Avatar
                                    src={`${baseUrl}/petitions/${petition.petitionId}/image`}
                                    style={{width: "100%", height: 450, borderRadius: 7}}
                                >
                                    <ImageNotSupportedIcon/>
                                </Avatar>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    minHeight: '400px',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{flex: 1}}>
                                        <Typography variant="h6">
                                            Creation Date
                                        </Typography>
                                        <Typography variant="body1">
                                            {changeTimeStamp(petition.creationDate)}
                                        </Typography>
                                        <Typography variant="h6" style={{padding: 2}}>
                                            Total Money Raised
                                        </Typography>
                                        <Typography variant="h2" style={{fontWeight: "bold", color: "#0f574a"}}>
                                            {petition.moneyRaised !== null
                                                ? `$${petition.moneyRaised}`
                                                : '$0'}
                                        </Typography>
                                        <Avatar
                                            src={`${baseUrl}/users/${petition.ownerId}/image`}
                                            alt={`${petition.ownerLastName}`}
                                            style={{width: 250, height: 250}}
                                        />
                                        <Typography variant="h5" style={{padding: 10, fontWeight: 'bold'}}>
                                            {petition.ownerFirstName + " " + petition.ownerLastName}
                                        </Typography>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        <div style={{textAlign: 'left'}}>
                            <Typography variant="h3" style={{padding: 10}}>
                                Description
                            </Typography>
                            <Typography variant="body1"
                                        style={{padding: 10, wordWrap: 'break-word', fontSize: '1.2rem'}}>
                                {petition.description}
                            </Typography>
                        </div>

                        <hr/>
                        <h2 style={{padding: '10px', marginBottom: "10px"}}>Available Support Tiers</h2>
                        <Grid
                            container
                            spacing={2}
                            justifyContent="center"
                        >
                            {getSupportTiers()}
                        </Grid>
                        <hr/>
                        <h2 style={{padding: '10px', marginBottom: "10px"}}>Supporters</h2>
                        <div style={{maxHeight: '500px', overflow: 'auto'}}>
                            <List sx={{width: '100%'}}>
                                {displaySupporters()}
                            </List>
                        </div>
                        <Typography variant="body1" style={{
                            padding: 10,
                            textAlign: 'right'
                        }}>Total {supporters?.length} existing supporters</Typography>
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
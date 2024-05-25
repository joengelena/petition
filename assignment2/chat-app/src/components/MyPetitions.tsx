import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useUserInfoStorage} from "../store";
import React from "react";
import {
    Alert, AlertTitle,
    Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Paper, Snackbar, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
const baseUrl = "http://localhost:4941/api/v1";

const MyPetitions = () => {
    const navigate = useNavigate();
    const userLocal = useUserInfoStorage(state => state.user)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [myPetitions, setMyPetitions] = React.useState<Array<Petition>>([]);
    const [categories, setCategories] = React.useState<Array<Category>>([]);

    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [selectedPetition, setSelectedPetition] = React.useState<Petition>();

    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackOpen, setSnackOpen] = React.useState(false)

    React.useEffect(() => {
        axios.get(`${baseUrl}/users/${userLocal.userId}`, {
            headers: {
                "X-Authorization": userLocal.token }
        })
            .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                },
                (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString());
                    navigate('/')
                })
    }, [userLocal])

    React.useEffect(() => {
        getMyPetitions();
    }, []);

    React.useEffect(() => {
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
        };
        getCategories()
    }, [])

    const deletePetition = () => {
        handleDeleteModalClose()
        const config = {
            method: "delete",
            url: `${baseUrl}/petitions/${selectedPetition?.petitionId}`,
            headers: {
                "X-Authorization": userLocal.token,
            },
        }
        axios(config)
            .then((response) => {
                navigate(`/myPetitions`)
                setSnackMessage("Petition is deleted successfully")
                getMyPetitions()
                setSnackOpen(true)
                setErrorFlag(false)
                setErrorMessage("")
                setSelectedPetition(undefined)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const getMyPetitions = async () => {
        try {
            const [ownerResponse, supporterResponse] = await Promise.all([
                axios.get(`${baseUrl}/petitions?count=10&ownerId=${userLocal.userId}`),
                axios.get(`${baseUrl}/petitions?count=10&supporterId=${userLocal.userId}`)
            ]);

            const combinedPetitions = [...ownerResponse.data.petitions, ...supporterResponse.data.petitions];

            const uniquePetitions = Array.from(new Set(combinedPetitions.map(petition => petition.petitionId)))
                .map(id => combinedPetitions.find(petition => petition.petitionId === id));

            setMyPetitions(uniquePetitions);
            setErrorFlag(false)
        } catch (error) {
            setErrorFlag(true);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unknown error occurred');
            }
        }
    };

    const handleDeleteModalOpen = (petition: Petition) => {
        setSelectedPetition(petition);
        setDeleteModalOpen(true);
    };
    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setSelectedPetition(undefined);
    };
    const deletePetitionConfirmationModal = () => {
        return (
            <Dialog
                open={deleteModalOpen}
                onClose={handleDeleteModalClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete the petition "{selectedPetition?.title}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteModalClose}>Cancel</Button>
                    <Button style={{color: '#C70000'}} onClick={deletePetition} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    const changeTimeStamp = (timeStamp: string) =>  {
        const date = new Date(timeStamp).toLocaleDateString();
        const time = new Date(timeStamp).toLocaleTimeString();
        return date + '\n' + time;
    }

    const myPetition_rows = () => {
        if (myPetitions.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={8} align="center">
                        <Typography variant="body1">No petitions found.</Typography>
                    </TableCell>
                </TableRow>
            );
        }

        return myPetitions.map((petition: Petition) =>
            <TableRow
                hover
                tabIndex={-1}
                key={petition.petitionId}
                onClick={() => navigate(`/petitions/${petition.petitionId}`)}
                sx={{
                    '&:hover': {textDecoration: 'none'}
                }}
            >
                <TableCell>
                    <Avatar
                        src={`${baseUrl}/petitions/${petition.petitionId}/image`}
                        style={{ width: 160, height: 100, borderRadius: 3 }}
                    >
                        <ImageNotSupportedIcon/>
                    </Avatar>
                </TableCell>
                <TableCell>
                    <Typography variant="body1">
                        {petition.title}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body1">
                        {changeTimeStamp(petition.creationDate)}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body1">
                        {categories.find(category => category.categoryId === petition.categoryId)?.name || "Unknown"}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body1">
                        {petition.ownerFirstName + " " + petition.ownerLastName}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Avatar
                        src={`${baseUrl}/users/${petition.ownerId}/image`}
                        alt={`${petition.ownerLastName}`}
                        style={{ width: 80, height: 80 }}
                    />
                </TableCell>
                <TableCell>
                    {petition.supportingCost}
                </TableCell>
                <TableCell>
                    <Stack direction="column" spacing={1}>
                        <Button
                            variant="contained"
                            sx={{
                                background:
                                    petition.ownerId !== userLocal.userId ? "#bbbbbb": "#1c7c31",
                                "&:hover": {
                                    background: "#196728"
                                }}}
                            onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/petitions/${petition.petitionId}/editPetition`);
                            }}
                            disabled={petition.ownerId !== userLocal.userId}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                background: petition.ownerId !== userLocal.userId || petition.numberOfSupporters >= 1 ? '#bbbbbb' : '#C70000',
                                "&:hover": {
                                    background: "#ab0f0f",
                                }}}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteModalOpen(petition);
                            }}
                            disabled={petition.ownerId !== userLocal.userId || petition.numberOfSupporters >= 1}
                        >
                            Delete
                        </Button>
                    </Stack>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <div style={{padding: 50}}>
            <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 1500}}>
                <Typography variant="h3" style={{ fontWeight: 'bold', padding: 10 }}>
                    My Petitions
                </Typography>
                <Button
                    variant="contained"
                    sx={{background: "#1c7c31", marginBottom: 6, width: 200,
                        "&:hover": {
                            background: "#196728",
                        }}}
                    onClick={() => (navigate('/createPetition'))}
                >
                    + Create Petition
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {errorFlag &&
                        <Alert severity="error" sx={{width: 400}}>
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>}
                </Box>
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
                                <TableCell>Manage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {myPetition_rows()}
                            {deleteModalOpen && deletePetitionConfirmationModal()}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Snackbar
                    autoHideDuration={6000}
                    open={snackOpen}
                    onClose={handleSnackClose}
                    key={snackMessage}
                >
                    <Alert onClose={handleSnackClose} severity="success" sx={{
                        width: '100%'
                    }}>
                        {snackMessage}
                    </Alert>
                </Snackbar>
            </Paper>
        </div>
    )
}
export default MyPetitions;
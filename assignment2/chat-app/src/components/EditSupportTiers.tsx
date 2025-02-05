import React, {useState} from "react";
import axios from "axios";
import {useUserInfoStorage} from "../store";
import {useNavigate} from "react-router-dom";
import {
    Alert, AlertTitle,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Grid, InputAdornment, Stack,
    TextField, Typography
} from "@mui/material";
const baseUrl = "http://localhost:4941/api/v1";

interface EditPetitionChildComponent {
    petitionId: string | undefined;
}

const EditSupportTiers: React.FC<EditPetitionChildComponent> = ({petitionId}) => {
    const navigate = useNavigate();
    const userLocal = useUserInfoStorage(state => state.user);

    const [editTierErrorFlag, setEditTierErrorFlag] = useState(false)
    const [editTierErrorMessage, setEditTierErrorMessage] = useState("")
    const [addTierErrorFlag, setAddTierErrorFlag] = useState(false)
    const [addTierErrorMessage, setAddTierErrorMessage] = useState("")
    const [errorFlag, setErrorFlag] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [petition, setPetition] = React.useState<Petition>()

    const [createSupportTier, setCreateSupportTier] = React.useState<CreateSupportTier>();

    const [randomIndex, setRandomIndex] = React.useState(0);
    const [selectedSupportTier, setSelectedSupportTier] = React.useState<SupportTier | null>();

    const [supporters, setSupporters] = React.useState<Supporter[]>();

    const [editSupportTierModalOpen, setEditSupportTierModalOpen] = React.useState(false);
    const [deleteSupportTierModalOpen, setDeleteSupportTierModalOpen] = React.useState(false);
    const [originalSupportTier, setOriginalSupportTier] = React.useState<SupportTier | null>();

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
        axios.get(`${baseUrl}/petitions/${petitionId}`, {
            headers: {
                "X-Authorization": userLocal.token
            }
        })
            .then((response) => {
                    const petitionData = response.data
                    setPetition(petitionData)

                    setErrorFlag(false)
                    setErrorMessage("")
                    console.log(petitionData)
                },
                (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.status);
                })

        axios.get(`${baseUrl}/petitions/${petitionId}/supporters`)
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

    const handleAddNewSupportTier = () => {
        if (petition && petition.supportTiers && petition.supportTiers.length < 3) {
            setCreateSupportTier({tempId: randomIndex, title: '', description: '', cost: ""})
            setRandomIndex(randomIndex + 1)
        }
    }

    const editNewSupportTier = (key: string, newValue: string | number) => {
        setCreateSupportTier(prevTier => {
            if (prevTier) {
                return {
                    ...prevTier,
                    [key] : newValue
                }
            }
        });
    }

    const createNewSupportTier = () => {
        const data = {
            title: createSupportTier?.title,
            description: createSupportTier?.description,
            cost: createSupportTier?.cost
        }
        if (isNaN(Number(data.cost))) {
            setAddTierErrorFlag(true);
            setAddTierErrorMessage("Cost must be a number");
            return;
        } else {
            data.cost = Number(data.cost)
        }
        axios.put(`${baseUrl}/petitions/${petitionId}/supportTiers`, data, {
            headers: {
                "X-Authorization": userLocal.token
            }
        })
            .then((response) => {
                console.log(response)
                window.location.reload()
                setAddTierErrorFlag(false)
                setAddTierErrorMessage("")
            })
            .catch((error) => {
                setAddTierErrorFlag(true)
                setAddTierErrorMessage(error.response.statusText)
                console.log(error.response)
            })
    }

    const hasSupporters = (tierId: number) => {
        return supporters?.some(supporter => supporter.supportTierId === tierId);
    };

    const updateEditSupportTier = (key: string, newValue: string | number) => {
        setSelectedSupportTier(prevTier => {
            if (prevTier) {
                return {
                    ...prevTier,
                    [key] : newValue
                }
            }
        })
    }
    const editSupportTier = () => {
        const data: EditSupportTier = {};
        if (isNaN(Number(selectedSupportTier?.cost))) {
            setEditTierErrorFlag(true);
            setEditTierErrorMessage("Cost must be a number");
            return;
        }
        if (selectedSupportTier?.title !== '') {
            data.title = selectedSupportTier?.title
        }
        if (selectedSupportTier?.description !== '') {
            data.description = selectedSupportTier?.description
        }
        if (selectedSupportTier?.cost !== '') {
            data.cost = Number(selectedSupportTier?.cost)
        }

        axios.patch(`${baseUrl}/petitions/${petitionId}/supportTiers/${selectedSupportTier?.supportTierId}`, data, {
            headers: {
                "X-Authorization": userLocal.token
            }
        })
            .then((response) => {
                handleEditModalClose()
                console.log(response)
                setEditTierErrorFlag(false)
                setEditTierErrorMessage("")
                handleEditModalClose()
                window.location.reload()
            })
            .catch((error) => {
                setEditTierErrorFlag(true)
                setEditTierErrorMessage(error.response.statusText)
                console.log(error.response)
            })

    }

    const handleEditModalOpen = (editTier: SupportTier) => {
        setSelectedSupportTier(editTier);
        setOriginalSupportTier(editTier);
        setEditSupportTierModalOpen(true);
    };
    const handleEditModalClose = () => {
        setEditTierErrorMessage("")
        setEditTierErrorFlag(false)
        setEditSupportTierModalOpen(false);
        setSelectedSupportTier(null);
    };

    const handleDeleteSupportTierModalOpen = (deleteTier: SupportTier) => {
        setSelectedSupportTier(deleteTier);
        setDeleteSupportTierModalOpen(true)
    }
    const handleDeleteSupportTierModalClose = () => {
        setDeleteSupportTierModalOpen(false)
        setSelectedSupportTier(null);
    }
    const handleDeleteAddNewSupportTier = () => {
        setAddTierErrorMessage("")
        setAddTierErrorFlag(false)
        setCreateSupportTier(undefined)
    }

    const deleteSupportTierConfirmationModal = () => {
        return (
            <Dialog
                open={deleteSupportTierModalOpen}
                onClose={handleDeleteSupportTierModalClose}
            >
                <DialogTitle>Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the tier "{selectedSupportTier?.title}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteSupportTierModalClose}>Cancel</Button>
                    <Button
                        style={{color: '#FF3333'}}
                        onClick={() => (deleteSupportTier())}
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const deleteSupportTier = () => {
        handleDeleteSupportTierModalClose()
        const config = {
            method: "delete",
            url: `${baseUrl}/petitions/${petitionId}/supportTiers/${selectedSupportTier?.supportTierId}`,
            headers: {
                "X-Authorization": userLocal.token,
            },
        }
        axios(config)
            .then((response) => {
                window.location.reload()
                setErrorFlag(false)
                setErrorMessage("")
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
            })
    }

    const addSupportTier = () => {
        return (
            <Box
                style={{
                    width: 350,
                    padding: 15,
                    minHeight: 320,
                    border: "3px solid #0067cd",
                    borderRadius: "3%"
                }}>
                <h4 style={{marginTop: 10}}>Support Tier</h4>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {addTierErrorFlag &&
                        <Alert severity="error" style={{width: 300}}>
                            <AlertTitle>Error</AlertTitle>
                            {addTierErrorMessage}
                        </Alert>}
                </Box>
                <TextField
                    required
                    label="Title"
                    multiline
                    variant="outlined"
                    value={createSupportTier?.title}
                    onChange={(event) => (editNewSupportTier("title", event.target.value))}
                    InputProps={{
                        style: {
                            minWidth: 300,
                            resize: 'vertical',
                            overflow: 'auto',
                        },
                    }}
                    style={{ marginBottom: 8, marginTop: 8 }}
                />
                <TextField
                    required
                    label="Description"
                    multiline
                    variant="outlined"
                    value={createSupportTier?.description}
                    onChange={(event) => (editNewSupportTier("description", event.target.value))}
                    InputProps={{
                        style: {
                            minWidth: 300,
                            resize: 'vertical',
                            overflow: 'auto',
                        },
                    }}
                    style={{ marginBottom: 8 }}
                />
                <TextField
                    required
                    label="Cost"
                    variant="outlined"
                    value={createSupportTier?.cost}
                    onChange={(event) => (editNewSupportTier("cost", event.target.value))}
                    InputProps={{
                        style: {
                            minWidth: 300
                        },
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    style={{ marginBottom: 8 }}
                />
                <Button
                    variant="contained"
                    sx={{
                        background: "#C70000",
                        marginRight: 1,
                        marginBottom: "8px",
                        "&:hover": {
                            background: "#ab0f0f",
                        }}}
                    onClick={handleDeleteAddNewSupportTier}
                >
                    Delete
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        background: "#1c7c31",
                        marginBottom: "8px",
                        "&:hover": {
                            background: "#196728", // Change hover color to red
                        }}}
                    onClick={createNewSupportTier}
                >
                    Save
                </Button>
            </Box>

        )
    }

    const editSupportTierModal = () => {
        const isNotChanged = () => {
            return (originalSupportTier?.title == selectedSupportTier?.title &&
                originalSupportTier?.description == selectedSupportTier?.description &&
                originalSupportTier?.cost == selectedSupportTier?.cost);
        }
        return (
            <Dialog
                open={editSupportTierModalOpen}
                onClose={handleEditModalClose}
            >
                <DialogTitle>Edit Support Tier</DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {editTierErrorFlag &&
                        <Alert severity="error" style={{width: 350}}>
                            <AlertTitle>Error</AlertTitle>
                            {editTierErrorMessage}
                        </Alert>}
                </Box>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TextField
                        label="Title"
                        multiline
                        variant="outlined"
                        value={selectedSupportTier?.title}
                        onChange={(event) => (updateEditSupportTier("title", event.target.value))}
                        InputProps={{
                            style: {
                                width: 350,
                                resize: 'vertical',
                                overflow: 'auto',
                            },
                        }}
                        style={{ marginBottom: 8 }}
                    />
                    <TextField
                        label="Description"
                        multiline
                        variant="outlined"
                        value={selectedSupportTier?.description}
                        onChange={(event) => (updateEditSupportTier("description", event.target.value))}
                        InputProps={{
                            style: {
                                width: 350,
                                resize: 'vertical',
                                overflow: 'auto',
                            },
                        }}
                        style={{width: 350, marginBottom: 8 }}
                    />
                    <TextField
                        label="Cost"
                        variant="outlined"
                        value={selectedSupportTier?.cost}
                        onChange={(event) => (updateEditSupportTier("cost", event.target.value))}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        style={{ width: 350, marginBottom: 8 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleEditModalClose}
                        style={{color: "#FF3333"}}
                    >
                        Cancel
                    </Button>
                    <Button
                    sx={{ color: isNotChanged() ? "#bbbbbb" : '#1c7c31' }}
                        onClick={(editSupportTier)}
                        disabled={isNotChanged()}
                        autoFocus
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        )
    }

    const getSupportTiers = () => {
        return petition?.supportTiers.map((tier, index) => (
            <Grid
                item
                key={index}
                p={3}
                xs={10}
                md={4}
            >
                <div
                    style={{
                        border: '4px solid #0067cd',
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
                        <p style={{color: '#0067cd', fontWeight: 'bold'}}>
                            {tier.cost === 0 ? "FREE" : `$${tier.cost}`}
                        </p>
                        <Stack direction="row" spacing={1} style={{justifyContent: "center"}}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor:
                                        hasSupporters(tier.supportTierId) ||  petition?.supportTiers.length === 1
                                            ? "#bbbbbb" : "#C70000",
                                    "&:hover": {
                                        background: "#ab0f0f",
                                    }}}
                                onClick={() => (handleDeleteSupportTierModalOpen(tier))}
                                disabled={hasSupporters(tier.supportTierId) || petition?.supportTiers.length === 1}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: hasSupporters(tier.supportTierId) ? "#bbbbbb" : "#1c7c31",
                                    "&:hover": {
                                        background: "#196728", // Change hover color to red
                                    }}}
                                onClick={() => (handleEditModalOpen(tier))}
                                disabled={hasSupporters(tier.supportTierId)}
                            >
                                Edit
                            </Button>
                        </Stack>
                    </div>
                </div>
            </Grid>
            )
        )
    }
    return (
        <>
            <h2 style={{marginBottom: "10px"}}>Support Tiers</h2>
            {errorFlag &&
                <Alert severity="error" style={{width: '400px'}}>
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>}
            <Grid
                container
                spacing={2}
                justifyContent="center"
            >
                {getSupportTiers()}
            </Grid>
            {createSupportTier ? addSupportTier() :
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{width: "400px", marginTop: 3}}
                    onClick={handleAddNewSupportTier}
                    disabled={petition?.supportTiers.length === 3}
                >
                    Add Support Tier
                </Button>
            }
            {deleteSupportTierModalOpen && deleteSupportTierConfirmationModal()}
            {editSupportTierModalOpen && editSupportTierModal()}
        </>
    )


}

export default EditSupportTiers;
import {
    Alert, AlertTitle, Avatar,
    Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent, Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import axios from "axios";
import {useUserInfoStorage} from "../store";
import {Link, useNavigate, useParams} from "react-router-dom";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import {CloudUpload} from "@mui/icons-material";
import LogInDialog from "./LogInDialog";
import EditSupportTiers from "./EditSupportTiers";
const baseUrl = "http://localhost:4941/api/v1";

const EditPetition = () => {
    const navigate = useNavigate();
    const {petitionId} = useParams();
    const userLocal = useUserInfoStorage(state => state.user);
    const [errorFlag, setErrorFlag] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [petition, setPetition] = React.useState<EditPetition>();

    const [categories, setCategories] = React.useState<Array<Category>>([]);

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

    const [supportTiers, setSupportTiers] = React.useState<Array<CreateSupportTier>>([]);
    const [supporters, setSupporters] = React.useState<Supporter[]>();

    const [disableSave, setDisableSave] = React.useState(true)

    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackOpen, setSnackOpen] = React.useState(false)

    React.useEffect(() => {
        getPetition()
    }, [])

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
        setDisableSave(title === petition?.title && description === petition?.description && categoryId === petition?.categoryId);
    }, [title, description, categoryId, petition]);

    const unDisableSave = () => {
        if (title !== petition?.title || description !== petition?.description || categoryId !== petition?.categoryId) {
            setDisableSave(false)
        } else {
            setDisableSave(true)
        }
    }

    React.useEffect(() => {
        axios.get(baseUrl + `/petitions/categories`)
            .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setCategories(response.data)
                    console.log(response.data)
                },
                (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                }
                );
    }, [])

    React.useEffect(() => {
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
    }, [baseUrl, petitionId]);
    // const hasSupporters = (tierId: number) => {
    //     return supporters?.some(supporter => supporter.supportTierId === tierId);
    // };


    const handleCategoryClick = (event: SelectChangeEvent<number>) => {
        setCategoryId(event.target.value as number);
    };

    const getPetition = () => {
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
                setTitle(petitionData.title)
                setDescription(petitionData.description)
                setCategoryId(petitionData.categoryId)
                setSupportTiers(petitionData.supportTiers)
            },
            (error) => {
                setErrorFlag(true)
                setErrorMessage(error.status);
            })
    }

    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    // const handleDeleteSupportTier = (id: number) => {
    //     const newSupportTiers = supportTiers.filter(tier => tier.tempId !== id)
    //     setOldSupportTiers(newSupportTiers)
    // }
    //
    // const handleAddNewSupportTier = () => {
    //     if (supportTiers.length < 3) {
    //         setOldSupportTiers([...supportTiers, {tempId: randomIndex, title: '', description: '', cost: ""}])
    //         setRandomIndex(randomIndex + 1)
    //     }
    // }

    // const addNewSupportTier = (tempId: number, key: string, newValue: string | number) => {
    //     const newSupportTiers = oldSupportTiers.map(tier =>
    //         tier.tempId === tempId ? {...tier, [key] : newValue} : tier)
    //     setOldSupportTiers(newSupportTiers)
    // }
    //
    // const updateEditSupportTier = (key: string, newValue: string | number) => {
    //     console.log("im editing: " + key)
    //     console.log(newValue)
    //
    //     setEditedValues((prevValues) => ({
    //         ...prevValues,
    //         [key]: newValue,
    //     }));
    // };
    // const editSupportTier = () => {
    //     handleEditModalClose()
    //     console.log("database editing tier")
    //     const data: EditSupportTier = {};
    //     console.log(editedValues)
    //     console.log("selected")
    //     console.log(selectedSupportTier)
    //
    //
    //     if (editedValues.title !== '') {
    //         data.title = editedValues.title
    //     }
    //     if (editedValues.description !== '') {
    //         data.description = editedValues.description
    //     }
    //     if (editedValues.cost !== '') {
    //         if (isNaN(Number(editedValues.cost))) {
    //             setErrorFlag(true);
    //             setErrorMessage("Cost must be a number");
    //             return;
    //         } else {
    //             editedValues.cost = Number(editedValues.cost)
    //         }
    //         data.cost = editedValues.cost
    //
    //     }
    //     axios.patch(`${baseUrl}/petitions/${petitionId}/supportTiers/${selectedSupportTier?.supportTierId}`, data, {
    //         headers: {
    //             "X-Authorization": userLocal.token
    //         }
    //     })
    //         .then((response) => {
    //             handleEditModalClose()
    //             console.log(response)
    //             setErrorFlag(false)
    //             setErrorMessage("")
    //         })
    //         .catch((error) => {
    //             setErrorFlag(true)
    //             setErrorMessage(error.response.statusText)
    //             console.log(error.response)
    //         })
    //
    // };

    // const handleEditModalOpen = (editTier: SupportTier) => {
    //     setSelectedSupportTier(editTier);
    //     setEditSupportTierModalOpen(true);
    // };
    // const handleEditModalClose = () => {
    //     setEditSupportTierModalOpen(false);
    //     setSelectedSupportTier(null);
    // };
    //
    // const handleDeleteSupportTierModalOpen = (tier: SupportTier) => {
    //     setDeleteSupportTierModalOpen(true)
    // }
    // const handleDeleteSupportTierModalClose = () => {
    //     setDeleteSupportTierModalOpen(false)
    // }
    //
    // const deleteSupportTierConfirmationModal = (tier: SupportTier) => {
    //     return (
    //         <Dialog
    //             open={deleteSupportTierModalOpen}
    //             onClose={handleDeleteSupportTierModalClose}
    //         >
    //             <DialogTitle>Delete</DialogTitle>
    //             <DialogContent>
    //                 <DialogContentText>
    //                     Are you sure you want to delete the tier "{tier?.title}"?
    //                 </DialogContentText>
    //             </DialogContent>
    //             <DialogActions>
    //                 <Button onClick={handleDeleteSupportTierModalClose}>Cancel</Button>
    //                 <Button
    //                     // variant="contained"
    //                     style={{color: '#FF3333'}}
    //                     onClick={() => (deleteSupportTier(tier))}
    //                     autoFocus
    //                 >
    //                     Delete
    //                 </Button>
    //             </DialogActions>
    //         </Dialog>
    //     );
    // };
    //
    // const deleteSupportTier = (tier: SupportTier) => {
    //     handleDeleteSupportTierModalClose()
    //     const config = {
    //         method: "delete",
    //         url: `${baseUrl}/petitions/${petitionId}/supportTiers/${tier.supportTierId}`, //TODO WRONG !!! Tier id shoulnt be the temp id
    //         headers: {
    //             "X-Authorization": userLocal.token,
    //         },
    //     }
    //     axios(config)
    //         .then((response) => {
    //             setSnackMessage("Support Tier is deleted successfully")
    //             setSnackOpen(true)
    //             setErrorFlag(false)
    //             setErrorMessage("")
    //         }, (error) => {
    //             setErrorFlag(true)
    //             setErrorMessage(error.response.statusText)
    //         })
    // }
    //
    // const addSupportTier = (newTier: CreateSupportTier) => {
    //     return (
    //         <Box
    //             style={{
    //                 width: 400,
    //                 marginBottom: 2,
    //                 border: "3px solid #0067cd",
    //                 borderRadius: "3%"
    //         }}>
    //             <h4 style={{marginTop: 10}}>Support Tier</h4>
    //             <TextField
    //                 required
    //                 label="Title"
    //                 multiline
    //                 variant="outlined"
    //                 value={newTier.title}
    //                 onChange={(event) => (addNewSupportTier(newTier.tempId, "title", event.target.value))}
    //                 InputProps={{
    //                     style: {
    //                         minWidth: 350,
    //                         resize: 'vertical',
    //                         overflow: 'auto',
    //                     },
    //                 }}
    //                 style={{ marginBottom: 8 }}
    //             />
    //             <TextField
    //                 required
    //                 label="Description"
    //                 multiline
    //                 variant="outlined"
    //                 value={newTier.description}
    //                 onChange={(event) => (addNewSupportTier(newTier.tempId, "description", event.target.value))}
    //                 InputProps={{
    //                     style: {
    //                         width: 350,
    //                         resize: 'vertical',
    //                         overflow: 'auto',
    //                     },
    //                 }}
    //                 style={{width: 350, marginBottom: 8 }}
    //             />
    //             <TextField
    //                 required
    //                 label="Cost"
    //                 variant="outlined"
    //                 value={newTier.cost}
    //                 onChange={(event) => (addNewSupportTier(newTier.tempId, "cost", event.target.value))}
    //                 InputProps={{
    //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
    //                 }}
    //                 style={{ width: 350, marginBottom: 8 }}
    //             />
    //             <Button
    //                 variant="contained"
    //                 sx={{
    //                     background: "#C70000",
    //                     marginBottom: "8px",
    //                     "&:hover": {
    //                         background: "#ab0f0f", // Change hover color to red
    //                     }}}
    //                 onClick={() => (handleDeleteSupportTier(newTier.tempId))}
    //             >Delete</Button>
    //         </Box>
    //
    //     )
    // }


    // const editSupportTierModal = (editTier: SupportTier) => {
    //     return (
    //         <Dialog
    //             open={editSupportTierModalOpen}
    //             onClose={handleEditModalClose}
    //         >
    //             <DialogTitle>Edit Support Tier</DialogTitle>
    //             <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    //             <TextField
    //                 label="Title"
    //                 multiline
    //                 variant="outlined"
    //                 sx={{marginTop: 2}}
    //                 value={editedValues.title === "" ? editTier.title : editedValues.title}
    //                 onChange={(event) => (updateEditSupportTier("title", event.target.value))}
    //                 InputProps={{
    //                     style: {
    //                         width: 350,
    //                         resize: 'vertical',
    //                         overflow: 'auto',
    //                     },
    //                 }}
    //                 style={{ marginBottom: 8 }}
    //             />
    //             <TextField
    //                 label="Description"
    //                 multiline
    //                 variant="outlined"
    //                 value={editedValues.description === "" ? editTier.description : editedValues.description}
    //                 onChange={(event) => (updateEditSupportTier("description", event.target.value))}
    //                 InputProps={{
    //                     style: {
    //                         width: 350,
    //                         resize: 'vertical',
    //                         overflow: 'auto',
    //                     },
    //                 }}
    //                 style={{width: 350, marginBottom: 8 }}
    //             />
    //             <TextField
    //                 label="Cost"
    //                 variant="outlined"
    //                 value={editedValues.cost === "" ? editTier.cost : editedValues.cost}
    //                 onChange={(event) => (updateEditSupportTier("cost", event.target.value))}
    //                 InputProps={{
    //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
    //                 }}
    //                 style={{ width: 350, marginBottom: 8 }}
    //             />
    //             </DialogContent>
    //             <DialogActions>
    //                 <Button onClick={handleEditModalClose}>Cancel</Button>
    //                 <Button style={{color: '#1c7c31'}} onClick={(editSupportTier)} autoFocus>
    //                     Edit
    //                 </Button>
    //             </DialogActions>
    //         </Dialog>
    //
    //     )
    // }
    //
    // const getSupportTiers = () => {
    //     return petition?.supportTiers.map((tier, index) => (
    //         <Box
    //             key={index}
    //             display="flex"
    //             flexDirection="column"
    //             gap={2}
    //             p={3}
    //             sx={{
    //                 border: '4px solid #0067cd',
    //                 borderRadius: 2,
    //                 backgroundColor: '#f5f5f5',
    //                 maxWidth: '300px',
    //                 minWidth:'250px',
    //                 width: '100%',
    //                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    //                 justifyContent: 'space-between'
    //             }}
    //         >
    //             <div>
    //                 <Typography
    //                     variant="h4"
    //                     style={{
    //                         fontWeight: 'bold',
    //                         marginBottom: '8px',
    //                         color: '#000000',
    //                         wordWrap: 'break-word'
    //                     }}>
    //                     {tier.title}
    //                 </Typography>
    //                 <Typography
    //                     variant="body1"
    //                     style={{
    //                         marginBottom: '16px',
    //                         color: '#414141',
    //                         wordWrap: 'break-word'
    //                     }}>
    //                     {tier.description}
    //                 </Typography>
    //             </div>
    //             <div>
    //                 <p style={{color: '#0067cd', fontWeight: 'bold'}}>
    //                     {tier.cost === 0 ? "FREE" : `$${tier.cost}`}
    //                 </p>
    //                 <Stack direction="row" spacing={1} style={{justifyContent: "center"}}>
    //                     <Button
    //                         variant="contained"
    //                         style={{backgroundColor: hasSupporters(tier.supportTierId) ? "#bbbbbb" : "#0F5132FF"}}
    //                         onClick={() => (handleEditModalOpen(tier))}
    //                         disabled={hasSupporters(tier.supportTierId)}
    //                     >
    //                         Edit
    //                     </Button>
    //                     <Button
    //                         variant="contained"
    //                         style={{backgroundColor: hasSupporters(tier.supportTierId) ? "#bbbbbb" : "#b00e0e"}}
    //                         onClick={() => (handleDeleteSupportTierModalOpen(tier))}
    //                         disabled={hasSupporters(tier.supportTierId)}
    //                     >
    //                         Delete
    //                     </Button>
    //                 </Stack>
    //                 {deleteSupportTierConfirmationModal(tier)}
    //                 {editSupportTierModal(tier)}
    //             </div>
    //         </Box>
    //         )
    //     )
    // }

    const updatePetition = () => {
        for (let tier of supportTiers) {
            if (isNaN(Number(tier.cost))) {
                setErrorFlag(true);
                setErrorMessage("Cost must be a number");
                return;
            } else {
                tier.cost = Number(tier.cost)
            }
        }
        // const data: EditPetition = {};
        //
        // if (title !== '') {
        //     data.title = title
        // }
        // if (description !== '') {
        //     data.description = description
        // }
        // if (categoryId !== -1) {
        //     data.categoryId = categoryId
        // }
        // if (supportTiers.length !== 0) {
        //     data.supportTiers === supporters
        // }
        // axios.patch(`${baseUrl}/petitions/${petitionId}`, data, {
        //     headers: {
        //         "X-Authorization": userLocal.token
        //     }
        // })
        //     .then((response) => {
        //         navigate(`/petitions/${petitionId}`);
        //         console.log(response)
        //         setErrorFlag(false)
        //         setErrorMessage("")
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //         setErrorFlag(true)
        //         if (error.response.statusText === "Bad Request: data/supportTiers must NOT have fewer than 1 items") {
        //             setErrorMessage("Please add at least one support tier")
        //         } else if (error.response.statusText.includes("fewer than 1")) {
        //             setErrorMessage("Please fill out the required fields")
        //         } else if (error.response.statusText === "Bad Request: data/supportTiers/0/cost must be integer") {
        //             setErrorMessage("Cost must be a number")
        //         } else if (error.response.statusText.includes("title must NOT have more than 128 characters")) {
        //             setErrorMessage("Title too long! Keep it under 128 characters.")
        //         } else if (error.response.statusText.includes("data/description must NOT have more than 1024 characters")) {
        //             setErrorMessage("Description too long! Keep it under 1024 characters.")
        //         } else {
        //             setErrorMessage(error.response.statusText)
        //         }
        //     })

    }

    return (
        <div style={{padding: 50}}>
            <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 900}}>
                <Typography variant="h3" style={{fontWeight: 'bold'}}>
                    Edit Petition
                </Typography>

                <Stack direction="column" spacing={2} marginTop={2} marginBottom={2} justifyContent="center"
                       alignItems="center">
                    {errorFlag &&
                        <Alert severity="error" style={{width: '400px'}}>
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>}
                    <Avatar
                        src={`${baseUrl}/petitions/${petitionId}/image`}
                        style={{width: 400, height: 250, borderRadius: 3}}
                    >
                        <ImageNotSupportedIcon/>
                    </Avatar>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={()=> {navigate(`/petitions/${petitionId}/uploadImage`)}}
                        startIcon={<CloudUpload />}
                    >
                        Update Photo
                    </Button>
                    <TextField
                        label="Title"
                        multiline
                        variant="outlined"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        InputProps={{
                            style: {
                                width: 400,
                                resize: 'vertical',
                                overflow: 'auto',
                            },
                        }}
                        style={{marginBottom: 2}}
                    />
                    <TextField
                        label="Description"
                        multiline
                        variant="outlined"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        InputProps={{
                            style: {
                                width: 400,
                                resize: 'vertical',
                                overflow: 'auto',
                            },
                        }}
                        style={{marginBottom: 2}}
                    />
                    <Box style={{width: 400, marginBottom: 2}}>
                        <FormControl fullWidth>
                            <InputLabel required id="category-single-label">Category</InputLabel>
                            <Select
                                labelId="category-single-label"
                                id="category-single-name"
                                value={categoryId || ""}
                                label="Category"
                                onChange={handleCategoryClick}
                                style={{marginBottom: 2}}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <hr style={{width: '100%'}}/>
                    <h2 style={{marginBottom: "10px"}}>Support Tiers</h2>
                    {petition && <EditSupportTiers petition={petition} petitionId={petitionId} />}

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{width: "400px", marginBottom: 2, marginTop: 2}}
                        onClick={updatePetition}
                        disabled={disableSave}
                    >
                        Save
                    </Button>
                    <Link to="/MyPetitions">
                        Back
                    </Link>
                </Stack>
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

export default EditPetition;
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
    const [editPetition, setEditPetition] = React.useState<EditPetition>();
    const [petition, setPetition] = React.useState<Petition>();

    const [originalPetition, setOriginalPetition] = React.useState<EditPetition>();

    const [categories, setCategories] = React.useState<Array<Category>>([]);
    // const [categoryIds, setCategoryIds] = React.useState<Array<Number>>([])
    const [categoryId, setCategoryId] = useState<number | string>("");


    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');

    const [disableSave, setDisableSave] = React.useState(false)

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
    }, [userLocal, navigate])

    const unDisableSave = () => {
        if (originalPetition?.title === editPetition?.title || originalPetition?.description === editPetition?.description || originalPetition?.categoryId === editPetition?.categoryId) {
            setDisableSave(false)
        } else {
            setDisableSave(true)
        }
    }

    // const editPetition = (key: string, newValue: string | number) => {
    //     setPetition(petition => {
    //         if (petition) {
    //             return {
    //                 ...petition,
    //                 [key] : newValue
    //             }
    //         }
    //     });
    // }

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

    const getPetition = () => {
        axios.get(`${baseUrl}/petitions/${petitionId}`, {
            headers: {
                "X-Authorization": userLocal.token
            }
        })
            .then((response) => {
                const petitionData = response.data
                setEditPetition(petitionData)
                setOriginalPetition(petitionData)

                setTitle(petitionData.title || '');
                setDescription(petitionData.description || '');
                setCategoryId(petitionData.categoryId || '');

                setErrorFlag(false)
                setErrorMessage("")
                console.log(petitionData)
            },
            (error) => {
                setErrorFlag(true)
                setErrorMessage(error.status);
            })
    }

    const handleCategoryClick = (event: SelectChangeEvent<number>) => {
        // editPetition("catergoryId", event.target.value as number);
        const categoryIdToHandle = event.target.value as number;
        setCategoryId(categoryIdToHandle);

    };

    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    // const updatePetition = () => {
    //     axios.patch(`${baseUrl}/petitions/${petitionId}`, petition, {
    //         headers: {
    //             "X-Authorization": userLocal.token
    //         }
    //     })
    //         .then((response) => {
    //
    //             navigate(`/petitions/${petitionId}`);
    //             console.log(response)
    //             setErrorFlag(false)
    //             setErrorMessage("")
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //             setErrorFlag(true)
    //             if (error.response.statusText === "Bad Request: data/supportTiers must NOT have fewer than 1 items") {
    //                 setErrorMessage("Please add at least one support tier")
    //             } else if (error.response.statusText.includes("fewer than 1")) {
    //                 setErrorMessage("Please fill out the required fields")
    //             } else if (error.response.statusText === "Bad Request: data/supportTiers/0/cost must be integer") {
    //                 setErrorMessage("Cost must be a number")
    //             } else if (error.response.statusText.includes("title must NOT have more than 128 characters")) {
    //                 setErrorMessage("Title too long! Keep it under 128 characters.")
    //             } else if (error.response.statusText.includes("data/description must NOT have more than 1024 characters")) {
    //                 setErrorMessage("Description too long! Keep it under 1024 characters.")
    //             } else {
    //                 setErrorMessage(error.response.statusText)
    //             }
    //         })
    // }
    const updatePetition = () => {
        const data: EditPetition = {};
        if (title !== '') {
            data.title = title
        }
        if (description !== '') {
            data.description = description
        }
        if (categoryId !== "") {
            data.categoryId = Number(categoryId)
        }
        axios.patch(`${baseUrl}/petitions/${petitionId}`, data, {
            headers: {
                "X-Authorization": userLocal.token
            }
        })
            .then((response) => {
                navigate(`/petitions/${petitionId}`);
                console.log(response)
                // setPetition(editPetition)
                setErrorFlag(false)
                setErrorMessage("")
            })
            .catch((error) => {
                console.log(error)
                setErrorFlag(true)
                if (error.response.statusText === "Bad Request: data/supportTiers must NOT have fewer than 1 items") {
                    setErrorMessage("Please add at least one support tier")
                } else if (error.response.statusText.includes("fewer than 1")) {
                    setErrorMessage("Please fill out the required fields")
                } else if (error.response.statusText === "Bad Request: data/title must NOT have more than 128 characters") {
                    setErrorMessage("Title too long! Keep it under 128 characters.")
                } else if (error.response.statusText === "Bad Request: data/description must NOT have more than 128 characters") {
                    setErrorMessage("Description too long! Keep it under 128 characters.")
                } else if (error.response.statusText === "Bad Request: data/supportTiers/0/cost must be integer") {
                    setErrorMessage("Cost must be a number")
                } else {
                    setErrorMessage(error.response.statusText)
                }
            })

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
                        // onChange={(event) => editPetition("title", event.target.value)}
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
                        // onChange={(event) => editPetition("description", event.target.value)}
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
                            labelId="category-multiple-label"
                            id="category-multiple-name"
                            label="Category"
                            value={Number(categoryId)}
                            onChange={handleCategoryClick}
                            renderValue={(selected) => {
                                const category = categories.find(c => c.categoryId === selected);
                                return category ? category.name : '';
                            }}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.categoryId} value={category.categoryId}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                            {/*<Select*/}
                            {/*    label="Category"*/}
                            {/*    value={categoryIds}*/}
                            {/*    onChange={handleCategoryClick}*/}
                            {/*    renderValue={(selected) => (*/}
                            {/*        selected.map(id => {*/}
                            {/*            const category = categories.find(c => c.categoryId === id);*/}
                            {/*            return category ? category.name : '';*/}
                            {/*        }).join(', ')*/}
                            {/*    )}*/}
                            {/*>*/}
                            {/*    {categories.map((category) => (*/}
                            {/*        <MenuItem key={category.categoryId} value={category.categoryId}>*/}
                            {/*            {category.name}*/}
                            {/*        </MenuItem>*/}
                            {/*    ))}*/}
                            {/*</Select>*/}
                        </FormControl>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{width: "400px", marginBottom: 2, marginTop: 2}}
                        onClick={updatePetition}
                        disabled={disableSave}
                    >
                        Save
                    </Button>
                    <hr style={{width: '100%'}}/>
                    <h2 style={{marginBottom: "10px"}}>Support Tiers</h2>
                    <EditSupportTiers petitionId={petitionId} />

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
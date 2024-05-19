import {
    Alert, AlertTitle, Avatar,
    Box, Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
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
    const [categoryIds, setCategoryIds] = React.useState<Array<Number>>([])

    const [disableSave, setDisableSave] = React.useState(true)

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

    React.useEffect(()=>{
        unDisableSave()
    }, [title, description, categoryId])

    const unDisableSave = () => {
        if (title !== petition?.title || description !== petition?.description || categoryId !== petition?.categoryId) {
            setDisableSave(false)
        } else {
            setDisableSave(true)
        }
    }

    React.useEffect(() => {
        const getCategories = () => {
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
        };
        getCategories()
    }, [])

    const handleCategoryClick = (event: SelectChangeEvent<number>) => {
        const categoryIdToHandle = event.target.value as number;
        setCategoryId(categoryIdToHandle);
    }

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
            },
            (error) => {
                setErrorFlag(true)
                setErrorMessage(error.status);
            })
    }
    const updatePetition = () => {
        const data: EditPetition = {};

        if (title !== '') {
            data.title = title
        }
        if (description !== '') {
            data.description = description
        }
        if (categoryId !== -1) {
            data.categoryId = categoryId
        }
        axios.patch(`${baseUrl}/petitions/${petitionId}`, data, {
            headers: {
                "X-Authorization": userLocal.token
            }
        })
            .then((response) => {
                navigate(`/petitions/${petitionId}`);
                console.log(response)
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
            <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 450}}>
                <Typography variant="h3" style={{fontWeight: 'bold'}}>
                    Edit Petition
                </Typography>
                <Stack direction="column" spacing={2} marginTop={2} marginBottom={2} justifyContent="center" alignItems="center">
                    <Avatar
                        src={`${baseUrl}/petitions/${petitionId}/image`}
                        style={{ width: 250, height: 250, borderRadius: 3 }}
                    >
                        <ImageNotSupportedIcon/>
                    </Avatar>
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
                        style={{ marginBottom: 2 }}
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
                        style={{ marginBottom: 2 }}
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
                                style={{marginBottom: 8}}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errorFlag &&
                                <Alert severity="error" style={{width: '100%'}}>
                                    <AlertTitle>Error</AlertTitle>
                                    {errorMessage}
                                </Alert>}
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={updatePetition}
                                disabled={disableSave}
                            >
                                Save
                            </Button>
                            <Link to="/MyPetitions" >
                                Back
                            </Link>
                        </FormControl>
                    </Box>
                </Stack>
            </Paper>
        </div>
    )
}

export default EditPetition;
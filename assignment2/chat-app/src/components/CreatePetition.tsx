import {
    Alert,
    AlertTitle,
    Box, Button, FormControl,
    InputAdornment, InputLabel, MenuItem,
    Paper, Select, SelectChangeEvent, Stack, TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import axios from "axios";
import {useUserInfoStorage} from "../store";
import {Link, useNavigate} from "react-router-dom";
import CreatePetitionImage from "./CreatePetitionImage";

const baseUrl = "http://localhost:4941/api/v1";

const CreatePetition = () => {
    const navigate = useNavigate();
    const userLocal = useUserInfoStorage(state => state.user)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [categories, setCategories] = React.useState<Array<Category>>([]);

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [categoryId, setCategoryId] = React.useState<Number>();
    const [categoryIds, setCategoryIds] = React.useState<Array<Number>>([])

    const [supportTiers, setSupportTiers] = React.useState<Array<CreateSupportTier>>([]);
    const [randomIndex, setRandomIndex] = React.useState(0);

    const [image, setImage] = useState<File | null>(null);

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
        if (supportTiers.length === 0) {
            handleAddSupportTier();
        }
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
                        setErrorMessage(error.toString());
                    }
                );
        };
        getCategories()
    }, [])

    const handleCategoryClick = (event: SelectChangeEvent<Number>) => {
        const categoryIdToHandle = event.target.value as Number;
        setCategoryId(categoryIdToHandle);
    }

   const createPetition = () => {
       for (let tier of supportTiers) {
           if (isNaN(Number(tier.cost))) {
               setErrorFlag(true);
               setErrorMessage("Cost must be a number");
               return;
           } else {
               tier.cost = Number(tier.cost)
           }
       }
           axios.post(`${baseUrl}/petitions`, {
               title: title,
               description: description,
               categoryId: categoryId,
               supportTiers: supportTiers.map(({tempId, ...rest }) => rest)
           }, {
               headers: {
                   "X-Authorization": userLocal.token,
               },
           })
           .then((response) => {
                   const petitionId = response.data.petitionId
                   uploadImage(petitionId)
                   setErrorMessage('')
                   setErrorFlag(false)
               },
               (error) => {
                   setErrorFlag(true)
                   if (error.response.statusText === "Bad Request: data/supportTiers must NOT have fewer than 1 items") {
                       setErrorMessage("Please add at least one support tier")
                   } else if (error.response.statusText.includes("fewer than 1")) {
                       setErrorMessage("Please fill out the required fields")
                   } else if (error.response.statusText.includes("title must NOT have more than 128 characters")) {
                       setErrorMessage("Title too long! Keep it under 128 characters.")
                   } else if (error.response.statusText.includes("data/description must NOT have more than 1024 characters")) {
                       setErrorMessage("Description too long! Keep it under 1024 characters.")
                   } else if (error.response.statusText === "Bad Request: data/supportTiers/0/cost must be integer") {
                       setErrorMessage("Cost must be a number")
                   } else {
                       setErrorMessage(error.response.statusText)
                   }
               })
       }

    const handleAddSupportTier = () => {
        if (supportTiers.length < 3) {
            setSupportTiers([...supportTiers, {tempId: randomIndex, title: '', description: '', cost: ""}])
            setRandomIndex(randomIndex + 1)
        }
    }

    const handleDeleteSupportTier = (id: number) => {
        const newSupportTiers = supportTiers.filter(tier => tier.tempId !== id)
        setSupportTiers(newSupportTiers)
    }


    const updateAddSupportTier = (tempId: number, key: string, newValue: string | number) => {
        const newSupportTiers = supportTiers.map(tier =>
        tier.tempId === tempId ? {...tier, [key] : newValue} : tier)
        setSupportTiers(newSupportTiers)
    }


    const addSupportTier = (tier: CreateSupportTier) => {
        return (
            <Box
                style={{
                    width: '100%',
                    maxWidth: 400,
                    marginBottom: 16,
                    border: "3px solid #0067cd",
                    borderRadius: "3%",
                    padding: 16,
                    boxSizing: 'border-box'
                }}
            >
                <h4 style={{marginTop: 10}}>Support Tier</h4>
                <Stack
                    sx={{width: 350}}
                >
                    <TextField
                        required
                        label="Title"
                        multiline
                        variant="outlined"
                        value={tier.title}
                        onChange={(event) => (updateAddSupportTier(tier.tempId, "title", event.target.value))}
                        InputProps={{
                            style: {
                                resize: 'vertical',
                                overflow: 'auto',
                            },
                        }}
                        style={{ marginBottom: 8 }}
                    />
                    <TextField
                        required
                        label="Description"
                        multiline
                        variant="outlined"
                        value={tier.description}
                        onChange={(event) => (updateAddSupportTier(tier.tempId, "description", event.target.value))}
                        InputProps={{
                            style: {
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
                        value={tier.cost}
                        onChange={(event) => (updateAddSupportTier(tier.tempId, "cost", event.target.value))}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        style={{ marginBottom: 8 }}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            background: "#C70000",
                            marginBottom: "8px",
                            "&:hover": {
                                background: "#ab0f0f",
                            }}}
                        onClick={() => (handleDeleteSupportTier(tier.tempId))}
                    >
                        Delete
                    </Button>
                </Stack>
            </Box>

            )
    }

    const handleImageUpload = (uploadedImage: File | null) => {
        setImage(uploadedImage);
    };

    const handleErrorMessage = (errorMessage: string) => {
        setErrorMessage(errorMessage);
    };

    const handleErrorFlag = (errorFlag: boolean) => {
        setErrorFlag(errorFlag);
    };


    const uploadImage = (petitionId: string) => {
        axios.put(`${baseUrl}/petitions/${petitionId}/image`, image, {
            headers: {
                "X-Authorization": userLocal.token,
                "Content-Type": image?.type
            }
        })
            .then((response) => {
                    navigate(`/petitions/${petitionId}`)
                    setErrorMessage("")
                    setErrorFlag(false)
                    setImage(response.data)
                },
                (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText)
                }
            )
    }


    return (
        <div style={{padding: 50}}>
            <Paper elevation={3} style={{padding: 20, margin: 'auto', maxWidth: 850}}>
                <Typography variant="h3" style={{fontWeight: 'bold', padding: 10, marginBottom: "10px"}}>
                    Create Petition
                </Typography>
                <CreatePetitionImage
                    image={image}
                    onImageUpload={handleImageUpload}
                    errorMessage={errorMessage}
                    errorFlag={errorFlag}
                    onErrorMessageChange={handleErrorMessage}
                    onErrorFlagChange={handleErrorFlag}
                />
                <Stack direction="column" spacing={2} marginTop={2} marginBottom={2} justifyContent="center" alignItems="center">
                    <TextField
                        required
                        label="Title"
                        multiline
                        variant="outlined"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        InputProps={{
                            style: {
                                resize: 'vertical',
                                overflow: 'auto',
                            },
                        }}
                        style={{width: 400, marginBottom: 2 }}
                    />
                    <TextField
                        required
                        label="Description"
                        multiline
                        variant="outlined"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        InputProps={{
                            style: {
                                resize: 'vertical',
                                overflow: 'auto',
                            },
                        }}
                        style={{ width: 400, marginBottom: 2 }}
                    />
                    <Box style={{width: 400, marginBottom: 2}}>
                        <FormControl fullWidth>
                            <InputLabel required id="category-single-label">Category</InputLabel>
                            <Select
                                required
                                labelId="category-single-label"
                                id="category-single-name"
                                value={categoryId || ""}
                                label="Category"
                                onChange={handleCategoryClick}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    {supportTiers.map((supportTier) => (
                        addSupportTier(supportTier)
                    ))}
                    {errorFlag &&
                        <Alert severity="error" sx={{ width: 400 }}>
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>}
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{ width: 400 }}
                        onClick={handleAddSupportTier}
                        disabled={supportTiers.length === 3}
                    >
                        Add Support Tier
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ width: 400 }}
                        onClick={()=>(createPetition())}
                        disabled={!image}
                    >
                        Create Petition
                    </Button>
                    <Link to="/petitions" >
                        Back to Petitions
                    </Link>
                </Stack>
            </Paper>
        </div>

    )
}

export default CreatePetition;

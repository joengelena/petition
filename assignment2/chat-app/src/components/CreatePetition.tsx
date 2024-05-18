import {
    Alert,
    AlertTitle,
    Avatar,
    Box, Button, FormControl,
    Grid, InputAdornment, InputLabel, MenuItem,
    Paper, Select, SelectChangeEvent, Stack,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import axios from "axios";
import {useUserInfoStorage} from "../store";
import {Link, useNavigate} from "react-router-dom";
import {CloudUpload} from "@mui/icons-material";

const baseUrl = "http://localhost:4941/api/v1";


const CreatePetition = () => {
    const navigate = useNavigate();
    const userLocal = useUserInfoStorage(state => state.user)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [petition, setPetition] = React.useState<CreatePetition>();

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [categoryId, setCategoryId] = React.useState<Number>();
    const [categoryIds, setCategoryIds] = React.useState<Array<Number>>([])

    const [supportTiers, setSupportTiers] = React.useState<Array<CreateSupportTier>>([]);
    const [numSupportTiers, setNumSupportTiers] = React.useState<number>(1);
    const [randomIndex, setRandomIndex] = React.useState(0);

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
                        console.log(response.data)
                    },
                    (error) => {
                        setErrorFlag(true);
                        setErrorMessage(error.toString());
                    }
                );
        };


        getCategories()
    }, [baseUrl])


    const handleCategoryClick = (event: SelectChangeEvent<Number>) => {
        const categoryIdToHandle = event.target.value as Number;
        setCategoryId(categoryIdToHandle);
    }
   const createPetition = () => {
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
                navigate(`/petitions/${response.data.petitionId}/uploadImage`);
                setErrorMessage('')
                setErrorFlag(false)

            },
                (error) => {
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

    const handleAddSupportTier = () => {
        if (supportTiers.length < 3) {
            setSupportTiers([...supportTiers, {tempId: randomIndex, title: '', description: '', cost: 0}])
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
            <Box style={{width: 400, marginBottom: 2, border: "3px solid #0067cd", borderRadius: "3%"}}>
                <h4 style={{marginTop: 10}}>Support Tier</h4>
                <TextField
                    required
                    label="Title"
                    multiline
                    variant="outlined"
                    value={tier.title}
                    onChange={(event) => (updateAddSupportTier(tier.tempId, "title", event.target.value))}
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
                    required
                    label="Description"
                    multiline
                    variant="outlined"
                    value={tier.description}
                    onChange={(event) => (updateAddSupportTier(tier.tempId, "description", event.target.value))}
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
                    required
                    label="Cost"
                    variant="outlined"
                    value={tier.cost}
                    onChange={(event) => (updateAddSupportTier(tier.tempId, "cost", Number(event.target.value)))}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    style={{ width: 350, marginBottom: 8 }}
                />
                <Button
                    variant="contained"
                    sx={{
                        background: "#C70000",
                        marginBottom: "8px",
                        "&:hover": {
                            background: "#ab0f0f", // Change hover color to red
                        }}}
                    onClick={() => (handleDeleteSupportTier(tier.tempId))}
                >Delete</Button>
            </Box>

            )
    }

    return (
        <div style={{padding: 50}}>
            <Paper elevation={3} style={{padding: 20, margin: 'auto', maxWidth: 850}}>
                <Typography variant="h3" style={{fontWeight: 'bold', padding: 10, marginBottom: "10px"}}>
                    Create Petition
                </Typography>

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
                                width: 400,
                                resize: 'vertical',
                                overflow: 'auto',
                            },
                        }}
                        style={{ marginBottom: 2 }}
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
                        disabled={supportTiers.length == 3}
                    >
                        Add Support Tier
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ width: 400 }}
                        onClick={createPetition}
                    >
                        Create Petition
                    </Button>
                    {/*<Button*/}
                    {/*    variant="contained"*/}
                    {/*    color="primary"*/}
                    {/*    style={{ width: 400 }}*/}
                    {/*    onClick={()=> {navigate(`/petitions/${petition?.petitionId}/uploadImage`)}}*/}
                    {/*    startIcon={<CloudUpload />}*/}
                    {/*>*/}
                    {/*    Update Photo*/}
                    {/*</Button>*/}
                    <Link to="/petitions" >
                        Back to Petitions
                    </Link>
                </Stack>
            </Paper>
        </div>

    )
}

export default CreatePetition;

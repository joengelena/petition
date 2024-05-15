import axios from 'axios';
import React, {ChangeEvent} from "react";
import {Link as RouterLink, Link, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import CSS from 'csstype';
import {
    Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent,
    DialogContentText, Paper, Snackbar, Stack, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TextField, DialogTitle,
    Box, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem,
    Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
    useTheme, IconButton, ToggleButton, Pagination, Typography, Avatar, InputAdornment,
} from "@mui/material";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const baseUrl = "http://localhost:4941/api/v1";

const Petitions = ()=> {
    const {petitionId} = useParams();
    const navigate = useNavigate();
    const [petitions, setPetitions] = React.useState<Array<Petition>>([]);
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    // const setTokenToStorage = useUserInfoStorage(state => state.setToken);
    // const setUserIdToStorage = useUserInfoStorage(state => state.setUserId);
    // const token = useUserInfoStorage(state => state.token);
    // const userId = useUserInfoStorage(state => state.userId);
    const [maxPage, setMaxPage] = React.useState(1)
    const [currentPage, setCurrentPage] = React.useState(1)

    const [searchQuery, setSearchQuery] = React.useState("")
    const [supportingCostFilter, setSupportingCostFilter] = React.useState("")
    const [sortByQuery, setSortByQuery] = React.useState("CREATED_ASC");
    const [query, setQuery] = React.useState("")

    const [supportingCost, setSupportingCost] = React.useState("")
    const [categoryIds, setCategoryIds] = React.useState<Array<Number>>([])

    React.useEffect(() => {
        if (currentPage > maxPage && maxPage !== 0) {
            setCurrentPage(maxPage)
        } else{
            getPetitions(currentPage)
        }
    }, [currentPage, maxPage]);

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
    }, [baseUrl])

    const handlePageUpdate = (event: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const getPetitions = (pageNum: number) => {
        let allQuery = []
        const startIndex = (pageNum - 1) * 10

        if (searchQuery.length !== 0) {
            allQuery.push("q=" + searchQuery)
        }

        if (sortByQuery.length !== 0) {
            allQuery.push("sortBy=" + sortByQuery)
        }

        if (categoryIds.length !== 0) {
            for (let i = 0; i < categoryIds.length; i++) {
                allQuery.push("categoryIds=" + categoryIds[i])
            }
        }

        if (supportingCostFilter.length !== 0) {
            allQuery.push("supportingCost=" + supportingCostFilter)
        }

        console.log(allQuery)

        const endQuery = allQuery.join("&")
        axios.get(`${baseUrl}/petitions?count=10&startIndex=${startIndex}&${endQuery}`)
            .then((response) => {
                    setPetitions(response.data.petitions)
                    setMaxPage(Math.ceil(response.data.count / 10))
                    setErrorFlag(false)
                },
                (error) => {
                    setErrorFlag(true)
                    setErrorMessage('Error fetching petitions: ' + error)
            })
    }

    const sortingOptions = [
        {value: "ALPHABETICAL_ASC", label: "Ascending Alphabetically"},
        {value: "ALPHABETICAL_DESC", label: "Descending alphabetically"},
        {value: "COST_ASC", label: "Ascending by supporting cost"},
        {value: "COST_DESC", label: "Descending by supporting cost"},
        {value: "CREATED_ASC", label: "Chronologically by creation date"}, //  (from the first to be created to the last)
        {value: "CREATED_DESC", label: "Reverse Chronologically by creation date"} // (from the last to be created to the first)
    ]
    const handleSortByClick = (event: SelectChangeEvent) => {
        setSortByQuery(event.target.value)
    };

    const handleCategoryClick = (event: SelectChangeEvent<Number[]>) => {
        const categoryIdToHandle = event.target.value as Number[]

        setCategoryIds(prevIds => {
            const addedIds = categoryIdToHandle.filter(id => !prevIds.includes(id));
            const removedIds = prevIds.filter(id => !categoryIdToHandle.includes(id));

            return prevIds
                .concat(addedIds)
                .filter(id => !removedIds.includes(id));
        });
    }

    const petition_rows = () => {
        if (petitions.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={7} align="center">
                        <Typography variant="body1">No petitions found.</Typography>
                    </TableCell>
                </TableRow>
            );
        }

        return petitions.map((petition: Petition) =>
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
                        style={{ width: 100, height: 100, borderRadius: 0 }}
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
                        {petition.creationDate}
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
                <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 1200}}>
                    <Typography variant="h3" style={{ fontWeight: 'bold', padding: 10 }}>
                        Petitions
                    </Typography>
                    <Button variant="contained" style={{background: "#0f5132"}} onClick={() => navigate("/createPetition")}>Create Petition</Button>
                    <Stack direction="row" spacing={2} marginTop={2} marginBottom={2} justifyContent="center">
                        <TextField
                            label="Search"
                            type="search"
                            variant="outlined"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            style={{width: 300, marginBottom: 2}}
                        />
                        <Box style={{width:300, marginBottom: 2}}>
                            <FormControl fullWidth>
                                <InputLabel id="sortby-select-label">Sort By</InputLabel>
                                <Select
                                    labelId="sortby-select-label"
                                    id="sortby-select"
                                    value={sortByQuery}
                                    label="Sort By"
                                    onChange={handleSortByClick}
                                >
                                    {sortingOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box style={{width:300, marginBottom: 2}}>
                            <FormControl fullWidth>
                                <InputLabel id="category-multiple-label">Category</InputLabel>
                                <Select
                                    labelId="category-multiple-label"
                                    id="category-multiple-name"
                                    multiple
                                    label="Category"
                                    value={categoryIds}
                                    onChange={handleCategoryClick}
                                    renderValue={(selected) => (
                                        selected.map(id => {
                                            const category = categories.find(c => c.categoryId === id);
                                            return category ? category.name : '';
                                        }).join(', ')
                                    )}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.categoryId} value={category.categoryId}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <TextField
                            label="Supporting Cost"
                            type="search"
                            variant="outlined"
                            value={supportingCostFilter}
                            onChange={(event) => setSupportingCostFilter(event.target.value)}
                            style={{width: 300, marginBottom: 2}}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">{"<="}</InputAdornment>,
                            }}
                        />
                        <Button variant="contained" onClick={() => getPetitions(1)}>Search</Button>
                    </Stack>

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
                                {petition_rows()}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Stack spacing={2} alignItems="center" marginY={4}>
                        <Typography>
                            Page {currentPage} of {maxPage}
                        </Typography>
                        <Pagination
                            count={maxPage}
                            page={currentPage}
                            onChange={handlePageUpdate}
                            showFirstButton
                            showLastButton
                            size="large"
                            color="primary"
                            shape="rounded"
                        />
                    </Stack>
                </Paper>
            </div>
        )
    }
}
export default Petitions;
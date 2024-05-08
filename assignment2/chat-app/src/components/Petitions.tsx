import axios from 'axios';
import React, {ChangeEvent} from "react";
import {Link as RouterLink, Link, useParams, useSearchParams} from 'react-router-dom';
import CSS from 'csstype';
import {
    Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent,
    DialogContentText, Paper, Snackbar, Stack, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TextField, DialogTitle,
    Box, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem,
    Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
    useTheme, IconButton, ToggleButton, Pagination, Typography, Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {useUserInfoStorage} from "../store";
import SubjectIcon from "@mui/icons-material/Subject";
import UsersIcon from "@mui/icons-material/PeopleOutline";
import RegisterIcon from "@mui/icons-material/AccountBox";
import LoginIcon from "@mui/icons-material/Login";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import LastPageIcon from '@mui/icons-material/LastPage';
import {Search} from "@mui/icons-material";
const baseUrl = "http://localhost:4941/api/v1";

const Petitions = ()=> {
    const {petitionId} = useParams();
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
    const [sortByQuery, setSortByQuery] = React.useState("CREATED_ASC");

    const [query, setQuery] = React.useState("")

    const [supportingCost, setSupportingCost] = React.useState("")
    const [categoryIds, setCategoryIds] = React.useState<Array<Number>>([])

    const [sortByOpen, setSortByOpen] = React.useState(false);
    const [categoriesOpen, setCategoriesOpen] = React.useState(false);


    React.useEffect(() => {
        if (currentPage > maxPage) {
            setCurrentPage(maxPage)
        } else{
            getPetitions(currentPage)
        }

        // const getPetitions = () => {
        //     // axios.get(baseUrl + `/petitions`).then(
        //     //     (response) => {
        //     //         setErrorFlag(false);
        //     //         setErrorMessage("");
        //     //         setPetitions(response.data.petitions);
        //     //     },
        //     //     (error) => {
        //     //         setErrorFlag(true);
        //     //         setErrorMessage(error.toString());
        //     //     }
        //     // );
        // };
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
    }, [currentPage, maxPage]);

    // const handleChangeSortBy = (event: SelectChangeEvent) => {
    //     setSortByQuery(event.target.value);
    //     getPetitions(1)
    // };

    const handlePageUpdate = (event: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const toggleDrawer = (newOpen: boolean, setFunction: React.Dispatch<React.SetStateAction<boolean>>) => () => {
        setFunction(newOpen);
    };

    const getPetitions = (pageNum: number) => {
        let allQuery = []
        const startIndex = (currentPage - 1) * 10

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

    // const handleSearchEnterKey = (event: any) => {
    //     if (event.key === "Enter") {
    //         getPetitions(1)
    //     }
    // }

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

    const CategoryDrawer = (
        <Box sx={{width: 350}} role="presentation">
            <List>
                {categories.map((category) => (
                    <ListItem key={category.name} disablePadding>
                        <ListItemButton
                            onClick={() => handleCategoryClick(category.categoryId)}
                            selected={categoryIds.includes(category.categoryId)}>
                            <ListItemText primary={category.name}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )

    const handleCategoryClick = (categoryId: number) => {
        setCategoryIds(prevIds => {
            if (prevIds.includes(categoryId)) {
                // Filter out the id to remove it
                return prevIds.filter(id => id !== categoryId);
            } else {
                // Return a new array with the new id added
                return [...prevIds, categoryId];
            }
        });
    }

    const petition_rows = () => {
        return petitions.map((petition: Petition) =>
            <TableRow
                hover tabIndex={-1}
                key={petition.petitionId}
                component={Link}
                to={`/petitions/${petition.petitionId}`}
                style={{ textDecoration: 'none' }}
            >
                <TableCell>
                    <img src={`${baseUrl}/petitions/${petition.petitionId}/image`} width="100" height="100"/>
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
                        {petition.categoryId}
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
                        style={{ width: 80, height: 80 }} // Smaller Avatar for a cleaner look
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
            <div style={{padding: 15}}>
                <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 1200}}>
                    <Typography variant="h2" style={{ fontWeight: 'bold' }}>
                        Petitions
                    </Typography>

                    <Stack direction="row" spacing={2} marginBottom={2}>
                        <TextField
                            label="Search"
                            type="search"
                            variant="outlined"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            size="medium"
                            style={{minWidth: 120, maxWidth: 300, marginBottom: 2}}
                        />
                        <Box style={{minWidth: 120, maxWidth:300, marginBottom: 2}}>
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

                        <Button
                            style={{minWidth: 120, width:300, marginBottom: 2}}
                            variant="outlined"
                            onClick={toggleDrawer(true, setCategoriesOpen)}
                        >
                            Categories
                        </Button>

                        <Drawer
                            anchor='right'
                            open={categoriesOpen}
                            onClose={toggleDrawer(false, setCategoriesOpen)}
                        >
                            {CategoryDrawer}
                        </Drawer>

                        <Button variant="contained" onClick={() => getPetitions(1)}>Search</Button>
                    </Stack>

                    <TableContainer component={Paper} style={{marginTop: 20}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Creation Date</TableCell>
                                    <TableCell>Category Id</TableCell>
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
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
    useTheme, IconButton, ToggleButton, Pagination,
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

const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}

const Petitions = ()=> {
    const {id} = useParams();
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
        getPetitions(1)
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
            axios.get(baseUrl + `/petitions/categories`).then(
                (response) => {
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
        console.log(endQuery)

        axios.get(`${baseUrl}/petitions?count=10&startIndex=${startIndex}&${endQuery}`)
            .then((response) => {
                    setPetitions(response.data.petitions)
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
            <TableRow hover tabIndex={-1} key={petition.title}>
                <TableCell>
                    <img src={`${baseUrl}/petitions/${petition.petitionId}/image`} width="100" height="100"/>
                </TableCell>
                <TableCell>
                    {petition.title}
                </TableCell>
                <TableCell>
                    {petition.creationDate}
                </TableCell>
                <TableCell>
                    {petition.categoryId}
                </TableCell>
                <TableCell>
                    {petition.ownerFirstName + " " + petition.ownerLastName}
                </TableCell>
                <TableCell>
                    <img src={`${baseUrl}/users/${petition.ownerId}/image`} width="100" height="100"/>
                </TableCell>
                <TableCell>
                    {petition.supportingCost}
                </TableCell>
                {/*<TableCell align="right"><Link*/}
                {/*    to={"/petitions/" + row.petitionId}>Go to petitions</Link>*/}
                {/*</TableCell>*/}
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
            <div>
                <Paper elevation={3} style={card}>
                    <h1>Petitions</h1>
                    <TextField
                        label="Search"
                        type="search"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                    >
                    </TextField>
                    <Box sx={{minWidth: 120}}>
                        <FormControl fullWidth>
                            <InputLabel id="sortby-select-label">Sort By</InputLabel>
                            <Select
                                labelId="sortby-select-label"
                                id="sortby-select"
                                style={{width: "300px"}}
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
                    <React.Fragment>
                        <Button onClick={toggleDrawer(true, setCategoriesOpen)}>Categories</Button>
                        <Drawer
                            anchor='right'
                            open={categoriesOpen}
                            onClose={toggleDrawer(false, setCategoriesOpen)}
                        >
                            {CategoryDrawer}
                        </Drawer>
                    </React.Fragment>
                    <Button onClick={() => getPetitions(1)}>Search</Button>
                    <TableContainer component={Paper}>
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
                    <Pagination count={maxPage} page={currentPage} onChange={handlePageUpdate} showFirstButton
                                showLastButton/>
                </Paper>
            </div>

        )

    }

}
export default Petitions;
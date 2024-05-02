import axios from 'axios';
import React from "react";
import {Link as RouterLink, Link, useParams, useSearchParams} from 'react-router-dom';
import CSS from 'csstype';
import {
    Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent,
    DialogContentText, Paper, Snackbar, Stack, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TextField, DialogTitle,
    Box, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem,
    Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
    useTheme, IconButton, ToggleButton,
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

    const [sortingBy, setSortingBy] = React.useState("CREATED_ASC");
    const [query, setQuery] = React.useState("")
    const [supportingCost, setSupportingCost] = React.useState("")
    const [categoryIds, setCategoryIds] = React.useState<Array<Number>>([])
    const [sortByOpen, setSortByOpen] = React.useState(false);
    const [categoriesOpen, setCategoriesOpen] = React.useState(false);

    React.useEffect(() => {

        const getPetitions = () => {
            axios.get(baseUrl + `/petitions`).then(
                (response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetitions(response.data.petitions);
                },
                (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                }
            );
        };

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
        getPetitions()
        getCategories()
    }, []);

    const handleChangeSortBy = (event: SelectChangeEvent) => {
        setSortingBy(event.target.value);
        // query.set("sortBy", event.target.value);
        setQuery(query);
    };

    const toggleDrawer = (newOpen: boolean, setFunction: React.Dispatch<React.SetStateAction<boolean>>) => () => {
        // setSortByOpen(newOpen);
        // setCategoriesOpen(newOpen);
        setFunction(newOpen);
    };

    const getPetitions = () => {

        axios.get(`${baseUrl}/petitions?q=${query}&categoryIds=${categoryIds}`)
            .then((response) => {
                setPetitions(response.data.petitions)
            })

    }

    const handleSearchEnterKey = (event: any) => {
        if (event.key === "Enter") {
            getPetitions()
        }
    }

    const sortingOptions = [
        {value: "ALPHABETICAL_ASC", label: "Ascending Alphabetically"},
        {value: "ALPHABETICAL_DSC", label: "Descending alphabetically"},
        {value: "COST_ASC", label: "Ascending by supporting cost"},
        {value: "COST_DESC", label: "Descending by supporting cost"},
        {value: "CREATED_ASC", label: "Chronologically by creation date"}, //  (from the first to be created to the last)
        {value: "CREATED_DESC", label: "Reverse Chronologically by creation date"} // (from the last to be created to the first)
    ]

    const DrawerList = (
        <Box sx={{ width: 350 }} role="presentation" onClick={toggleDrawer(false, setSortByOpen)}>
            <List>
                {sortingOptions.map((option) => (
                    <ListItem key={option.value} disablePadding>
                        <ListItemButton onClick={() => {
                            toggleDrawer(false, setSortByOpen)(); // Close the drawer
                            // handleChangeSortBy(option.value); // Directly pass the sorting value
                        }}>
                            <ListItemText primary={option.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

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

    const CategoryDrawer = (
        <Box sx={{ width: 350 }} role="presentation">
            <List>
                {categories.map((category) => (
                    <ListItem key={category.name} disablePadding>
                        <ListItemButton onClick={() => handleCategoryClick(category.categoryId)} selected={categoryIds.includes(category.categoryId)}>
                            <ListItemText primary={category.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )

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

    // const petition_rows = () => {
    //     return petitions.map((row: Petition) =>
    //         <TableRow hover tabIndex={-1} key={row.petitionId}>
    //             <TableCell>
    //                 {row.petitionId}
    //             </TableCell>
    //             <TableCell align="right">{row.title}</TableCell>
    //             <TableCell align="right"><Link
    //                 to={"/petitions/" + row.petitionId}>Go to petitions</Link>
    //             </TableCell>
    //             <TableCell align="right">
    //                 <Button variant="outlined" endIcon={<EditIcon />} onClick={() => {}}>
    //                     Edit
    //                 </Button>
    //                 <Button variant="outlined" endIcon={<DeleteIcon />} onClick={() => deletePetition(row)}>
    //                     Delete
    //                 </Button>
    //             </TableCell>
    //         </TableRow>
    //     )
    // }

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
                    {/*<Search>*/}
                    {/*    <SearchIconWrapper>*/}
                    {/*        <SearchIcon />*/}
                    {/*    </SearchIconWrapper>*/}
                    {/*    <StyledInputBase*/}
                    {/*        placeholder="Search…"*/}
                    {/*        inputProps={{ 'aria-label': 'search' }}*/}
                    {/*    />*/}
                    {/*</Search>*/}
                    <TextField
                        label="Search"
                        type="search"
                        variant="outlined"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyPress={handleSearchEnterKey}>
                    </TextField>
                    <React.Fragment>
                        <Button onClick={toggleDrawer( true, setSortByOpen)}>Sort By</Button>
                        <Drawer
                            anchor='right'
                            open={sortByOpen}
                            onClose={toggleDrawer(false, setSortByOpen)}
                        >
                            {DrawerList}
                        </Drawer>
                    </React.Fragment>
                    <React.Fragment>
                        <Button onClick={toggleDrawer( true, setCategoriesOpen)}>Categories</Button>
                        <Drawer
                            anchor='right'
                            open={categoriesOpen}
                            onClose={toggleDrawer(false, setCategoriesOpen)}
                        >
                            {CategoryDrawer}
                        </Drawer>
                    </React.Fragment>
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
                </Paper>
            </div>

        )

    }

}
export default Petitions;
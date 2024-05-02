import axios from 'axios';
import React from "react";
import {Link as RouterLink, Link, useParams, useSearchParams} from 'react-router-dom';
import CSS from 'csstype';
import {
    Alert,
    AlertTitle,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    DialogTitle,
    Box,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem,
    Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {useUserInfoStorage} from "../store";
import SubjectIcon from "@mui/icons-material/Subject";
import UsersIcon from "@mui/icons-material/PeopleOutline";
import RegisterIcon from "@mui/icons-material/AccountBox";
import LoginIcon from "@mui/icons-material/Login";
const baseUrl = "http://localhost:4941/api/v1";


const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}

interface HeadCell {
    id: string;
    label: string;
    numeric: boolean;
}
const headCells: readonly HeadCell[] = [
    { id: 'petitionId', label: 'id', numeric: true },
    { id: 'title', label: 'Title', numeric: false },
    { id: 'categoryId', label: 'Category Id', numeric: true },
    { id: 'ownerId', label: 'Owner Id', numeric: true }
];

const Petitions = ()=> {
    const {id} = useParams();
    const [petitions, setPetitions] = React.useState<Array<Petition>>([]);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    // const setTokenToStorage = useUserInfoStorage(state => state.setToken);
    // const setUserIdToStorage = useUserInfoStorage(state => state.setUserId);
    // const token = useUserInfoStorage(state => state.token);
    // const userId = useUserInfoStorage(state => state.userId);

    const [sortingBy, setSortingBy] = React.useState("CREATED_ASC");
    const [searchQuery, setSearchQuery] = useSearchParams();
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const getPetitions = () => {

            axios.get(baseUrl + "/petitions").then(
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
        getPetitions();
    });

    const handleChangeSortBy = (value: string) => {
        setSortingBy(value);
        searchQuery.set("sortBy", value);
        setSearchQuery(searchQuery);
    };
    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        handleChangeSortBy(event.target.value);
    };
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const sortingPetitions = [
        {value: "ALPHABETICAL_ASC", label: "Ascending Alphabetically"},
        {value: "ALPHABETICAL_DSC", label: "Descending alphabetically"},
        {value: "COST_ASC", label: "Ascending by supporting cost"},
        {value: "COST_DESC", label: "Descending by supporting cost"},
        {value: "CREATED_ASC", label: "Chronologically by creation date"}, //  (from the first to be created to the last)
        {value: "CREATED_DESC", label: "Reverse Chronologically by creation date"} // (from the last to be created to the first)
    ]

    const DrawerList = (
        <Box sx={{ width: 350 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {sortingPetitions.map((option) => (
                    <ListItem key={option.value} disablePadding>
                        <ListItemButton onClick={() => {
                            handleChangeSortBy(option.value);
                            toggleDrawer(false)();
                        }}>
                            <ListItemText primary={option.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );



    const petition_rows = () => {
        return petitions.map((row: Petition) =>
            <TableRow hover
                      tabIndex={-1}
                      key={row.petitionId}>
                <TableCell>
                    {row.petitionId}
                </TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="right"><Link
                    to={"/petitions/" + row.petitionId}>Go to petitions</Link></TableCell>
                <TableCell align="right">
                    <Button variant="outlined" endIcon={<EditIcon />} onClick={() => {
                    }}>
                        Edit
                    </Button>
                    <Button variant="outlined" endIcon={<DeleteIcon />} onClick={() => {
                    }}>
                        Delete
                    </Button>
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
            <div>
                <Paper elevation={3} style={card}>
                    <h1>Petitions</h1>
                    <React.Fragment key='right'>
                        <Button onClick={toggleDrawer( true)}>Sort By</Button>
                        <Drawer
                            anchor='right'
                            open={open}
                            onClose={toggleDrawer(false)}
                        >
                            {DrawerList}
                        </Drawer>
                    </React.Fragment>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={headCell.numeric ? 'right' :
                                                'left'}
                                            padding={'normal'}>
                                            {headCell.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {petition_rows()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{minWidth: 120}}>
                        <FormControl fullWidth>
                            <InputLabel id="sortBySelectBoxLabel">sortBy</InputLabel>
                            <Select
                                labelId="sortBySelectBoxLabel"
                                id="sortBySelectBox"
                                style={{ width: "300px" }}
                                value={sortingBy}
                                label="Sort By"
                                onChange={handleSelectChange}
                            >
                                {sortingPetitions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Paper>
            </div>

        )

    }

}
export default Petitions;
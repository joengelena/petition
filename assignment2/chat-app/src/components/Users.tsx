import axios from 'axios';
import React from "react";
import {Link, useNavigate} from 'react-router-dom';
import CSS from 'csstype';
import {
    Alert, AlertTitle,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Paper, Snackbar, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


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
    { id: 'ID', label: 'id', numeric: true },
    { id: 'username', label: 'Username', numeric: false },
    { id: 'link', label: 'Link', numeric: false },
    { id: 'actions', label: 'Actions', numeric: false }
];

const Users = ()=> {

    const navigate = useNavigate();
    const [users, setUsers] = React.useState < Array < User >> ([])
    const [user, setUser] = React.useState<User>({user_id:0, username:""})
    const [addUserUsername, setAddUserUsername] = React.useState("")
    const [editedUser, setEditedUser] = React.useState<User>({ user_id: 0, username: "" })
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [openAddUserDialog, setOpenAddUserModal] = React.useState(false)
    const [dialogUser, setDialogUser] = React.useState<User>({ username: "", user_id: -1 })

    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    React.useEffect(() => {
        getUsers()
    }, [])
    const getUsers = () => {
        axios.get('http://localhost:3000/api/users')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setUsers(response.data)
                setEditedUser(prevEditedUser => ({
                    ...prevEditedUser,
                    user_id: response.data.user_id
                }));
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const deleteUser = (user: User) => {
        axios
            .delete('http://localhost:3000/api/users/' + user.user_id)
            .then((response) => {
                // Filter out the deleted user from the state
                setUsers(users.filter(u => u.user_id !== user.user_id));
                setOpenDeleteDialog(false);
                setSnackMessage("User is deleted successfully")
                setSnackOpen(true)
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    };


    const addUser = () => {
        axios.post('http://localhost:3000/api/users', { username: addUserUsername })
            .then((response) => {
                setUsers([...users, response.data]);
                setAddUserUsername(""); // Reset the input field
                setOpenAddUserModal(false);
                setSnackMessage("User is added successfully")
                setSnackOpen(true)
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    };

    const editUser = (id: number, username: string) => {
        axios
            .put("http://localhost:3000/api/users/" + id, { username: username })
            .then((response) => {
                setUsers(users.map(user => user.user_id === id ? { ...user, username: username } : user));
                setOpenEditDialog(false);
                setSnackMessage("Username changed successfully")
                setSnackOpen(true)
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleDeleteDialogOpen = (user: User) => {
        setDialogUser(user)
        setOpenDeleteDialog(true);
    };
    const handleDeleteDialogClose = () => {
        setDialogUser({ username: "", user_id: -1 })
        setOpenDeleteDialog(false);
    };

    const handleEditDialogOpen = (user: User) => {
        setEditedUser(user)
        setOpenEditDialog(true);
    };
    const handleEditDialogClose = () => {
        // setEditedUser({ username: "", user_id: -1 })
        setOpenEditDialog(false);

    };


    const user_rows = () => {
        return users.map((row: User) =>
            <TableRow hover
                      tabIndex={-1}
                      key={row.user_id}>
                <TableCell>
                    {row.user_id}
                </TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="right"><Link
                    to={"/users/" + row.user_id}>Go to user</Link></TableCell>
                <TableCell align="right">
                    <Button variant="outlined" endIcon={<EditIcon />} onClick={() => { handleEditDialogOpen(row)
                    }}>
                        Edit
                    </Button>
                    <Button variant="outlined" endIcon={<DeleteIcon />} onClick={() => { handleDeleteDialogOpen(row)
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
                <h1>Users</h1>
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
                    <h1>Users</h1>
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
                                {user_rows()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Paper elevation={3} style={card}>
                    <h1>Add a new user</h1>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <TextField id="outlined-basic" label="Username" variant="outlined" value={addUserUsername}
                                   onChange={(event) => setAddUserUsername(event.target.value)} />
                        <Button variant="outlined" onClick={() => { addUser() }}>
                            Submit
                        </Button>
                    </Stack>
                </Paper>

                <Dialog
                    open={openEditDialog}
                    onClose={handleEditDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {"Edit User"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            How would you like to change the user's name?
                        </DialogContentText>
                    </DialogContent>

                    <DialogContent>
                        <form>
                            <div>
                                <TextField
                                    id="username"
                                    name="username"
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    value={editedUser.username}
                                    onChange={handleInputChange}/>
                            </div>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="error" onClick={() => {
                            editUser(editedUser.user_id, editedUser.username)
                        }} autoFocus>
                            Save Change
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openDeleteDialog}
                    onClose={handleDeleteDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">

                    <DialogTitle id="alert-dialog-title">
                        {"Delete User?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this user?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="error" onClick={() => {
                            deleteUser(user)
                        }} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

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

            </div>
        )
    }
}

export default Users;
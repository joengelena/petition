import {Link, useNavigate, useParams} from "react-router-dom";
import React from "react";
import axios from "axios";
import {
    Alert, AlertTitle,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Snackbar,
    TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const User = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [user, setUser] = React.useState<User>({user_id:0, username:""})
    const [editedUser, setEditedUser] = React.useState<User>({ user_id: 0, username: "" })
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [dialogUser, setDialogUser] = React.useState<User>({ username: "", user_id: -1 })

    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
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
        setDialogUser(user)
        setOpenEditDialog(true);
    };
    const handleEditDialogClose = () => {
        setDialogUser({ username: "", user_id: -1 })
        setOpenEditDialog(false);

    };

    const deleteUser = () => {
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then((response) => {
                navigate('/users')
                setSnackMessage("User is deleted successfully")
                setSnackOpen(true)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const editUser = (id: number, username: string) => {
        axios
            .put("http://localhost:3000/api/users/" + id, { username: username })
            .then(
                (response) => {
                    navigate(`/users`);
                    setOpenEditDialog(false);
                    setSnackMessage("Username changed successfully")
                    setSnackOpen(true)
                },
                (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                }
            );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    React.useEffect(() => {
        const getUser = () => {
            axios.get('http://localhost:3000/api/users/'+id)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setUser(response.data)
                    setEditedUser(prevEditedUser => ({
                        ...prevEditedUser,
                        user_id: response.data.user_id
                    }));
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getUser()
    }, [id])

    if (errorFlag) {
        return (
            <div>
                <h1>User</h1>
                {errorFlag &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}
                <Link to={"/users"}>Back to users</Link>
            </div>
        )
    } else {
        return (
            <div>
                <h1>User</h1>
                {user.user_id}: {user.username}
                {editedUser.user_id}: {editedUser.username}
                <Link to={"/users"}>Back to users</Link>
                <Button variant="outlined" endIcon={<EditIcon />} onClick={() => { handleEditDialogOpen(user)
                }}>
                    Edit
                </Button>
                <Button variant="outlined" endIcon={<DeleteIcon />} onClick={() => { handleDeleteDialogOpen(user)
                }}>
                    Delete
                </Button>

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
                            deleteUser()
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

export default User;
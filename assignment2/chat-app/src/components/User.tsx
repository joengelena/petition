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
import {useUserInfoStorage} from "../store";
const baseUrl = "http://localhost:4941/api/v1";


const User = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [user, setUser] = React.useState<User>({ firstName: "", lastName: "", email: "", password: "", imageFilename: "", authToken:"", userId: -1 })
    const [editedUser, setEditedUser] = React.useState<User>({ firstName: "", lastName: "", email: "", password: "", imageFilename: "", authToken:"", userId: 0 })
    const [dialogUser, setDialogUser] = React.useState<User>({ firstName: "", lastName: "", email: "", password: "", imageFilename: "", authToken:"", userId: -1 })
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [openEditDialog, setOpenEditDialog] = React.useState(false)

    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("");
    const userLocal = useUserInfoStorage(state => state.user)

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
        setDialogUser({ firstName: "", lastName: "", email: "", password: "", imageFilename: "", authToken:"", userId: -1 })
        setOpenDeleteDialog(false);
    };

    const handleEditDialogOpen = (user: User) => {
        setDialogUser(user)
        setOpenEditDialog(true);
    };
    const handleEditDialogClose = () => {
        setDialogUser({ firstName: "", lastName: "", email: "", password: "", imageFilename: "", authToken:"", userId: -1 })
        setOpenEditDialog(false);

    };

    const deleteUser = () => {
        axios.delete(`${baseUrl}/users/${userLocal.userId}`)
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
            .put(baseUrl + "/users/" + id, { username: username })
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
            const config = {
                method: "get",
                url: `${baseUrl}/users/${userLocal.userId}`,
                headers: {
                    "X-Authorization": userLocal.token,
                },
            };
            axios(config)
                .then((response) => {
                    if (response.data.email === undefined) {
                        navigate('/users');
                    }
                    setErrorFlag(false)
                    setErrorMessage("")
                    setUser(response.data)
                    setEditedUser(prevEditedUser => ({
                        ...prevEditedUser,
                        userId: response.data.userId
                    }));
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                    navigate('/users');
                })
            getUser()
        }
    }, )


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
                {user.userId}: {user.firstName}
                {editedUser.userId}: {editedUser.firstName}
                {user.userId}: {user.lastName}
                {editedUser.userId}: {editedUser.lastName}
                {user.userId}: {user.email}
                {editedUser.userId}: {editedUser.email}
                {user.userId}: {user.password}
                {editedUser.userId}: {editedUser.password}
                <Link to={"/users"}>Back to users</Link>
                <Button variant="outlined" endIcon={<EditIcon />} onClick={() => { handleEditDialogOpen(user)}}>
                    Edit</Button>
                <Button variant="outlined" endIcon={<DeleteIcon />} onClick={() => { handleDeleteDialogOpen(user)}}>
                    Delete</Button>

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
                            Change the user's details that you want to update.
                        </DialogContentText>
                    </DialogContent>

                    <DialogContent>
                        <form>
                            <div>
                                <TextField
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    variant="outlined"
                                    fullWidth
                                    value={editedUser.firstName}
                                    onChange={handleInputChange}/>
                            </div>
                        </form>
                        <form>
                            <div>
                                <TextField
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    variant="outlined"
                                    fullWidth
                                    value={editedUser.lastName}
                                    onChange={handleInputChange}/>
                            </div>
                        </form>
                        <form>
                            <div>
                                <TextField
                                    id="email"
                                    name="email"
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    value={editedUser.email}
                                    onChange={handleInputChange}/>
                            </div>
                        </form>
                        <form>
                            <div>
                                <TextField
                                    id="password"
                                    name="password"
                                    label="New Password"
                                    variant="outlined"
                                    fullWidth
                                    value={editedUser.password}
                                    onChange={handleInputChange}/>
                            </div>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="error" onClick={() => {
                            editUser(user.userId, editedUser.firstName)
                            editUser(user.userId, editedUser.lastName)
                            editUser(user.userId, editedUser.email)
                            editUser(user.userId, editedUser.password)
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
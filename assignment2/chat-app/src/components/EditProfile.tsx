import React, { useState } from 'react';
import axios from "axios";
import {useUserInfoStorage} from "../store";
import {Alert, AlertTitle, Avatar, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {Visibility, VisibilityOff} from "@mui/icons-material";
const baseUrl = "http://localhost:4941/api/v1";


const EditProfile = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [currentPasswordVisible, setCurrentPasswordVisible] = React.useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = React.useState(false);

    const userLocal = useUserInfoStorage(state => state.user);
    const [errorFlag, setErrorFlag] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [user, setUser] = React.useState<User>()

    const [disableSave, setDisableSave] = React.useState(true)

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
    }, [userLocal, navigate])

    React.useEffect(() => {
        getUser()
    }, [])

    React.useEffect(()=>{
        unDisableSave()
    }, [firstName, lastName, email, newPassword])

    const unDisableSave = () => {
        if (firstName !== user?.firstName || lastName !== user?.lastName || email !== user?.email || newPassword !== "") {
            setDisableSave(false)
        } else {
            setDisableSave(true)
        }
    }

    const getUser = () => {
        axios.get(`${baseUrl}/users/${userLocal.userId}`, {
            headers: {
                "X-Authorization": userLocal.token
            }
        })
            .then((response) => {
                const userData = response.data
                setUser(userData)
                setErrorFlag(false)
                setErrorMessage("")
                setFirstName(userData.firstName)
                setLastName(userData.lastName)
                setEmail(userData.email)
            },
            (error) => {
                setErrorFlag(true)
                setErrorMessage(error.status);
            })
    }
    const updateUser = () => {
        const data: EditUser = {};

        if (firstName.trim().length !== 0) {
            data.firstName = firstName
        }
        if (lastName.trim().length !== 0) {
            data.lastName = lastName
        }
        if (email.trim().length !== 0) {
            data.email = email
        }
        if (newPassword.trim().length !== 0) {
            data.currentPassword = currentPassword;
            data.password = newPassword;
        }

        axios.patch(`${baseUrl}/users/${userLocal.userId}`, data,{
            headers: {
                "X-Authorization": userLocal.token,
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                navigate(`/profile`)
                setErrorFlag(false)
                setErrorMessage("")
            })
            .catch((error) => {
                setErrorFlag(true)
                if (error.response.statusText.includes("email")) {
                    setErrorMessage("Please enter a valid email address")
                } else if (error.response.statusText.includes("6")) {
                    setErrorMessage("Password must be at least 6 characters")
                } else if (error.response.statusText === "Incorrect currentPassword") {
                    setErrorMessage("Please enter a valid current password")
                } else {
                    setErrorMessage(error.response.statusText)
                }
            })
    }

    return (
        <div style={{padding: 50}}>
            <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 450}}>
                <Typography variant="h3" style={{fontWeight: 'bold'}}>
                    Edit Profile
                </Typography>
                <Stack
                    direction="column"
                    spacing={1} marginTop={2} marginBottom={2}
                    justifyContent="center"
                    alignItems="center">
                    <Avatar
                        src={`${baseUrl}/users/${userLocal.userId}/image`}
                        alt={`${user?.lastName}`}
                        style={{ width: 200, height: 200, marginBottom: 8 }}
                    />
                    <TextField
                        label="First Name"
                        variant="outlined"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        fullWidth
                        margin="normal"
                        style={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        fullWidth
                        margin="normal"
                        style={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={email}
                        placeholder="abc@email.com"
                        onChange={e => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        style={{ marginBottom: 2 }}
                    />
                    <Typography variant="h6" >Update Password</Typography>
                    <TextField
                        label="Current Password"
                        variant="outlined"
                        type={currentPasswordVisible ? "text" : "password"}
                        value={currentPassword}
                        placeholder="******"
                        onChange={e => setCurrentPassword(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <Button sx={{color: "#000000"}} onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}>
                                    {currentPasswordVisible ? <VisibilityOff/> : <Visibility/>}
                                </Button>
                            )
                        }}
                        style={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Update Password"
                        variant="outlined"
                        type={newPasswordVisible ? "text" : "password"}
                        value={newPassword}
                        placeholder="******"
                        onChange={e => setNewPassword(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <Button sx={{color: "#000000"}} onClick={() => setNewPasswordVisible(!newPasswordVisible)}>
                                    {newPasswordVisible ? <VisibilityOff/> : <Visibility/>}
                                </Button>
                            )
                        }}
                        style={{ marginBottom: 2 }}
                    />
                    {errorFlag &&
                        <Alert severity="error" style={{width: '100%'}}>
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>}
                    <Button
                        variant="contained"
                        sx={{ background: "#0f574a",
                            "&:hover": {
                                background: "#1a937d",
                            }
                        }}
                        fullWidth
                        onClick={updateUser}
                        disabled={disableSave}
                    >
                        Save
                    </Button>
                    <Link style={{color: "#000000"}} to="/Profile" >
                        Back
                    </Link>
                </Stack>
            </Paper>
        </div>

    )

}

export default EditProfile;
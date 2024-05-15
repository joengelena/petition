import React, { useState } from 'react';
import axios from "axios";
import {useUserInfoStorage} from "../store";
import {Alert, AlertTitle, Avatar, Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import uploadImage from "./UploadImage";
const baseUrl = "http://localhost:4941/api/v1";


const EditProfile = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");

    const userLocal = useUserInfoStorage(state => state.user);
    const [errorFlag, setErrorFlag] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [user, setUser] = React.useState<User>()


    React.useEffect(() => {
        const getUser = () => {
            axios.get(`${baseUrl}/users/${userLocal.userId}`, {
                headers: {
                    "X-Authorization": userLocal.token
                }
            })
                .then((response) => {
                        setUser(response.data)
                        setErrorFlag(false)
                        setErrorMessage("")
                    },
                    (error) => {
                        setErrorFlag(true)
                        setErrorMessage(error.toString());
                    })
        }
        getUser()
    })

    return (
        <div style={{padding: 50}}>
            <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 500}}>
                <Typography variant="h3" style={{fontWeight: 'bold', padding: 10, marginBottom: "10px"}}>
                    Edit Profile
                </Typography>
                <Stack direction="column" spacing={2} marginTop={2} marginBottom={2} justifyContent="center" alignItems="center">
                    <Avatar
                        src={`${baseUrl}/users/${user?.userId}/image`}
                        alt={`${user?.lastName}`}
                        style={{ width: 100, height: 100 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        style={{ background:"#0f5132", marginTop: 8, marginBottom: 8 }}
                        onClick={() => uploadImage()}
                    >
                        Update Image
                    </Button>
                    <TextField
                        label="First Name"
                        variant="outlined"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        fullWidth
                        margin="normal"
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
                    />
                    {errorFlag &&
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={()=> {navigate('/profile')}} // TODO also save the value
                        style={{ marginBottom: 8 }}
                    >
                        Save
                    </Button>
                </Stack>

            </Paper>
        </div>

    )

}

export default EditProfile;
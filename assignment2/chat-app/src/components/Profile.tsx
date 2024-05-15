import React, { useState } from 'react';
import axios from "axios";
import {useUserInfoStorage} from "../store";
import {Avatar, Box, Button, Paper, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
const baseUrl = "http://localhost:4941/api/v1";


const Profile = () => {
    const navigate = useNavigate();

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
                    Profile
                </Typography>
                <Stack direction="column" spacing={2} marginTop={2} marginBottom={2} justifyContent="center" alignItems="center">
                    <Avatar
                        src={`${baseUrl}/users/${user?.userId}/image`}
                        alt={`${user?.lastName}`}
                        style={{ width: 100, height: 100 }}
                    />
                    <Typography sx={{fontWeight: "bold"}} variant="h5">
                        {user?.firstName + " " + user?.lastName}
                    </Typography>
                    <Typography variant="body1">
                        {user?.email}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={()=> {navigate('/editProfile')}}
                        style={{ marginBottom: 8 }}
                    >
                        Edit
                    </Button>
                </Stack>

            </Paper>
        </div>

    )

}

export default Profile;
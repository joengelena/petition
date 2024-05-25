import React, { useState } from 'react';
import axios from "axios";
import {useUserInfoStorage} from "../store";
import {Alert, AlertTitle, Avatar, Button, Paper, Stack, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {CloudUpload} from "@mui/icons-material";
const baseUrl = "http://localhost:4941/api/v1";


const Profile = () => {
    const navigate = useNavigate();
    const userLocal = useUserInfoStorage(state => state.user);
    const [errorFlag, setErrorFlag] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [user, setUser] = React.useState<User>()

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
            <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 400}}>
                <Typography variant="h3" style={{fontWeight: 'bold'}}>
                    Profile
                </Typography>
                <Stack direction="column" spacing={2} marginTop={2} marginBottom={2} justifyContent="center" alignItems="center">
                    <Avatar
                        src={`${baseUrl}/users/${userLocal.userId}/image`}
                        alt={`${user?.lastName}`}
                        sx={{ width: 200, height: 200 }}
                    />
                    <Typography sx={{fontWeight: "bold"}} variant="h5">
                        {user?.firstName + " " + user?.lastName}
                    </Typography>
                    <Typography variant="body1">
                        {user?.email}
                    </Typography>
                    <Stack direction="column" spacing={1} sx={{ width: 300 }}>
                        {errorFlag &&
                            <Alert severity="error">
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
                            onClick={()=> {navigate('/editProfile')}}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ background: "#0f574a",
                                "&:hover": {
                                    background: "#1a937d",
                                }
                            }}
                            fullWidth
                            onClick={()=> {navigate(`/users/${userLocal.userId}/uploadImage`)}}
                            startIcon={<CloudUpload />}
                        >
                            Update Photo
                        </Button>
                        <Link style={{color: "#000000"}} to="/Petitions" >
                            Back
                        </Link>
                    </Stack>
                </Stack>

            </Paper>
        </div>

    )

}

export default Profile;
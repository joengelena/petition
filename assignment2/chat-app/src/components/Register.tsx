import {Link, useNavigate} from "react-router-dom";
import {useUserInfoStorage} from "../store";
import React, {FormEvent} from "react";
import axios from 'axios';
import {Container, Button, TextField, Typography, Alert, AlertTitle, Paper, Box, styled, Avatar} from '@mui/material';
import {Visibility, VisibilityOff, CloudUpload} from "@mui/icons-material";
const baseUrl = "http://localhost:4941/api/v1";

const Register = () => {
    const navigate = useNavigate();
    const setTokenInStorage = useUserInfoStorage(state => state.setToken);
    const setUserIdInStorage = useUserInfoStorage(state => state.setUserId);
    const tokenLocal = useUserInfoStorage(state => state.token);
    const userIdLocal = useUserInfoStorage(state => state.userId);

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [image, setImage] = React.useState<File | null>(null);
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/gif", "image/png"];

    const removeTokenFromLocal = useUserInfoStorage(state => state.removeToken);
    const removeUserIdFromLocal = useUserInfoStorage(state => state.removeUserId);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    let token = '';
    let userId = -1;

    const register = () => {
        const config = {
            method: "post",
            url: baseUrl + "/users/register",
            headers: { "Content-Type": "application/json" },
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            },
        };

        axios(config)
            .then((response) => {
                userId = response.data.userId;
                console.log("user is successfully registered");
                if (image !== null) {
                    uploadImage()
                }
                navigate('/petitions')
                setErrorFlag(false)
                setErrorMessage("");
                login();
            },
            (error) => {
                console.error(error);
                setErrorFlag(true);
                setErrorMessage(error.response.statusText.substring(11));
            }
        );
    };

    const login = () => {
        const config = {
            method: "post",
            url: baseUrl + "/users/login",
            headers: { "Content-Type": "application/json" },
            data: {
                email: email,
                password: password,
            },
        };

        axios(config)
            .then((response) => {
                token = response.data.token
                userId = response.data.userId
                setUserIdInStorage(String(userId))
                setTokenInStorage(token)
                setErrorMessage("")
                setErrorFlag(false)
                },
                (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText);
                }
            );
    }

    const uploadImage = () => {
        const config = {
            method: 'put',
            url: `${baseUrl}/users/${userId}/image`,
            headers: {'Content-Type': image?.type, 'X-Authorization': tokenLocal}
        }
        axios(config)
            .then((response) => {
                    setErrorMessage("")
                    setErrorFlag(false)
                },
                (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error)
                }
            );

    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            const selectedFile = files[0]
            if (allowedImageTypes.includes(selectedFile.type)) {
                setImage(selectedFile)
                setErrorFlag(false)
                setErrorMessage("")
            } else {
                setImage(null);
                setErrorMessage("Image file type must be JPEG, PNG, or GIF");
            }
        }
    };

    return (
        <div style={{padding: 50}}>
            <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 500}}>
                <Typography variant="h4" style={{fontWeight: 'bold'}}>
                    Register
                </Typography>
                <Box display="flex" justifyContent="center" marginBottom={2} marginTop={2}>
                    <Avatar sx={{ width: 80, height: 80 }} src={image ? URL.createObjectURL(image) : ''} />
                </Box>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUpload/>}
                >
                    Upload file
                    <input type="file" onChange={handleFileChange} style={{display: 'none'}}/>
                </Button>
                <TextField
                    required
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    required
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    fullWidth
                    style={{ marginBottom: 8 }}
                />
                <TextField
                    required
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    placeholder="abc@email.com"
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    style={{ marginBottom: 8 }}
                />
                <TextField
                    required
                    label="Password"
                    variant="outlined"
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    placeholder="******"
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                    style={{ marginBottom: 8 }}
                    InputProps={{
                        endAdornment: (
                            <Button onClick={() => setPasswordVisible(!passwordVisible)}>
                                {passwordVisible ? <VisibilityOff/> : <Visibility/>}
                            </Button>
                        )
                    }}
                />
                {errorFlag && <Alert severity="error">{errorMessage}</Alert>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                    onClick={register}
                >
                    Register
                </Button>
                <Link to="/login" >
                    Already Registered?
                </Link>
            </Paper>
        </div>
    );
}

export default Register;
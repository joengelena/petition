import {Link, useNavigate} from "react-router-dom";
import {useUserInfoStorage} from "../store";
import React, {FormEvent} from "react";
import axios from 'axios';
import {Container, Button, TextField, Typography, Alert, AlertTitle, Paper, Box, styled, Avatar} from '@mui/material';
import {Visibility, VisibilityOff, CloudUpload} from "@mui/icons-material";
import {Simulate} from "react-dom/test-utils";
import select = Simulate.select;
const baseUrl = "http://localhost:4941/api/v1";

const Register = () => {
    const navigate = useNavigate();
    const setUserInStorage = useUserInfoStorage(state => state.setUser);
    const userLocal = useUserInfoStorage(state => state.user);

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [image, setImage] = React.useState<File | null>(null);
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/gif", "image/png"];

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [token, setToken] = React.useState('')
    const [userId, setUserId] = React.useState(-1)

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
                setUserId(response.data.userId)
                console.log("user is successfully registered");
                setErrorFlag(false)
                setErrorMessage("")
                login();
            },
            (error) => {
                console.error(error);
                setErrorFlag(true);
                setErrorMessage(error.toString());

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
                setToken(response.data.token)
                setUserId(response.data.userId)
                setUserInStorage({userId: response.data.userId, token: response.data.token})
                setErrorMessage("")
                setErrorFlag(false)
                navigate(`/users/${response.data.userId}/uploadImage`);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }

    return (
        <div style={{padding: 50}}>
            <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 500}}>
                <Typography variant="h4" style={{fontWeight: 'bold'}}>
                    Register
                </Typography>
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
                {errorFlag &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginBottom: 8 }}
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
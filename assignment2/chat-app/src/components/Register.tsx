import {useNavigate} from "react-router-dom";
import {useUserInfoStorage} from "../store";
import React from "react";
import axios from 'axios';
import { Container, Button, TextField, Typography, Alert } from '@mui/material';
const baseUrl = "http://localhost:4941/api/v1";

const Register = () => {
    const navigate = useNavigate();
    const setTokenInStorage = useUserInfoStorage(state => state.setToken);
    const setUserIdInStorage = useUserInfoStorage(state => state.setUserId);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
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
                setTokenInStorage(token);
                setErrorMessage("");
                },
                (error) => {
                    console.error(error);
                    setErrorFlag(true);
                    setErrorMessage(error.response.statusText);
                }
            );
    }
    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1">Register</Typography>
            {errorFlag && <Alert severity="error">{errorMessage}</Alert>}
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
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={register}
                fullWidth
            >
                Register
            </Button>
        </Container>
    );
}

export default Register;
import axios from "axios";
import {Alert, Button, Container, TextField, Typography} from "@mui/material";
import React from "react";
import {useUserInfoStorage} from "../store";
import {Link, useNavigate} from "react-router-dom";
import { Visibility, VisibilityOff } from '@mui/icons-material';
const baseUrl = "http://localhost:4941/api/v1";

const Login = () => {

    const navigate = useNavigate();
    const setTokenInStorage = useUserInfoStorage(state => state.setToken);
    const setUserIdInStorage = useUserInfoStorage(state => state.setUserId);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("")
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const removeTokenFromLocal = useUserInfoStorage(state => state.removeToken);
    const removeUserIdFromLocal = useUserInfoStorage(state => state.removeUserId);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    let token = '';
    let userId = -1;

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
                    navigate("/user/" + userId)
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
            <Typography variant="h4" component="h1">Log In</Typography>
            {errorFlag && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
                required
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                placeholder="abc@email.com"
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
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
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <Button onClick={() => setPasswordVisible(!passwordVisible)}>
                            {passwordVisible ? <VisibilityOff /> : <Visibility />}
                        </Button>
                    )
                }}
            />

            <Button
                variant="contained"
                color="primary"
                onClick={login}
                fullWidth
            >
                Log In
            </Button>
            <Link to="/register">
                Not Registered?
            </Link>
        </Container>
    );
}

export default Login;
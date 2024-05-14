import axios from "axios";
import {Alert, Box, Button, Container, Paper, TextField, Typography} from "@mui/material";
import React from "react";
import {useUserInfoStorage} from "../store";
import {Link, useNavigate} from "react-router-dom";
import { Visibility, VisibilityOff } from '@mui/icons-material';
const baseUrl = "http://localhost:4941/api/v1";

const Login = () => {

    const navigate = useNavigate();
    const setUserInStorage = useUserInfoStorage(state => state.setUser);

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("")
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const removeUserInStorage = useUserInfoStorage(state => state.removeUser);
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
                    setUserInStorage({userId: response.data.userId, token: response.data.token})
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
        <div style={{padding: 50}}>
            <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 500}}>
                <Typography variant="h4" style={{fontWeight: 'bold'}}>Log In</Typography>
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
                    style={{ marginBottom: 8 }}
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
                    style={{ marginBottom: 8 }}
                >
                    Log In
                </Button>
                <Link to="/register" >
                    Not Registered?
                </Link>
            </Paper>
        </div>
    );
}

export default Login;
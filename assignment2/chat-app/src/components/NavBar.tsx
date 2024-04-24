import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useUserInfoStorage} from "../store";
const baseUrl = "http://localhost:4941/api/v1";

const NavBar = () => {
    const navigate = useNavigate();
    const token = useUserInfoStorage(state => state.token);
    const userId = useUserInfoStorage(state => state.userId);
    const removeTokenFromLocal = useUserInfoStorage(state => state.removeToken);
    const removeUserIdFromLocal = useUserInfoStorage(state => state.removeUserId);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [settings, setSettings] = React.useState(["Login", "Register"]);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        if (token !== "" && userId !== "") { // when the user is logged in
            setSettings([]);
        } else { // when the user is NOT logged in
            setSettings([]);
        }
    }, [token, userId])


    const handleUserMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorElUser(null);
    };

    const handleLogoutUser = () => {
        const config = {
            method: "post",
            url: baseUrl + "/users/logout",
            headers: { "X-Authorization": token }
        };
        axios (config)
            .then(function (response) {
                setErrorFlag(false);
                setErrorMessage("");
                removeTokenFromLocal()
                removeUserIdFromLocal()
                navigate("/login");
            })
            .catch(function (error) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="medium"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My Petition Website
                </Typography>
                <Button color="inherit" component={RouterLink} to="/">Petitions</Button>
                <Button color="inherit" component={RouterLink} to="/users">Users</Button>
                <Button color="inherit" component={RouterLink} to="/register">Register</Button>
                <Button color="inherit" component={RouterLink} to="/login">LogIn</Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;

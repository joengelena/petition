import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, Button, IconButton, Drawer, List,
    ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Divider
} from '@mui/material';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useUserInfoStorage} from "../store";

import MenuIcon from '@mui/icons-material/Menu';
import RegisterIcon from '@mui/icons-material/AccountBox';
import LoginIcon from '@mui/icons-material/Login';
import SubjectIcon from '@mui/icons-material/Subject';
import UsersIcon from '@mui/icons-material/PeopleOutline';

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
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/petitions">
                        <ListItemIcon><SubjectIcon /></ListItemIcon>
                        <ListItemText primary="Petitions" />
                    </ListItemButton>
                </ListItem>
                {/*<ListItem disablePadding>*/}
                {/*    <ListItemButton component={RouterLink} to="/users">*/}
                {/*        <ListItemIcon><UsersIcon /></ListItemIcon>*/}
                {/*        <ListItemText primary="Profile" />*/}
                {/*    </ListItemButton>*/}
                {/*</ListItem>*/}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/register">
                        <ListItemIcon><RegisterIcon /></ListItemIcon>
                        <ListItemText primary="Register" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/login">
                        <ListItemIcon><LoginIcon /></ListItemIcon>
                        <ListItemText primary="Login" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    React.useEffect(() => {
        if (token !== "" && userId !== "") { // when the user is logged in
            setSettings([]);
        } else { // when the user is NOT logged in
            setSettings(["Login", "Register", "Petitions"]);
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
        <AppBar position="static" sx={{bgcolor: '#0068cf'}}>
            <Toolbar>
                <IconButton
                    size="medium"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={toggleDrawer(true)}
                >
                <MenuIcon />
                </IconButton>
                <Drawer open={open} onClose={toggleDrawer(false)}>
                    {DrawerList}
                </Drawer>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My Petition Website
                </Typography>
                <Button color="inherit" component={RouterLink} to="/petitions">Petitions</Button>
                <Button color="inherit" component={RouterLink} to="/register">Register</Button>
                <Button color="inherit" component={RouterLink} to="/login">LogIn</Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;

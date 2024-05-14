import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Divider,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle, DialogActions
} from '@mui/material';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useUserInfoStorage} from "../store";

import MenuIcon from '@mui/icons-material/Menu';
import RegisterIcon from '@mui/icons-material/AccountBox';
import LoginIcon from '@mui/icons-material/Login';
import SubjectIcon from '@mui/icons-material/Subject';
import LogoutIcon from '@mui/icons-material/Logout';
import UsersIcon from '@mui/icons-material/PeopleOutline';
import {Logout} from "@mui/icons-material";

const baseUrl = "http://localhost:4941/api/v1";

const NavBar = () => {
    const navigate = useNavigate();
    const userLocal = useUserInfoStorage(state => state.user);
    const removeUserInStorage = useUserInfoStorage(state => state.removeUser);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [settings, setSettings] = React.useState(["Login", "Register"]);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    React.useEffect(() => {
        if (userLocal.token !== "" && String(userLocal.userId) !== "") { // when the user is logged in
            setSettings(["Petitions", "Logout"]);
        } else { // when the user is NOT logged in
            setSettings(["Login", "Register", "Petitions"]);
        }
    }, [userLocal])

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorElUser(null);
    };

    const handleLogoutUser = () => {
        console.log("logging out the user...")
        const config = {
            method: "post",
            url: baseUrl + "/users/logout",
            headers: { "X-Authorization": userLocal.token }
        };
        axios (config)
            .then(function (response) {
                removeUserInStorage();
                setLogoutModalOpen(false);
                setErrorFlag(false);
                setErrorMessage("");
                navigate("/login");
            })
            .catch(function (error) {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });

    }

    const handleLogoutModalOpen = () => {
        setLogoutModalOpen(true);
    };
    const handleLogoutModalClose = () => {
        setLogoutModalOpen(false);
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
            </List>
            <Divider />
            <List>
                {settings.map((setting, index) => (
                    setting === "Register" && (
                        <ListItem key={index} disablePadding>
                            <ListItemButton component={RouterLink} to="/register">
                                <ListItemIcon><RegisterIcon /></ListItemIcon>
                                <ListItemText primary="Register" />
                            </ListItemButton>
                        </ListItem>
                    )
                ))}
                {settings.map((setting, index) => (
                    setting === "Login" && (
                        <ListItem key={index} disablePadding>
                            <ListItemButton component={RouterLink} to="/login">
                                <ListItemIcon><LoginIcon /></ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItemButton>
                        </ListItem>
                    )
                ))}
                {settings.map((setting, index) => (
                    setting === "Logout" && (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={handleLogoutModalOpen}>
                                <ListItemIcon><LogoutIcon /></ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    )
                ))}
            </List>
        </Box>
    );

    const logoutConfirmationModal = () => {
        return (
            <Dialog
                open={logoutModalOpen}
                onClose={handleLogoutModalClose}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">Log Out</DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description">
                        Are you sure you want to log out?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogoutModalClose}>Cancel</Button>
                    <Button style={{color: '#FF3333'}} onClick={handleLogoutUser} autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

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
                {settings.map((setting, index) => (
                    setting === "Petitions" && (
                        <Button key={index} color="inherit" component={RouterLink} to="/petitions">
                            Petitions
                        </Button>
                    )
                ))}
                {settings.map((setting, index) => (
                    setting === "Register" && (
                        <Button key={index} color="inherit" component={RouterLink} to="/register">
                            Register
                        </Button>
                    )
                ))}
                {settings.map((setting, index) => (
                    setting === "Login" && (
                        <Button key={index} color="inherit" component={RouterLink} to="/login">
                            Login
                        </Button>
                    )
                ))}
                {settings.map((setting, index) => (
                    setting === "Logout" && (
                        <Button key={index} color="inherit" onClick={handleLogoutModalOpen}>
                            Logout
                        </Button>
                    )
                ))}
                {logoutConfirmationModal()}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;

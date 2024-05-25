import React, { useState } from 'react';
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
import ProfileIcon from '@mui/icons-material/AccountCircle';
import MyDocumentIcon from '@mui/icons-material/HistoryEdu';

const baseUrl = "http://localhost:4941/api/v1";

const NavBar = () => {
    const navigate = useNavigate();
    const userLocal = useUserInfoStorage(state => state.user);
    const removeUserInStorage = useUserInfoStorage(state => state.removeUser);

    const [settings, setSettings] = React.useState(["Login", "Register"]);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    React.useEffect(() => {
        if (userLocal.token !== "" && String(userLocal.userId) !== "") { // when the user is logged in
            setSettings(["Petitions", "Logout", "Profile", "MyPetitions"]);
        } else { // when the user is NOT logged in
            setSettings(["Login", "Register", "Petitions"]);
        }
    }, [userLocal])

    const handleLogoutUser = () => {
        const config = {
            method: "post",
            url: baseUrl + "/users/logout",
            headers: { "X-Authorization": userLocal.token }
        };
        axios (config)
            .then(function () {
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
                <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/myPetitions">
                    <ListItemIcon><MyDocumentIcon /></ListItemIcon>
                    <ListItemText primary="My Petitions" />
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
                {settings.map((setting, index) => (
                    setting === "Profile" && (
                        <ListItem key={index} disablePadding>
                            <ListItemButton component={RouterLink} to="/profile">
                                <ListItemIcon><ProfileIcon /></ListItemIcon>
                                <ListItemText primary="Profile" />
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
                    <Button style={{color: '#0f574a'}} onClick={handleLogoutModalClose}>Cancel</Button>
                    <Button style={{color: '#C70000'}} onClick={handleLogoutUser} autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <AppBar position="static" sx={{backgroundColor: "#0f574a"}}>
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
                    Petition Website
                </Typography>
                {settings.map((setting, index) => (
                    setting === "MyPetitions" && (
                        <Button
                            key={index}
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    color: '#20af95'
                                },
                            }}
                            component={RouterLink} to="/myPetitions">
                            My Petitions
                        </Button>
                    )
                ))}
                {settings.map((setting, index) => (
                    setting === "Petitions" && (
                        <Button
                            key={index}
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    color: '#1a937d'
                                },
                            }}
                            component={RouterLink} to="/petitions"
                        >
                            Petitions
                        </Button>
                    )
                ))}
                {settings.map((setting, index) => (
                    setting === "Register" && (
                        <Button
                            key={index}
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    color: '#1a937d'
                                },
                            }}
                            component={RouterLink} to="/register">
                            Register
                        </Button>
                    )
                ))}
                {settings.map((setting, index) => (
                    setting === "Login" && (
                        <Button
                            key={index}
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    color: '#1a937d'
                                },
                            }}
                            component={RouterLink} to="/login">
                            Login
                        </Button>
                    )
                ))}
                {settings.map((setting, index) => (
                    setting === "Profile" && (
                        <Button
                            key={index}
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    color: '#20af95'
                                },
                            }}
                            component={RouterLink} to="/profile">
                            Profile
                        </Button>
                    )
                ))}
                {settings.map((setting, index) => (
                    setting === "Logout" && (
                        <Button
                            key={index}
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    color: '#20af95'
                                },
                            }}
                            onClick={handleLogoutModalOpen}>
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

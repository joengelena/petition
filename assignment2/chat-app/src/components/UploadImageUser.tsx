import React, {useEffect, useState} from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useUserInfoStorage } from "../store";
import {nlNL} from "@mui/material/locale";
const baseUrl = "http://localhost:4941/api/v1";

const UploadImageUser = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState<File | null>(null);
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/gif", "image/png"];
    const [errorFlag, setErrorFlag] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [token, setToken] = useState('')
    const [userId, setUserId] = useState(-1)
    const userLocal = useUserInfoStorage(state => state.user)
    const [initialImageUrl, setInitialImageUrl] = useState('');
    const [dbImage, setDbImage] = React.useState<boolean>(false);
    const [newImgSelected, setNewImgSelected] = React.useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                    navigate('/')
                })
    }, [userLocal])

    React.useEffect(() => {
        axios.get(`${baseUrl}/users/${userLocal.userId}/image`)
            .then((response) => {
                setDbImage(true)
                setErrorFlag(false)
                setErrorMessage("")
            })
            .catch((error) => {
                console.log(error);
        })
    }, []);

    const uploadImage = () => {
        axios.put(`${baseUrl}/users/${userLocal.userId}/image`, image, {
            headers: {
                "X-Authorization": userLocal.token,
                "Content-Type": image?.type
            }
        })
            .then((response) => {
                    console.log("upload image")
                    navigate('/petitions')
                    setErrorMessage("")
                    setErrorFlag(false)
                    setImage(response.data)
                },
                (error) => {
                    console.log(error)
                    setErrorFlag(true)
                    setErrorMessage(error.toString());
                }
            )
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            const selectedFile = files[0]
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (selectedFile.size <= maxSize) {
                if (allowedImageTypes.includes(selectedFile.type)) {
                    setNewImgSelected(true);
                    setImage(selectedFile);
                    setErrorFlag(false);
                    setErrorMessage("");
                } else {
                    setImage(null);
                    setErrorFlag(true);
                    setErrorMessage("Image file type must be JPEG, PNG, or GIF");
                }
            } else {
                setImage(null);
                setErrorFlag(true);
                setErrorMessage("Image file size must be less than or equal to 5MB");
            }
        }
    }

    const deleteImage = () => {
        // TODO when there is a local image, and no db image, when i delete the image, i get an error "pleas upload..."
        setDeleteModalOpen(false)
        setImage(null)
        console.log(dbImage)
        if (dbImage) {
            console.log("in the delete req")
            axios.delete(`${baseUrl}/users/${userLocal.userId}/image`, {
                headers: {
                    "X-Authorization": userLocal.token
                }
            })
                .then((response) => {
                        console.log("delete image")
                        setDbImage(false)
                        setErrorMessage("")
                        setErrorFlag(false)
                    },
                    (error) => {
                        console.log(error)
                        setErrorFlag(true)
                        if (error.response.status === 404) {
                            setErrorMessage("Please upload a file to delete")
                        } else {
                            setErrorMessage(error.response.statusText);
                        }
                    }
                )
        }
    }

    const imgSrc = () => {
        if (!newImgSelected && dbImage) {
            return `${baseUrl}/users/${userLocal.userId}/image`
        }
        if (image) {
            return URL.createObjectURL(image)
        }
        return ''
    }

    const handleDeleteModalOpen = () => {
        setDeleteModalOpen(true);
    };
    const handleDeleteModalClose= () => {
        setDeleteModalOpen(false);
    };

    const deleteConfirmationModal = () => {
        return (
            <Dialog
                open={deleteModalOpen}
                onClose={handleDeleteModalClose}
            >
                <DialogTitle>Delete Image</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the image?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteModalClose}>Cancel</Button>
                    <Button style={{color: '#FF3333'}} onClick={deleteImage} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <div style={{ padding: 50 }}>
            <Paper elevation={2} style={{ padding: 20, margin: 'auto', maxWidth: 400 }}>
                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    Image Upload
                </Typography>
                <Box display="flex" justifyContent="center" marginBottom={2} marginTop={2}>
                    <Avatar sx={{ width: 150, height: 150 }} src={imgSrc()} />
                </Box>
                <Button
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                    style ={{ width: 150, marginBottom: 10}}
                    startIcon={<CloudUpload />}
                >
                    Upload file
                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </Button>
                {errorFlag &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    style={{ background: image === null ? "#bbbbbb": "#0f5132", marginTop: 8, marginBottom: 8}}
                    onClick={() => uploadImage()}
                    disabled={image === null}
                >
                    Update
                </Button>
                {(dbImage || image) &&
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        style={{ background: "#d90f0f", marginBottom: 8 }}
                        onClick={(handleDeleteModalOpen)}
                    >
                        Delete
                    </Button>
                }
                {deleteConfirmationModal()}
                <Link to="/Petitions" >
                    Exit
                </Link>
            </Paper>
        </div>
    );
}

export default UploadImageUser;

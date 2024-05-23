import React, {useState} from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Avatar,
    Button,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Paper, Stack,
    Typography
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useUserInfoStorage } from "../store";
const baseUrl = "http://localhost:4941/api/v1";

const UploadImageUser = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState<File | null>(null);
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/gif", "image/png"];
    const [errorFlag, setErrorFlag] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const userLocal = useUserInfoStorage(state => state.user)
    const [dbImage, setDbImage] = React.useState<boolean>(false);
    const [newImgSelected, setNewImgSelected] = React.useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    React.useEffect(() => {
        axios.get(`${baseUrl}/users/${userLocal.userId}`, {
            headers: {
                    "X-Authorization": userLocal.token }
            })
            .then(() => {
                    setErrorFlag(false)
                    setErrorMessage("")
                },
                (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                    navigate('/')
                })
    }, [userLocal, navigate])

    React.useEffect(() => {
        axios.get(`${baseUrl}/users/${userLocal.userId}/image`)
            .then(() => {
                setDbImage(true)
                setErrorFlag(false)
                setErrorMessage("")
            })
            .catch((error) => {
                console.log(error);
        })
    }, [userLocal]);

    const uploadImage = () => {
        axios.put(`${baseUrl}/users/${userLocal.userId}/image`, image, {
            headers: {
                "X-Authorization": userLocal.token,
                "Content-Type": image?.type
            }
        })
            .then((response) => {
                    navigate('/petitions')
                    setErrorMessage("")
                    setErrorFlag(false)
                    setImage(response.data)
                },
                (error) => {
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
        setDeleteModalOpen(false)
        setImage(null)
        if (dbImage) {
            axios.delete(`${baseUrl}/users/${userLocal.userId}/image`, {
                headers: {
                    "X-Authorization": userLocal.token
                }
            })
                .then(() => {
                        setDbImage(false)
                        setErrorMessage("")
                        setErrorFlag(false)
                    },
                    (error) => {
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
                    <Button style={{color: '#C70000'}} onClick={deleteImage} autoFocus>
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
                <Stack direction="column" spacing={2} marginTop={2} marginBottom={2} justifyContent="center" alignItems="center">
                    <Avatar sx={{ width: 150, height: 150 }} src={imgSrc()} />
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUpload />}
                    >
                        Upload file
                        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                    </Button>

                    <Stack direction="column" spacing={1} sx={{ width: 320 }}>
                        {errorFlag &&
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {errorMessage}
                            </Alert>}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                background: image === null ? "#bbbbbb": "#1c7c31",
                                "&:hover": {
                                    background: "#196728"
                                }}}
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
                                sx={{
                                    background: "#C70000",
                                    "&:hover": {
                                        background: "#ab0f0f"
                                    }}}
                                onClick={(handleDeleteModalOpen)}
                            >
                                Delete
                            </Button>
                        }
                        {deleteConfirmationModal()}
                        <Link to="/Petitions" >
                            Exit
                        </Link>
                    </Stack>
                </Stack>
            </Paper>
        </div>
    );
}

export default UploadImageUser;

import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
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
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
const baseUrl = "http://localhost:4941/api/v1";

const UploadImagePetition = () => {
    const {petitionId} = useParams();
    const navigate = useNavigate();

    const [image, setImage] = useState<File | null>(null);
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/gif", "image/png"];
    const [errorFlag, setErrorFlag] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [petition, setPetition] = React.useState<Petition>();

    const userLocal = useUserInfoStorage(state => state.user)
    const [initialImageUrl, setInitialImageUrl] = useState('');
    const [dbImage, setDbImage] = React.useState<boolean>(false);

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
                    setErrorFlag(true)
                    setErrorMessage(error.toString());
                    navigate('/')
                })
    }, [userLocal])

    React.useEffect(() => {
        const getPetition = () => {
            axios.get(baseUrl + `/petitions/${petitionId}`)
                .then((response) => {
                        setErrorFlag(false)
                        setErrorMessage("")
                        setPetition(response.data)
                    },
                    (error) => {
                        setErrorFlag(true)
                        setErrorMessage(error.toString());
                    })
        }
        getPetition()
    }, [])

    React.useEffect(() => {
        axios.get(`${baseUrl}/petitions/${Number(petitionId)}/image`)
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
        axios.put(`${baseUrl}/petitions/${petition?.petitionId}/image`, image, {
            headers: {
                "X-Authorization": userLocal.token,
                "Content-Type": image?.type
            }
        })
            .then((response) => {
                    console.log("upload image")
                    navigate(`/petitions/${petition?.petitionId}`)
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
                    setDbImage(false);
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

    const imgSrc = () => {
        if (dbImage) {
            return `${baseUrl}/petitions/${petition?.petitionId}/image`
        }
        if (image) {
            return URL.createObjectURL(image)
        }
        return ''
    }

    return (
        <div style={{ padding: 50 }}>
            <Paper elevation={2} style={{ padding: 20, margin: 'auto', maxWidth: 450 }}>
                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    Image Upload
                </Typography>
                <Box display="flex" justifyContent="center" marginBottom={2} marginTop={2}>
                    <Avatar
                        src={imgSrc()}
                        style={{width: 400, height: 250, borderRadius: 3}}
                    >
                        <ImageNotSupportedIcon/>
                    </Avatar>
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
                    style={{ background: image === null ? "#bbbbbb": "#0f5132", marginTop: 10, marginBottom: 8}}
                    onClick={() => uploadImage()}
                    disabled={image === null}
                >
                    Update
                </Button>
                <Link to="/Petitions" >
                    Skip
                </Link>
            </Paper>
        </div>
    );
}

export default UploadImagePetition;

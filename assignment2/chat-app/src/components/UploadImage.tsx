import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertTitle, Avatar, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useUserInfoStorage } from "../store";
const baseUrl = "http://localhost:4941/api/v1";

const UploadImage = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState<File | null>(null);
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/gif", "image/png"];
    const [errorFlag, setErrorFlag] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [token, setToken] = useState('')
    const [userId, setUserId] = useState(-1)
    const userLocal = useUserInfoStorage(state => state.user)

    const uploadImage = () => {
        console.log(image)

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

    return (
        <div style={{ padding: 50 }}>
            <Paper elevation={2} style={{ padding: 20, margin: 'auto', maxWidth: 500 }}>
                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    Image Upload
                </Typography>
                <Box display="flex" justifyContent="center" marginBottom={2} marginTop={2}>
                    <Avatar sx={{ width: 100, height: 100 }} src={image ? URL.createObjectURL(image) : ''} />
                </Box>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
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
                    style={{ background:"#0f5132", marginTop: 8, marginBottom: 8 }}
                    onClick={() => uploadImage()}
                >
                    Update
                </Button>
                {/*have skip button so user can not upload an image*/}
                <Link to="/Petitions" >
                    Skip
                </Link>
            </Paper>
        </div>
    );
}

export default UploadImage;

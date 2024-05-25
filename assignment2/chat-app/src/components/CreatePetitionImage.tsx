import React, {useState} from 'react';
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Avatar,
    Button,
    Paper, Stack,
    Typography
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useUserInfoStorage } from "../store";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
const baseUrl = "http://localhost:4941/api/v1";

interface UploadImageProps {
    image: File | null;
    onImageUpload: (file: File | null) => void;
    errorMessage: string;
    errorFlag: boolean;
    onErrorMessageChange: (errorMessage: string) => void;
    onErrorFlagChange: (errorFlag: boolean) => void;

}

const CreatePetitionImage: React.FC<UploadImageProps> = ({ onImageUpload, image, errorMessage, errorFlag, onErrorMessageChange, onErrorFlagChange }) => {
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/gif", "image/png"];
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            const selectedFile = files[0]
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (selectedFile.size <= maxSize) {
                if (allowedImageTypes.includes(selectedFile.type)) {
                    onImageUpload(selectedFile);
                    onErrorFlagChange(false);
                    onErrorMessageChange("");
                } else {
                    onImageUpload(null);
                    onErrorFlagChange(true);
                    onErrorMessageChange("Image file type must be JPEG, PNG, or GIF");
                }
            } else {
                onImageUpload(null);
                onErrorFlagChange(true);
                onErrorMessageChange("Image file size must be less than or equal to 5MB");
            }
        }
    }

    const imgSrc = () => {
        if (image) {
            return URL.createObjectURL(image)
        }
        return ''
    }

    if (errorFlag) {
        return (
            <div style={{padding: 50}}>
                <Paper elevation={3} style={{padding: 20, margin: 'auto', maxWidth: 1200}}>
                    <Typography variant="h3" style={{ color: '#d90f0f', fontWeight: 'bold'}} >
                        404 {errorMessage}
                    </Typography>
                </Paper>
            </div>
        )
    } else {
        return (
            <div>
                <Stack direction="column" spacing={2} marginTop={2} marginBottom={2} justifyContent="center"
                       alignItems="center">
                    <Avatar
                        src={imgSrc()}
                        style={{width: 400, height: 250, borderRadius: 3}}
                    >
                        <ImageNotSupportedIcon/>
                    </Avatar>
                    <Button
                        component="label"
                        variant="outlined"
                        sx={{
                            color: '#1c7c31',
                            borderColor: "#1c7c31",
                            "&:hover": {
                                background: "#d2e1d2",
                                borderColor: '#d2e1d2'
                            }
                        }}
                        style={{width: 400}}
                        startIcon={<CloudUpload/>}
                    >
                        Upload file
                        <input type="file" onChange={handleFileChange} style={{display: 'none'}}/>
                    </Button>
                </Stack>
            </div>
        );
    }
}

export default CreatePetitionImage;

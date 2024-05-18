import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useUserInfoStorage} from "../store";
import React, {ChangeEvent} from "react";
import {
    Avatar, Pagination,
    Paper, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
const baseUrl = "http://localhost:4941/api/v1";

const MyPetitions = () => {
    const navigate = useNavigate();
    const userLocal = useUserInfoStorage(state => state.user)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [myPetitions, setMyPetitions] = React.useState<Array<Petition>>([]);
    const [categories, setCategories] = React.useState<Array<Category>>([]);

    const [concatReady, setConcatReady] = React.useState(false)
    const [myPetitionOwner, setMyPetitionOwner] = React.useState<Array<Petition>>([]);
    const [myPetitionSupporter, setMyPetitionSupporter] = React.useState<Array<Petition>>([]);

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
        if (userLocal.userId) {
            getMyPetitions();
        }
    }, [userLocal.userId]);

    React.useEffect(() => {
        const getCategories = () => {
            axios.get(baseUrl + `/petitions/categories`)
                .then((response) => {
                        setErrorFlag(false);
                        setErrorMessage("");
                        setCategories(response.data)
                    },
                    (error) => {
                        setErrorFlag(true);
                        setErrorMessage(error.toString());
                    }
                );
        };
        getCategories()
    }, [])


    const getMyPetitions = async () => {

        try {
            const [ownerResponse, supporterResponse] = await Promise.all([
                axios.get(`${baseUrl}/petitions?count=10&ownerId=${userLocal.userId}`),
                axios.get(`${baseUrl}/petitions?count=10&supporterId=${userLocal.userId}`)
            ]);

            const combinedPetitions = [...ownerResponse.data.petitions, ...supporterResponse.data.petitions];

            const uniquePetitions = Array.from(new Set(combinedPetitions.map(petition => petition.petitionId)))
                .map(id => combinedPetitions.find(petition => petition.petitionId === id));

            setMyPetitions(uniquePetitions);
            setErrorFlag(false)
        } catch (error) {
            setErrorFlag(true);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unknown error occurred');
            }
        }
    };

    const myPetition_rows = () => {
        if (myPetitions.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={7} align="center">
                        <Typography variant="body1">No petitions found.</Typography>
                    </TableCell>
                </TableRow>
            );
        }

        return myPetitions.map((petition: Petition) =>
            <TableRow
                hover
                tabIndex={-1}
                key={petition.petitionId}
                onClick={() => navigate(`/petitions/${petition.petitionId}`)}
                sx={{
                    '&:hover': {textDecoration: 'none'}
                }}
            >
                <TableCell>
                    <Avatar
                        src={`${baseUrl}/petitions/${petition.petitionId}/image`}
                        style={{ width: 100, height: 100, borderRadius: 0 }}
                    >
                        <ImageNotSupportedIcon/>
                    </Avatar>
                </TableCell>
                <TableCell>
                    <Typography variant="body1">
                        {petition.title}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body1">
                        {petition.creationDate}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body1">
                        {categories.find(category => category.categoryId === petition.categoryId)?.name || "Unknown"}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body1">
                        {petition.ownerFirstName + " " + petition.ownerLastName}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Avatar
                        src={`${baseUrl}/users/${petition.ownerId}/image`}
                        alt={`${petition.ownerLastName}`}
                        style={{ width: 80, height: 80 }}
                    />
                </TableCell>
                <TableCell>
                    {petition.supportingCost}
                </TableCell>
            </TableRow>
        )
    }

    return (
        <div style={{padding: 50}}>
            <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 1200}}>
                <Typography variant="h3" style={{ fontWeight: 'bold', padding: 10 }}>
                    My Petitions
                </Typography>
                <TableContainer component={Paper} style={{marginTop: 20}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Creation Date</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Owner Name</TableCell>
                                <TableCell>Owner Image</TableCell>
                                <TableCell>Supporting Cost</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {myPetition_rows()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    )
}
export default MyPetitions;
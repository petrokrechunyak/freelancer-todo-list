import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {CircularProgress, FormControl, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";

const AddOrderComponent = () => {
    const [order, setOrder] = useState([]);
    const [user, setUser] = useState([]);
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [price, setPrice] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [categories, setCategories] = useState();
    const [userID, setUserID] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const navigate = useNavigate();

    const backToHomePage = () => navigate('../', {replace: true});

    const sendData = () => {
        axios.post(`http://localhost:8090/api/orders`, {
            title: title,
            description: description,
            price: price,
            startDate: startDate,
            endDate: endDate,
            categories: categories,
            user: {"id": userID},
            order
        }).then((response) => {
            response.data();
        })
        backToHomePage();
    }

    const getUserList = async () => {
        setLoading(true)
        try {
            const user = await axios.get(`http://localhost:8090/api/user/`);
            setUser(user.data)
        } catch (e) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getUserList()
    }, []);
    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 30,
                }}
            >
                <CircularProgress/>
            </div>
        );
    }
    if (error) {
        return (
            <>
                <h5>{error}</h5>
            </>
        );
    }
    return (
        <Box>
            <Typography sx={{
                display: "flex", justifyContent: "center", alignContent: "center",
                fontSize: 30, margin: "0 auto", mt: 5, color: "green"
            }}>
                Create order
            </Typography>
            <Box component="form"
                 sx={{
                     '& .MuiTextField-root': {m: 1, width: 550},
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "center",
                     flexDirection: "column",
                     mt: 5
                 }}
                 noValidate
                 autoComplete="on">
                <FormControl>
                    <TextField
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        id="outlined-required"
                        label="Title"
                        placeholder="Title"
                        helperText="Title must be min 1 and max 100 symbols"
                    />
                    <TextField
                        required
                        onChange={(e) => setDescription(e.target.value)}
                        id="outlined-multiline-flexible"
                        multiline
                        label="Description"
                        helperText="Description must be min 10 symbols"
                        placeholder="Description"
                    />
                    <TextField
                        required
                        onChange={(e) => setPrice(e.target.value)}
                        id="outlined-number"
                        label="Price"
                        type="number"
                        placeholder="Price"
                    />
                    <TextField
                        onChange={(e) => setStartDate(e.target.value)}
                        id="outlined-required"
                        label="Start date"
                        placeholder="Start date"
                    />
                    <TextField
                        onChange={(e) => setEndDate(e.target.value)}
                        id="outlined-required"
                        label="End date"
                        placeholder="End date"
                    />
                    <Box>
                        <Select sx={{mt: 1, ml: 1, mb: 1, width: 550}} labelId="categoriesID" id="categories"
                                onChange={(e) => setCategories(e.target.value)}>
                            <MenuItem value={`PROGRAMMING`}>PROGRAMMING</MenuItem>
                            <MenuItem value={`TRANSLATE`}>TRANSLATE</MenuItem>
                            <MenuItem value={`DESIGN`}>DESIGN</MenuItem>
                            <MenuItem value={`RECRUITING`}>RECRUITING</MenuItem>
                            <MenuItem value={`COPYRIGHT`}>COPYRIGHT</MenuItem>
                            <MenuItem value={`MARKETING`}>MARKETING</MenuItem>
                        </Select>
                    </Box>
                    <FormControl>
                        <Select sx={{mt: 1, ml: 1, mb: 1, width: 550}} labelId="userID" id="user"
                                onChange={(e) => setUserID(e.target.value)}>
                            {user.map(el => {
                                return (
                                    <MenuItem key={el.id} value={`${el.id}`}>{el.firstName} {el.lastName}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </FormControl>
                <Button variant="contained" endIcon={<SendIcon/>} sx={{
                    mt: 5, backgroundColor: "green",
                    ":hover": {backgroundColor: "white", color: "green"}
                }} onClick={sendData} type="submit">
                    Send</Button>
                <Button variant="contained" endIcon={<SettingsBackupRestoreOutlinedIcon/>} sx={{
                    mt: 1, backgroundColor: "green",
                    ":hover": {backgroundColor: "white", color: "green"}
                }} onClick={backToHomePage}>
                    Back to home page</Button>
            </Box>
        </Box>
    )
};

export default AddOrderComponent;
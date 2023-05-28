import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {CircularProgress, FormControl, Select, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";

const AddUserComponent = () => {
    const [user, setUser] = useState([]);
    const [order, setOrder] = useState([]);
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [role, setRole] = useState();
    const [orderID, setOrderID] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState()
    const navigate = useNavigate();

    const backToHomePage = () => navigate('../users/', {replace: true});

    const sendData = () => {
        axios.post(`http://localhost:8090/api/user`, {
            firstName,
            lastName,
            role,
            order: {"id": orderID},
            user
        }).then((response) => {
            response.data();
        })
        backToHomePage();
    }

    const getOrderList = async () => {
        setLoading(true)
        try {
            const user = await axios.get(`http://localhost:8090/api/user/`);
            setOrder(user.data)
        } catch (e) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getOrderList()
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
                Create user
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
                        onChange={(e) => setFirstName(e.target.value)}
                        id="outlined-required"
                        label="First name"
                        helperText='First name must be min 2 and max 100 symbols'
                        placeholder="First name"
                    />
                    <TextField
                        required
                        onChange={(e) => setLastName(e.target.value)}
                        id="outlined-multiline-flexible"
                        multiline
                        label="Last name"
                        helperText='Last name must be min 2 and max 100 symbols'
                        placeholder="Last name"
                    />
                    <Box>
                        <Select sx={{mt: 1, ml: 1, mb: 1, width: 550}} labelId="categoriesID" id="categories"
                                onChange={(e) => setRole(e.target.value)}>
                            <MenuItem value={`EMPLOYEE`}>EMPLOYEE</MenuItem>
                            <MenuItem value={`CUSTOMER`}>CUSTOMER</MenuItem>
                        </Select>
                    </Box>
                </FormControl>
                <Button variant="contained" endIcon={<SendIcon/>} sx={{
                    mt: 5, backgroundColor: "green",
                    ":hover": {backgroundColor: "white", color: "green"}
                }} onClick={sendData} type="submit">Send</Button>
                <Button variant="contained" endIcon={<SettingsBackupRestoreOutlinedIcon/>} sx={{
                    mt: 1, backgroundColor: "green",
                    ":hover": {backgroundColor: "white", color: "green"}
                }} onClick={backToHomePage}>
                    Back to home page</Button>
            </Box>
        </Box>
    )
};

export default AddUserComponent;
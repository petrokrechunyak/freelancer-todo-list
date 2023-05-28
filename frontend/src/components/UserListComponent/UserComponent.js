import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {
    Avatar,
    Card,
    CardActions,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Select,
    TextField
} from "@mui/material";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

const UserComponent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [user, setUser] = useState([]);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userUpdateFirstName, setUserUpdateFirstName] = useState('');
    const [userUpdateLastName, setUserUpdateLastName] = useState('');
    const [userUpdateRole, setUserUpdateRole] = useState('');

    const handleUpdate = () => {
        setOpenUpdate(!openUpdate);
    }

    const getData = async () => {
        setLoading(true)
        try {
            const user = await axios.get(`http://localhost:8090/api/user/${params.id}`);
            setUser(user.data)
            setUserUpdateFirstName(user.data.firstName);
            setUserUpdateLastName(user.data.lastName);
            setUserUpdateRole(user.data.role);
        } catch (e) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [params]);

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

    const deleteUser = (id) => axios.delete(`http://localhost:8090/api/user/${id}`)
        .then(() => navigate('../users', {replace: true}))

    const updateUser = (id) => {
        axios.put(`http://localhost:8090/api/user/${id}`, {
            "id": id, "firstName": userUpdateFirstName, "lastName": userUpdateLastName,
            "role": userUpdateRole, "order": {"id": user.order.id}
        }).then((response) => {
            const userUpdate = response.data;
            window.location.reload();
        })
    }

    return (
        <>
            <Box sx={{mt: 5}}>
                <Box>
                    <Box sx={{justifyContent: 'center', display: 'flex'}}>
                        <Avatar
                            src="https://source.unsplash.com/random"
                            sx={{width: 200, height: 200}}
                        />
                    </Box>
                    <Box sx={{
                        justifyContent: 'center',
                        display: 'flex',
                        p: 3,
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h4">
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="h6" sx={{p: 2}}>
                            {user.role}
                        </Typography>
                        <Box sx={{
                            mt: 2,
                            justifyContent: 'start',
                            color: 'white',
                            flexDirection: 'row',
                            display: 'flex'
                        }}>
                            <Button variant="outlined" onClick={handleUpdate}
                                    sx={{
                                        borderColor: 'green', color: 'white', backgroundColor: 'green',
                                        ":hover": {
                                            borderColor: "green",
                                            color: 'green'
                                        }
                                    }}>Edit</Button>
                            <Button onClick={() => deleteUser(params.id)} variant="outlined" sx={{
                                borderColor: '332c63',
                                left: 10,
                                color: 'white',
                                backgroundColor: '#332c63',
                                ":hover": {
                                    borderColor: "#332c63",
                                    color: '#332c63'
                                }
                            }}>Delete</Button>
                        </Box>
                        <Box sx={{
                            mt: 10,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h5">My orders</Typography>
                            <Typography variant="h6" sx={{p: 2}}>Count of orders: {user.order.length}</Typography>
                            <Button variant="outlined" href={'/add_order'} sx={{
                                height: 40,
                                backgroundColor: 'green',
                                color: "white",
                                fontWeight: 'bold',
                                ":hover": {
                                    color: "green",
                                    borderColor: "green"
                                }
                            }}>Create order</Button>
                        </Box>
                    </Box>
                    <Box sx={{p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
                        {user.order.map(el => {
                            return (
                                <Box sx={{
                                    p: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: "0 0 28%"
                                }}>
                                    <Box sx={{display: 'flex',}}>
                                        <Card sx={{backgroundColor: "#FCF8EC", width: 250}}>
                                            <CardContent>
                                                <Typography variant="h5" component="div" sx={{
                                                    mb: 1.5,
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 1
                                                }}>
                                                    {el.title}
                                                </Typography>
                                                <Typography sx={{
                                                    mb: 1.5,
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 1,
                                                }}
                                                            color="text.secondary"
                                                >
                                                    {el.description}
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    Price: {el.price} UAH
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" href={`/orders/${el.id}`} variant="outlined" sx={{
                                                    backgroundColor: 'green', color: 'white', fontSize: 10,
                                                    ":hover": {color: 'green', borderColor: 'green'}
                                                }}>Read more</Button>
                                            </CardActions>
                                        </Card>
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                    <Box>
                        <FormControl>
                            <Dialog open={openUpdate} onClose={handleUpdate}>
                                <DialogTitle>Edit user</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        margin="dense"
                                        id="firstName"
                                        label="First name"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        value={userUpdateFirstName}
                                        helperText='First name must be min 2 and max 100 symbols'
                                        onChange={(e) => setUserUpdateFirstName(e.target.value)}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="lastName"
                                        label="Last name"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        value={userUpdateLastName}
                                        helperText='Last name must be min 2 and max 100 symbols'
                                        onChange={(e) => setUserUpdateLastName(e.target.value)}
                                    />
                                    <Select sx={{mt: 1}} labelId="categoriesID" id="role" label="Role"
                                            value={userUpdateRole}
                                            onChange={(e) => setUserUpdateRole(e.target.value)}>
                                        <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                                        <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
                                    </Select>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => updateUser(params.id)} variant="contained"
                                            endIcon={<SendIcon/>}
                                            sx={{
                                                backgroundColor: "green",
                                                ":hover": {backgroundColor: "green"}
                                            }}>Send</Button>
                                    <Button onClick={handleUpdate} variant="contained" endIcon={<CloseIcon/>}
                                            sx={{
                                                backgroundColor: "red",
                                                ":hover": {backgroundColor: "red"}
                                            }}>Back</Button>
                                </DialogActions>
                            </Dialog>
                        </FormControl>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default UserComponent;
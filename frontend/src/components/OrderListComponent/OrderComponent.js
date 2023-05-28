import React, {useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import Button from "@mui/material/Button";
import {
    Card,
    CardHeader,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Select,
    TextareaAutosize,
    TextField
} from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";

const OrderComponent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [order, setOrder] = useState([]);
    const [orderTitle, setOrderTitle] = useState();
    const [orderDescription, setOrderDescription] = useState();
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [orderUpdateTitle, setOrderUpdateTitle] = useState('');
    const [orderUpdateDescription, setOrderUpdateDescription] = useState('');
    const [orderUpdatePrice, setOrderUpdatePrice] = useState('');
    const [orderUpdateStartDate, setOrderUpdateStartDate] = useState();
    const [orderUpdateEndDate, setOrderUpdateEndDate] = useState();
    const [orderUpdateCategories, setOrderUpdateCategories] = useState('');

    const backToHomePage = () => navigate('../', {replace: true});

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdate = () => {
        setOpenUpdate(!openUpdate);
    }

    const getData = async () => {
        setLoading(true)
        try {
            const order = await axios.get(`http://localhost:8090/api/orders/${params.id}`);
            setOrder(order.data)
            setOrderUpdateTitle(order.data.title);
            setOrderUpdateDescription(order.data.description);
            setOrderUpdatePrice(order.data.price);
            setOrderUpdateStartDate(order.data.startDate);
            setOrderUpdateEndDate(order.data.endDate);
            setOrderUpdateCategories(order.data.categories);
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
    const sendData = () => {
        axios.post(`http://localhost:8090/api/notes`, {
            title: orderTitle,
            description: orderDescription,
            order
        }).then((response) => {
            response.data();
        })
        // window.location.reload();
        setOpen(false);
    }

    const deleteNote = (id) =>
        axios.delete(`http://localhost:8090/api/notes/${id}`)
            .then(() => window.location.reload());

    const deleteOrder = (id) => axios.delete(`http://localhost:8090/api/orders/${id}`)
        .then(() => navigate('../', {replace: true}))

    const updateOrder = (id) => {
        axios.put(`http://localhost:8090/api/orders/${id}`, {
            "id": id, "title": orderUpdateTitle, "description": orderUpdateDescription,
            "price": orderUpdatePrice, "startDate": orderUpdateStartDate,
            "endDate": orderUpdateEndDate, "categories": orderUpdateCategories, "user": {"id": order.user.id}
        }).then((response) => {
            const orderUpdate = response.data;
            window.location.reload();
        })
    }

    const CommentView = () => {
        if (order) {
            return (
                order.note.map(el => {
                    return (
                        <Box key={el.id} sx={{fontFamily: 'Crimson Text'}}>
                            <Card sx={{maxWidth: 825, margin: '0 auto', mb: 3}}>
                                <CardHeader title={el.title}/>
                                <CardContent>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between',}}>
                                        <Typography variant="body1" color="text.secondary"
                                                    sx={{fontFamily: 'Crimson Text', fontWeight: 500, fontSize: 20}}>
                                            {el.description}
                                        </Typography>
                                        <Button onClick={() => deleteNote(el.id)}><DeleteOutlineIcon fontSize='large'
                                                                                                     sx={{color: '#332c63'}}/></Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    )
                })
            )
        } else {
            return <Typography>write a comment first!</Typography>
        }
    }

    return (
        <>
            <Box sx={{mt: 5}}>
                <Box sx={{}}>
                    <Box sx={{
                        justifyContent: 'space-around',
                        color: 'Black',
                        flexDirection: 'column',
                        display: 'flex',
                        textAlign: 'center'
                    }}>
                        <Typography variant="h3" sx={{fontFamily: 'Crimson Text'}}>
                            {order.title}
                        </Typography>
                        <Typography variant="h5">
                            {order.price} UAH
                        </Typography>
                            <Typography sx={{fontSize: 16, fontFamily: 'Crimson Text',
                            mt: 2}}>
                                {order.startDate} - {order.endDate}
                            </Typography>
                    </Box>
                    <Box sx={{
                        mt: 2,
                        justifyContent: 'center',
                        color: 'Black',
                        flexDirection: 'row',
                        display: 'flex',
                        textAlign: 'center'
                    }}>
                        <Button variant="outlined" onClick={handleUpdate}
                                sx={{
                                    borderColor: 'green', color: 'white', backgroundColor: 'green',
                                    ":hover": {
                                        color: "green",
                                        borderColor: "green",
                                    }
                                }}>Edit</Button>
                        <Button onClick={() => deleteOrder(params.id)} variant="outlined" sx={{
                            borderColor: '#332c63',
                            left: 10,
                            color: 'white',
                            backgroundColor: '#332c63',
                            ":hover": {
                                color: "#332c63",
                                borderColor: "#332c63"
                            }
                        }}>Delete</Button>
                    </Box>
                    <Box>
                        <FormControl>
                            <Dialog open={openUpdate} onClose={handleUpdate}>
                                <DialogTitle>Update Order</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        margin="dense"
                                        id="title"
                                        label="Title Order"
                                        type="text"
                                        fullWidth
                                        required
                                        variant="standard"
                                        helperText="Title must be min 1 and max 100 symbols"
                                        value={orderUpdateTitle}
                                        onChange={(e) => setOrderUpdateTitle(e.target.value)}
                                    />
                                    <TextareaAutosize
                                        aria-label="empty textarea"
                                        placeholder="Description Order"
                                        style={{
                                            width: 520,
                                            border: "none",
                                            fontSize: 20,
                                            fontFamily: 'Crimson Text',
                                            outline: "none",
                                        }}
                                        value={orderUpdateDescription}
                                        onChange={(e) => setOrderUpdateDescription(e.target.value)}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="price"
                                        label="Price"
                                        type="number"
                                        fullWidth
                                        variant="standard"
                                        value={orderUpdatePrice}
                                        onChange={(e) => setOrderUpdatePrice(e.target.value)}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="startDate"
                                        label="Start date"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        value={orderUpdateStartDate}
                                        onChange={(e) => setOrderUpdateStartDate(e.target.value)}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="endDate"
                                        label="End date"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        value={orderUpdateEndDate}
                                        onChange={(e) => setOrderUpdateEndDate(e.target.value)}
                                    />
                                    <Select sx={{mt: 1, fontFamily: 'Crimson Text'}} labelId="categoriesID"
                                            id="categories" label="Category"
                                            value={orderUpdateCategories}
                                            onChange={(e) => setOrderUpdateCategories(e.target.value)}>
                                        <MenuItem value="PROGRAMMING">PROGRAMMING</MenuItem>
                                        <MenuItem value="TRANSLATE">TRANSLATE</MenuItem>
                                        <MenuItem value="DESIGN">DESIGN</MenuItem>
                                        <MenuItem value="RECRUITING">RECRUITING</MenuItem>
                                        <MenuItem value="COPYRIGHT">COPYRIGHT</MenuItem>
                                        <MenuItem value="MARKETING">MARKETING</MenuItem>
                                    </Select>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => updateOrder(params.id)} variant="contained"
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
                <Box sx={{justifyContent: 'center', display: 'flex'}} component="form">
                    <FormControl>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Add comment</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="title"
                                    label="Title"
                                    type="text"
                                    fullWidth
                                    helperText='Title must be min 1 and max 100 symbols'
                                    variant="standard"
                                    onChange={(e) => setOrderTitle(e.target.value)}
                                />
                                <TextField
                                    margin="dense"
                                    id="description"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    helperText='Description must be min 25 symbols'
                                    onChange={(e) => setOrderDescription(e.target.value)}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={sendData} endIcon={<SendIcon/>}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "green",
                                            ":hover": {backgroundColor: "green"}
                                        }}>Send</Button>
                                <Button onClick={handleClose} variant="contained" endIcon={<CloseIcon/>}
                                        sx={{
                                            backgroundColor: "red",
                                            ":hover": {backgroundColor: "red"}
                                        }}>Back</Button>
                            </DialogActions>
                        </Dialog>
                    </FormControl>
                </Box>
            </Box>
            <Box sx={{maxWidth: 825, margin: '0 auto', paddingTop: 5}}>
                <Typography sx={{mb: 2, fontWeight: 700, fontStyle: 'oblique', fontFamily: 'Crimson Text'}}
                            color="text.secondary">
                    {order.categories}
                </Typography>
                <Typography sx={{fontSize: 20, fontFamily: 'Crimson Text', textAlign: 'justify'}} variant="body2">
                    {order.description}
                </Typography>
                <hr/>
            </Box>
            <Box sx={{justifyContent: 'center', display: 'flex', mb: 2}}>
                <Button variant="outlined" onClick={handleClickOpen} sx={{
                    height: 40,
                    mt: 1.5,
                    backgroundColor: 'green',
                    color: "white",
                    fontWeight: 'bold',
                    ":hover": {
                        color: "green",
                        borderColor: "green"
                    }
                }}>Write comment</Button>
            </Box>
            <CommentView/>
            <Box sx={{mb: 2, display: 'flex', justifyContent: 'center'}}>
                <Button variant="contained" endIcon={<SettingsBackupRestoreOutlinedIcon/>} sx={{
                    mt: 2, backgroundColor: "green",
                    ":hover": {backgroundColor: "white", color: "green"}
                }} onClick={backToHomePage}>
                    Back to home page</Button>
            </Box>
        </>
    )
}

export default OrderComponent
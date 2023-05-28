import React, {useEffect, useState} from "react";
import usePagination from "../../context/Pagination";
import axios from "axios";
import {Avatar, Card, CircularProgress, Divider, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

const UserListComponent = () => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 5;

    const count = Math.ceil(user.length / pageSize);
    const data = usePagination(user, pageSize);

    const handleChange = (event, value) => {
        setPageNumber(value);
        data.jump(value);
    }

    const getUserList = async () => {
        setLoading(true)
        try {
            const user = await axios.get(`http://localhost:8090/api/user`)
            setUser(user.data)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getUserList()
    }, []);

    if (loading) {
        return (<div
            style={{
                display: "flex", justifyContent: "center", alignItems: "center", padding: 30,
            }}
        >
            <CircularProgress/>
        </div>);
    }
    if (error) {
        return (<>
            <h5>{error}</h5>
        </>);
    }

    const UserViewList = () => {
        if (data) {
            return (data.currentData().map(el => (<>
                    <Card key={el.id} sx={{mt: 3}}>
                        <Box sx={{p: 2, display: 'flex'}}>
                            <Stack spacing={0.5} sx={{ml: 2}}>
                                <Typography variant="h5" component="div"
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                fontWeight: 550
                                            }}>{el.firstName} {el.lastName}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{fontWeight: 700, fontStyle: 'oblique'}}>
                                    {el.role}
                                </Typography>
                            </Stack>
                        </Box>
                        <Divider/>
                        <CardActions sx={{display: 'flex', justifyContent: "end"}}>
                            <Button variant="outlined"
                                    sx={{fontSize: '10px', backgroundColor: "green", color: "white", ":hover": {
                                        borderColor: 'green', color: 'green'
                                        }}}
                                    href={`/user/${el.id}`}>Read
                                more...</Button>
                        </CardActions>
                    </Card>
                </>
            )))
        } else {
            return <Typography>Сreate first user</Typography>
        }
    }

    return <Box sx={{ml: 65, maxWidth: '80%', display: 'flex', justifyContent: 'start', alignItems: 'top', mt: 5}}>
        <Box sx={{maxWidth: '80%', width: 825, display: 'flex', flexDirection: 'column'}}>
            <UserViewList/>
        </Box>
    </Box>;
}

export default UserListComponent;
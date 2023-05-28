import React, {useEffect, useState} from 'react';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import axios from 'axios';
import {Card, CircularProgress, Divider, Stack} from "@mui/material";
import usePagination from "../../context/Pagination";

const OrderListComponent = () => {
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 5;

    const count = Math.ceil(order.length / pageSize);
    const data = usePagination(order, pageSize);

    const handleChange = (event, value) => {
        setPageNumber(value);
        data.jump(value);
    }

    const getOrderList = async () => {
        setLoading(true)
        try {
            const order = await axios.get(`http://localhost:8090/api/orders`)
            setOrder(order.data)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getOrderList()
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

    const OrderViewList = () => {
        if (data) {
            return (data.currentData().map(el => (<>
                <Card key={el.id} sx={{mt: 3}}>
                    <Box>
                        <Stack sx={{ml: 2}}>
                            <Typography sx={{fontSize: '16px', fontWeight: 550, mt: 1, fontFamily: 'Crimson Text'}}>
                                {el.user.firstName} {el.user.lastName}
                            </Typography>
                            <Box sx={{justifyContent: 'space-between', flexDirection: 'row', display: 'flex'}}>
                                <Typography variant="h5" component="div"
                                            sx={{fontWeight: 500, fontSize: 30, fontFamily: 'Crimson Text'}}>
                                    {el.title}
                                </Typography>
                                <Typography variant="h5" component="div"
                                            sx={{fontWeight: 520, mr: 2, fontFamily: 'Verdana'}}>
                                    {el.price} UAH
                                </Typography>
                            </Box>
                            <Typography sx={{mb: 1.5}} color="text.secondary"
                                        sx={{fontWeight: 700, fontStyle: 'oblique', fontFamily: 'Crimson Text'}}>
                                {el.categories}
                            </Typography>
                            <Typography variant="body2" sx={{
                                fontWeight: 530,
                                mt: 1,
                                mr: 2,
                                fontSize: 18,
                                fontFamily: 'Crimson Text',
                                textAlign: 'justify'
                            }}>
                                {el.description}
                            </Typography>
                            <Typography sx={{
                                fontSize: 16,
                                fontFamily: 'Crimson Text',
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'center'
                            }} color="text.secondary" gutterBottom>
                                {el.startDate} - {el.endDate}
                            </Typography>
                        </Stack>
                        <Divider/>
                        <Stack>
                            <CardActions sx={{display: 'flex', justifyContent: "end"}}>
                                <Button variant="outlined"
                                        sx={{
                                            fontSize: '10px',
                                            backgroundColor: "green",
                                            color: "white",
                                            mr: 1,
                                            ":hover": {
                                                borderColor: 'green', color: 'green'
                                            }
                                        }}
                                        href={`/orders/${el.id}`}>Read
                                    more...</Button>
                            </CardActions>
                        </Stack>
                    </Box>
                </Card>
            </>)))
        } else {
            return <Typography>Сreate first order</Typography>
        }
    }

    return (
        <Box sx={{ml: 65, maxWidth: '80%', display: 'flex', justifyContent: 'start', alignItems: 'top', mt: 5}}>
            <Box sx={{maxWidth: '80%', width: 825, display: 'flex', flexDirection: 'column'}}>
                <OrderViewList/>
            </Box>
        </Box>
    );
}

export default OrderListComponent;
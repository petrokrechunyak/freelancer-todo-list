import './App.css';
import React from "react";
import {Routes, Route} from "react-router-dom";
import UserListComponent from "./components/UserListComponent/UserListComponent";
import NavbarComponent from "./components/ReusableComponent/NavbarComponent";
import OrderListComponent from "./components/OrderListComponent/OrderListComponent";
import OrderComponent from "./components/OrderListComponent/OrderComponent";
import AddOrderComponent from "./components/OrderListComponent/AddOrderComponent";
import AddUserComponent from "./components/UserListComponent/AddUserComponent";
import UserComponent from "./components/UserListComponent/UserComponent";

const App = () => {

    return (
        <>
            <NavbarComponent/>
            <Routes>
                <Route path="/" element={<OrderListComponent/>}/>
                <Route path="/users" element={<UserListComponent/>}/>
                <Route path="/add_order" element={<AddOrderComponent/>}/>
                <Route path="/add_user" element={<AddUserComponent/>}/>
                <Route path="/orders/:id" element={<OrderComponent/>}/>
                <Route path="/user/:id" element={<UserComponent/>}/>
            </Routes>
        </>
    );
}

export default App;

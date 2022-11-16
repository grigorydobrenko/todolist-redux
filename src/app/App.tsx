import React from 'react'
import './App.css'
import {AppBar, Container, IconButton, LinearProgress, Toolbar, Typography} from "@mui/material"
import {MenuOpen} from "@mui/icons-material"
import {TodolistsLists} from "../features/todolists/TodolistsLists"
import {useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {RequestStatusType} from "./app-reducer";
import {CustomizedSnackbars} from "../components/errorSnackbar/ErrorSnackbar";
import {Login} from "../features/login/Login";
import {Navigate, Route, Routes} from "react-router-dom";

enum ROUTS {
    DEFAULT = '/',
    LOGIN = '/login',
    NOT_FOUND= '/404',
}


function App() {

    const status = useSelector<AppRootStateType,RequestStatusType>(state => state.app.status)

    return (
        <div className={'App'}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <IconButton edge="start" color="secondary" aria-label="menu" sx={{mr: 2}}>
                        <MenuOpen/>
                    </IconButton>
                    <Typography variant="h6" color="inherit" component="div">
                        News
                    </Typography>
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={ROUTS.DEFAULT} element={<TodolistsLists/>}></Route>
                    <Route path={ROUTS.LOGIN} element={<Login/>}></Route>
                    <Route path={ROUTS.NOT_FOUND} element={<h1 style={{textAlign: 'center'}}>404: PAGE NOT FOUND</h1>}></Route>
                    <Route path='*' element={<Navigate to={ROUTS.NOT_FOUND}/>}></Route>
                </Routes>
            </Container>
            <CustomizedSnackbars/>
        </div>
    )
}


export default App;

import React from 'react'
import './App.css'
import {AppBar, Container, IconButton, LinearProgress, Toolbar, Typography} from "@mui/material"
import {MenuOpen} from "@mui/icons-material"
import {TaskType} from "../api/todolist-api"
import {TodolistsLists} from "../features/todolists/TodolistsLists"
import {useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {RequestStatusType} from "./app-reducer";
import {CustomizedSnackbars} from "../components/errorSnackbar/ErrorSnackbar";

export type TasksStateType = {
    [id: string]: TaskType[]
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
                <TodolistsLists/>
            </Container>
            <CustomizedSnackbars/>
        </div>
    )
}


export default App;

import React from 'react'
import './App.css'
import {AppBar, Container, IconButton, Toolbar, Typography} from "@mui/material"
import {MenuOpen} from "@mui/icons-material"
import {TaskType} from "../api/todolist-api"
import {TodolistsLists} from "../features/todolists/TodolistsLists"

export type TasksStateType = {
    [id: string]: TaskType[]
}

function App() {

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
            </AppBar>
            <Container fixed>
                <TodolistsLists/>
            </Container>
        </div>
    )
}


export default App;

import React from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import AddItemForm from "./components/AddItemForm";
import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";

import {MenuOpen} from "@mui/icons-material";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type FilterType = 'all' | 'active' | 'completed'
export type TodoListsType = TodoListType[]
export type TodoListType = {
    id: string, title: string, filter: FilterType
}

export type TasksStateType = {
    [id: string]: TaskType[]
}


function AppWithRedux() {


    let todolists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todolists)
    let tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)


    const dispatch = useDispatch()

    const removeTask = (TodolistId: string, taskID: string) => {
        let action = removeTaskAC(taskID, TodolistId)
        dispatch(action)
    }


    const changeFilter = (todolistID: string, filter: FilterType) => {
        dispatch(ChangeTodolistFilterAC(todolistID, filter))
    }

    const addTask = (todolistID: string, newTitle: string) => {
        dispatch(addTaskAC(newTitle, todolistID))
    }

    const changeTaskStatus = (todolistID: string, taskId: string, status: boolean) => {
        dispatch(changeTaskStatusAC(taskId, status, todolistID))

    }

    const removeTodolist = (todolistId: string) => {
        let action = RemoveTodolistAC(todolistId)
        dispatch(action)

    }


    const addTodolist = (todolistTitle: string) => {
        let action = AddTodolistAC(todolistTitle)
        dispatch(action)

    }

    const ChangeTaskTitle = (TodolistId: string, taskId: string, newTitle: string) => {
        dispatch(changeTaskTitleAC(TodolistId, taskId, newTitle))
    }


    const ChangeTodolistTitle = (TodolistId: string, newTitle: string) => {
        dispatch(ChangeTodolistTitleAC(TodolistId, newTitle))
    }

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
                <Grid container style={{padding: '20px'}}><AddItemForm addItem={addTodolist}/></Grid>
                <Grid container spacing={3}>
                    {todolists.map(t => {
                        let taskForTODO = tasks[t.id]

                        if (t.filter === 'active') {
                            taskForTODO = tasks[t.id].filter(t => !t.isDone)
                        }
                        if (t.filter === 'completed') {
                            taskForTODO = tasks[t.id].filter(t => t.isDone)
                        }
                        return <Grid item key={t.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    key={t.id}
                                    id={t.id}
                                    title={t.title}
                                    tasks={taskForTODO}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeTaskStatus}
                                    filter={t.filter}
                                    removeTodolist={removeTodolist}
                                    ChangeTaskTitle={ChangeTaskTitle}
                                    ChangeTodolistTitle={ChangeTodolistTitle}
                                />
                            </Paper>
                        </Grid>

                    })
                    }
                </Grid>
            </Container>
        </div>
    )
}

export default AppWithRedux;

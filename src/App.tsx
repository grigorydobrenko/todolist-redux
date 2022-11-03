import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import AddItemForm from "./components/AddItemForm";
import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";

import {MenuOpen} from "@mui/icons-material";
import {
    ChangeTodolistFilterAC,
    changeTodoTitleTC, createTodoTC, deleteTodoTC, FilterType, getTodoTC,
} from "./state/todolists-reducer";
import {
    changeTaskTitleAC, createTaskTC,
    deleteTaskTC,
    updateTaskTC
} from "./state/tasks-reducer";
import {TaskStatuses, TaskType} from "./api/todolist-api";
import {useAppDispatch, useAppSelector} from "./app/hooks";

export type TasksStateType = {
    [id: string]: TaskType[]
}

function App() {

    let todolists = useAppSelector(state => state.todolists)
    let tasks = useAppSelector(state => state.tasks)
    const dispatch = useAppDispatch()

    const removeTask = useCallback((TodolistId: string, taskID: string) => {
        dispatch(deleteTaskTC(TodolistId, taskID))
    }, [dispatch])


    const changeFilter = useCallback((todolistID: string, filter: FilterType) => {
        dispatch(ChangeTodolistFilterAC(todolistID, filter))
    }, [dispatch])

    const addTask = useCallback((todolistID: string, newTitle: string) => {
        dispatch(createTaskTC(todolistID, newTitle))
    }, [dispatch])

    const changeTaskStatus = useCallback((todolistID: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todolistID, taskId, {status}))
    }, [dispatch])

    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(deleteTodoTC(todolistId))
    }, [dispatch])


    const addTodolist = useCallback((todolistTitle: string) => {
        dispatch(createTodoTC(todolistTitle))
    }, [dispatch])

    const ChangeTaskTitle = useCallback((TodolistId: string, taskId: string, newTitle: string) => {
        dispatch(changeTaskTitleAC(TodolistId, taskId, newTitle))
    }, [dispatch])


    const ChangeTodolistTitle = useCallback((TodolistId: string, newTitle: string) => {
        dispatch(changeTodoTitleTC(TodolistId, newTitle))
    }, [dispatch])

    useEffect(() => {
        dispatch(getTodoTC())
    }, [])

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
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map(t => {

                        return <Grid item key={t.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    key={t.id}
                                    id={t.id}
                                    title={t.title}
                                    tasks={tasks[t.id]}
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

export default App;

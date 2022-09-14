import React, {useCallback} from 'react';
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
    console.log('app rendering')

    let todolists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todolists)
    let tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch()

    const removeTask = useCallback((TodolistId: string, taskID: string) => {
        let action = removeTaskAC(taskID, TodolistId)
        dispatch(action)
    },[dispatch])


    const changeFilter = useCallback((todolistID: string, filter: FilterType) => {
        dispatch(ChangeTodolistFilterAC(todolistID, filter))
    },[dispatch])

    const addTask = useCallback((todolistID: string, newTitle: string) => {
        dispatch(addTaskAC(newTitle, todolistID))
    },[dispatch])

    const changeTaskStatus = useCallback((todolistID: string, taskId: string, status: boolean) => {
        dispatch(changeTaskStatusAC(taskId, status, todolistID))

    },[dispatch])

    const removeTodolist = useCallback((todolistId: string) => {
        let action = RemoveTodolistAC(todolistId)
        dispatch(action)

    },[dispatch])


    const addTodolist = useCallback((todolistTitle: string) => {
        let action = AddTodolistAC(todolistTitle)
        dispatch(action)

    }, [dispatch])

    const ChangeTaskTitle = useCallback((TodolistId: string, taskId: string, newTitle: string) => {
        dispatch(changeTaskTitleAC(TodolistId, taskId, newTitle))
    },[dispatch])


    const ChangeTodolistTitle = useCallback((TodolistId: string, newTitle: string) => {
        dispatch(ChangeTodolistTitleAC(TodolistId, newTitle))
    },[dispatch])

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

export default AppWithRedux;

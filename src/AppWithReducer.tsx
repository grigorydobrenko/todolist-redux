import React, {useReducer} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";
import AddItemForm from "./components/AddItemForm";
import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";

import {MenuOpen} from "@mui/icons-material";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";

export type FilterType = 'all' | 'active' | 'completed'
export type TodoListsType = TodoListType[]
export type TodoListType = {
    id: string, title: string, filter: FilterType
}

export type TasksStateType = {
    [id: string]: TaskType[]
}


function AppWithReducer() {


    const TodolistID1 = v1()
    const TodolistID2 = v1()


    const [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: TodolistID1, title: "what to learn", filter: 'all'},
        {id: TodolistID2, title: "what to buy", filter: 'all'}
    ])

    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
            [TodolistID1]: [{id: v1(), title: "HTML&CSS", isDone: true},
                {id: v1(), title: "JS", isDone: true},
                {id: v1(), title: "ReactJS", isDone: false}],
            [TodolistID2]: [{id: v1(), title: "milk", isDone: true},
                {id: v1(), title: "soda", isDone: true},
                {id: v1(), title: "bread", isDone: false}]
        }
    )


    const removeTask = (TodolistId: string, taskID: string) => {
        let action = removeTaskAC(taskID, TodolistId)
        dispatchToTasks(action)
    }


    const changeFilter = (todolistID: string, filter: FilterType) => {
        dispatchToTodolists(ChangeTodolistFilterAC(todolistID, filter))
    }

    const addTask = (todolistID: string, newTitle: string) => {
        dispatchToTasks(addTaskAC(newTitle, todolistID))
    }

    const changeTaskStatus = (todolistID: string, taskId: string, status: boolean) => {
        dispatchToTasks(changeTaskStatusAC(taskId, status, todolistID))

    }

    const removeTodolist = (todolistId: string) => {
        let action = RemoveTodolistAC(todolistId)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }


    const addTodolist = (todolistTitle: string) => {
        let action = AddTodolistAC(todolistTitle)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const ChangeTaskTitle = (TodolistId: string, taskId: string, newTitle: string) => {
        dispatchToTasks(changeTaskTitleAC(TodolistId, taskId, newTitle))
    }


    const ChangeTodolistTitle = (TodolistId: string, newTitle: string) => {
        dispatchToTodolists(ChangeTodolistTitleAC(TodolistId, newTitle))
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

export default AppWithReducer;

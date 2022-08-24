import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";
import AddItemForm from "./components/AddItemForm";
import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";

import {MenuOpen} from "@mui/icons-material";

export type FilterType = 'all' | 'active' | 'completed'
export type TodoListsType = TodoListType[]
export type TodoListType = {
    id: string, title: string, filter: FilterType
}

export type TasksStateType = {
    [id: string]: TaskType[]
}


function App() {


    const TodolistID1 = v1()
    const TodolistID2 = v1()


    const [todolists, setTodolists] = useState<TodoListsType>([
        {id: TodolistID1, title: "what to learn", filter: 'all'},
        {id: TodolistID2, title: "what to buy", filter: 'all'}
    ])

    const [tasks, setTasks] = useState<TasksStateType>({
            [TodolistID1]: [{id: v1(), title: "HTML&CSS", isDone: true},
                {id: v1(), title: "JS", isDone: true},
                {id: v1(), title: "ReactJS", isDone: false}],
            [TodolistID2]: [{id: v1(), title: "milk", isDone: true},
                {id: v1(), title: "soda", isDone: true},
                {id: v1(), title: "bread", isDone: false}]
        }
    )


    const removeTask = (TodolistId: string, taskID: string) => {
        setTasks({...tasks, [TodolistId]: tasks[TodolistId].filter(t => t.id !== taskID)})

    }


    const changeFilter = (todolistID: string, filter: FilterType) => {
        setTodolists(todolists.map(t => t.id === todolistID ? {...t, filter} : {...t}))
    }

    const addTask = (todolistID: string, newTitle: string) => {
        const newTask = {id: v1(), title: newTitle, isDone: false}
        setTasks({...tasks, [todolistID]: [newTask, ...tasks[todolistID]]})
    }

    const changeTaskStatus = (todolistID: string, taskId: string, status: boolean) => {
        setTasks({
            ...tasks,
            [todolistID]: tasks[todolistID].map(t => t.id === taskId ? {...t, isDone: status} : {...t})
        })

    }

    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter(t => t.id !== todolistId))

        delete tasks[todolistId]
        console.log(tasks)
    }


    const addTodolist = (todolistTitle: string) => {
        const newTodoId = v1()
        const newTodo: TodoListType = {id: newTodoId, title: todolistTitle, filter: 'all'}
        setTodolists([...todolists, newTodo])
        setTasks({...tasks, [newTodoId]: []})
    }

    const ChangeTaskTitle = (TodolistId: string, taskId: string, newTitle: string) => {
        setTasks({
            ...tasks,
            [TodolistId]: tasks[TodolistId].map(t => t.id === taskId ? {...t, title: newTitle} : {...t})
        })
        console.log(TodolistId, taskId, newTitle)
    }


    const ChangeTodolistTitle = (TodolistId: string, newTitle: string) => {
        setTodolists(todolists.map(t => t.id === TodolistId ? {...t, title: newTitle} : {...t}))
        console.log(TodolistId, newTitle)
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
                        return <Grid item>
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

export default App;

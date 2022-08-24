import React, {ChangeEvent} from "react";
import {FilterType} from "./App";
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";

type PropsType = {
    id: string
    title: string
    tasks: TaskType[]
    removeTask: (todolistId: string, taskID: string) => void
    changeFilter: (todolistID: string, filter: FilterType) => void
    addTask: (todolistID: string, newTitle: string) => void
    changeTaskStatus: (todolistID: string, taskId: string, status: boolean) => void
    removeTodolist: (todolistId: string) => void
    ChangeTaskTitle: (TodolistId: string, taskId: string, newTitle: string) => void
    ChangeTodolistTitle: (TodolistId: string, newTitle: string) => void
    filter: FilterType
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export const Todolist: React.FC<PropsType> = (
    {
        id,
        title,
        tasks,
        removeTask,
        changeFilter,
        addTask,
        changeTaskStatus,
        removeTodolist,
        ChangeTaskTitle,
        ChangeTodolistTitle,
        filter
    }
) => {


    const RemoveTaskHandler = (taskID: string) => {
        removeTask(id, taskID)
    }
    const onAllClickHandler = () => {
        changeFilter(id, 'all')
    }
    const onActiveClickHandler = () => {
        changeFilter(id, 'active')
    }
    const onCompleteClickHandler = () => {
        changeFilter(id, 'completed')
    }


    const addNewTask = (title: string) => {
        addTask(id, title)
    }


    const onClickTitleHandler = () => {
        removeTodolist(id)
    }


    const ChangeTask = (taskId: string, newTitle: string) => {
        ChangeTaskTitle(id, taskId, newTitle)
    }

    const ChangeTodolist = (newTitle: string) => {
        ChangeTodolistTitle(id, newTitle)
    }

    const allClassName = filter === 'all' ? "outlined" : "text"
    const activeClassName = filter === 'active' ? "outlined" : "text"
    const completedClassName = filter === 'completed' ? "outlined" : "text"

    return (
        <div className="App">
            <div>

                <h3>
                    <EditableSpan value={title} callBack={ChangeTodolist}/>
                    <IconButton aria-label="delete" size="small" onClick={onClickTitleHandler}>
                        <Delete/>
                    </IconButton>
                </h3>

                <AddItemForm addItem={addNewTask}/>

                {tasks.map(t => {
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        changeTaskStatus(id, t.id, e.currentTarget.checked)
                    }
                    return <div key={t.id} className={t.isDone ? 'is-done' : ''}>
                        <Checkbox onChange={onChangeHandler} checked={t.isDone} color='primary'/>
                        <EditableSpan value={t.title} callBack={(newTitle) => ChangeTask(t.id, newTitle)}/>
                        <IconButton aria-label="delete" size="small" onClick={() => RemoveTaskHandler(t.id)}>
                            <Delete/>
                        </IconButton>
                    </div>
                })}


                <div>
                    <Button onClick={onAllClickHandler} variant={allClassName} color='warning'>All</Button>
                    <Button onClick={onActiveClickHandler} variant={activeClassName} color='error'>Active</Button>
                    <Button onClick={onCompleteClickHandler} variant={completedClassName}
                            color='secondary'>Completed</Button>
                </div>
            </div>
        </div>
    )
}
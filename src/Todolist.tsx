import React, { useCallback} from "react";
import {FilterType} from "./App";
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import TaskComponent from "./components/TaskComponent";

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

export const Todolist: React.FC<PropsType> = React.memo((
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
    console.log('tl called')


    const onAllClickHandler = useCallback(() => {
        changeFilter(id, 'all')
    }, [changeFilter, id])

    const onActiveClickHandler = useCallback(() => {
        changeFilter(id, 'active')
    }, [changeFilter, id])

    const onCompleteClickHandler = useCallback(() => {
        changeFilter(id, 'completed')
    }, [changeFilter, id])


    const addNewTask = useCallback((title: string) => {
        addTask(id, title)
    }, [addTask, id])


    const onClickTitleHandler = () => {
        removeTodolist(id)
    }


    const ChangeTodolist = useCallback((newTitle: string) => {
        ChangeTodolistTitle(id, newTitle)
    }, [ChangeTodolistTitle, id])

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

                {tasks.map(t =>
                    <TaskComponent
                        key={t.id}
                        changeTaskStatus={changeTaskStatus}
                        removeTask={removeTask}
                        ChangeTaskTitle={ChangeTaskTitle}
                        t={t}
                        todolistId={id}/>
                )}


                <div>
                    <Button onClick={onAllClickHandler} variant={allClassName} color='warning'>All</Button>
                    <Button onClick={onActiveClickHandler} variant={activeClassName} color='error'>Active</Button>
                    <Button onClick={onCompleteClickHandler} variant={completedClassName}
                            color='secondary'>Completed</Button>
                </div>
            </div>
        </div>
    )
})
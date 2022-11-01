import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import EditableSpan from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "../api/todolist-api";


type TaskPropsType = {
    changeTaskStatus: (todolistID: string, taskId: string, status: TaskStatuses) => void
    removeTask: (todolistId: string, taskID: string) => void
    ChangeTaskTitle: (TodolistId: string, taskId: string, newTitle: string) => void
    task: TaskType
    todolistId: string

}
const TaskComponent = React.memo((props: TaskPropsType) => {
    const RemoveTaskHandler = useCallback((taskID: string) => {
        props.removeTask(props.todolistId, taskID)
    }, [props.removeTask, props.task.id])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked? TaskStatuses.Completed : TaskStatuses.New
        props.changeTaskStatus(props.todolistId, props.task.id, status)
    }, [props.todolistId, props.task.id])
    const ChangeTask = useCallback((taskId: string, newTitle: string) => {
        props.ChangeTaskTitle(props.todolistId, taskId, newTitle)
    }, [props.ChangeTaskTitle, props.todolistId])

    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox onChange={onChangeHandler} checked={props.task.status === TaskStatuses.Completed} color='primary'/>
        <EditableSpan value={props.task.title} callBack={(newTitle) => ChangeTask(props.task.id, newTitle)}/>
        <IconButton aria-label="delete" size="small" onClick={() => RemoveTaskHandler(props.task.id)}>
            <Delete/>
        </IconButton>
    </div>
})

export default TaskComponent;
import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import EditableSpan from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskType} from "../Todolist";


type TaskPropsType = {
    changeTaskStatus: (todolistID: string, taskId: string, status: boolean) => void
    removeTask: (todolistId: string, taskID: string) => void
    ChangeTaskTitle: (TodolistId: string, taskId: string, newTitle: string) => void
    t: TaskType
    todolistId: string

}
const TaskComponent = React.memo((props: TaskPropsType) => {
    const RemoveTaskHandler = useCallback((taskID: string) => {
        props.removeTask(props.t.id, taskID)
    }, [props.removeTask, props.t.id])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(props.todolistId, props.t.id, e.currentTarget.checked)
    }, [props.changeTaskStatus, props.todolistId, props.t.id])
    const ChangeTask = useCallback((taskId: string, newTitle: string) => {
        props.ChangeTaskTitle(props.todolistId, taskId, newTitle)
    }, [props.ChangeTaskTitle, props.todolistId])

    return <div key={props.t.id} className={props.t.isDone ? 'is-done' : ''}>
        <Checkbox onChange={onChangeHandler} checked={props.t.isDone} color='primary'/>
        <EditableSpan value={props.t.title} callBack={(newTitle) => ChangeTask(props.t.id, newTitle)}/>
        <IconButton aria-label="delete" size="small" onClick={() => RemoveTaskHandler(props.t.id)}>
            <Delete/>
        </IconButton>
    </div>
})

export default TaskComponent;
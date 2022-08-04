import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {FilterType} from "./App";

type PropsType = {
    id: string
    title: string
    tasks: TaskType[]
    removeTask: (todolistId: string, taskID: string) => void
    changeFilter: (todolistID: string, filter: FilterType) => void
    addTask: (todolistID: string, newTitle: string) => void
    changeTaskStatus: (todolistID: string, taskId: string, status: boolean) => void
    removeTodolist: (todolistId: string) => void
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
        filter
    }
) => {
    const [newTitle, setNewTitle] = useState<string>('')
    const [error, setError] = useState<boolean>(false)


    const RemoveTaskHandler = (taskID: string) => {
        removeTask(id, taskID)
    }
    const onAllClickHandler = () => {
        changeFilter(id,'all')
    }
    const onActiveClickHandler = () => {
        changeFilter(id,'active')
    }
    const onCompleteClickHandler = () => {
        changeFilter(id,'completed')
    }


    const addNewTask = () => {
        const trimmedTitle = newTitle.trim()

        if (trimmedTitle) {
            addTask(id, newTitle)
            setNewTitle('')
            setError(false)
        } else {
            setError(true)
        }
    }
    const addTaskHandler = () => {
        addNewTask()
    }


    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addNewTask()
        }
        setError(false)
    }


    const onClickTitleHandler = () => {
        removeTodolist(id)
    }


    const inputClassName = error ? "error" : ""

    const allClassName = filter === 'all' ? "active-filter" : ""
    const activeClassName = filter === 'active' ? "active-filter" : ""
    const completedClassName = filter === 'completed' ? "active-filter" : ""

    return (
        <div className="App">
            <div>
                <h3>{title}
                <button onClick={onClickTitleHandler}>✖</button>
                </h3>

                <div>
                    <input onChange={onChangeHandler}
                           value={newTitle}
                           onKeyDown={onKeyDownHandler}
                           className={inputClassName}/>
                    <button onClick={addTaskHandler}>+</button>
                    {error && <div className={'error-message'}>Error! Title couldn't be empty!</div>}
                </div>
                <ul>

                    {tasks.map(t => {
                        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                            changeTaskStatus(id, t.id, e.currentTarget.checked)
                        }
                        return <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                            <input type="checkbox" checked={t.isDone} onChange={onChangeHandler}/>
                            <span>{t.title}</span>
                            <button onClick={() => RemoveTaskHandler(t.id)}>✖</button>
                        </li>
                    })}

                </ul>
                <div>
                    <button onClick={onAllClickHandler} className={allClassName}>All</button>
                    <button onClick={onActiveClickHandler} className={activeClassName}>Active</button>
                    <button onClick={onCompleteClickHandler} className={completedClassName}>Completed</button>
                </div>
            </div>
        </div>
    )
}
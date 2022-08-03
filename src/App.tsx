import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type FilterType = 'all' | 'active' | 'completed'


function App() {

    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false}

    ])

    const [filter, setFilter] = useState<FilterType>('all')

    const removeTask = (taskID: string) => {
        setTasks(tasks.filter(t => t.id !== taskID))
    }
    const changeFilter = (filter: FilterType) => {
        setFilter(filter)
    }

    const addTask = (newTitle: string) => {
        const newTask = {id: v1(), title: newTitle, isDone: false}
        setTasks([newTask, ...tasks])
    }

    const changeTaskStatus = (taskId: string, status: boolean) => {
        setTasks(tasks.map(t => t.id === taskId ? {...t, isDone: status} : {...t}))
    }


    let taskForTODO = tasks

    if (filter === 'active') {
        taskForTODO = tasks.filter(t => !t.isDone)
    }
    if (filter === 'completed') {
        taskForTODO = tasks.filter(t => t.isDone)
    }


    return (
        <div>
            <Todolist
                title={'1'}
                tasks={taskForTODO}
                removeTask={removeTask}
                changeFilter={changeFilter}
                addTask={addTask}
                changeTaskStatus={changeTaskStatus}
                filter={filter}
            />
        </div>
    )
}

export default App;

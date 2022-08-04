import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type FilterType = 'all' | 'active' | 'completed'
type TodoListsType = TodoListType[]
type TodoListType = {
    id: string, title: string, filter: FilterType
}

type TasksType = {
    [id: string]: TaskType[]
}

// type TaskType = {
//     id: string, title: string, isDone: boolean
// }

function App() {




    const TodolistID1 = v1()
    const TodolistID2 = v1()


    const [todolists, setTodolists] = useState<TodoListsType>([
        {id: TodolistID1, title: "what to learn", filter: 'all'},
        {id: TodolistID2, title: "what to buy", filter: 'all'}
    ])

    const [tasks, setTasks] = useState<TasksType>({
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

    const removeTodolist = (todolistId:string) => {
        setTodolists(todolists.filter(t => t.id !== todolistId))

        delete tasks[todolistId]
        console.log(tasks)
    }


    return (
        <div>
            {todolists.map(t => {
                let taskForTODO = tasks[t.id]

                if (t.filter === 'active') {
                    taskForTODO = tasks[t.id].filter(t => !t.isDone)
                }
                if (t.filter === 'completed') {
                    taskForTODO = tasks[t.id].filter(t => t.isDone)
                }
                return (
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
                    />
                )
            })}

        </div>
    )
}

export default App;

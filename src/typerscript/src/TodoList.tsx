import React, { useState } from 'react';

interface Todo {
    text: string;
    completed: boolean;
}

function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const dailyTasks: Todo[] = [
        { text: "idz do sklepu", completed: false },
        { text: "wroc ze sklepu", completed: false },
        { text: "zamow", completed: false },
    ];

    const handleDelete = (index: number) => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setTodos([...todos, { text: inputValue, completed: false }]);
        setInputValue('');
    }

    function handleStatus(index: number) {
        const newTodos: Todo[] = [...todos];
        newTodos[index] = {
            ...newTodos[index],
            completed: !newTodos[index].completed 
        };
        setTodos(newTodos);
    }

    return (
        <div className="w-full p-4">
            <div>
                <h1 className="text-2xl font-bold mb-4">Lista do zrobienia</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only">To do list</label>
                    <div className="relative">
                        <input 
                            value={inputValue} 
                            onChange={handleChange} 
                            type="search" 
                            id="search" 
                            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="To do list" 
                            required 
                        />
                        <button 
                            type="submit" 
                            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                        >
                            Dodaj
                        </button>
                    </div>
                </form>
                <ul className="mt-4 space-y-2">
                    {todos.map((todo, index) => (
                        <li key={index} className={`flex items-center justify-between p-2 border rounded-lg ${todo.completed ? 'bg-green-200 line-through' : 'bg-white text-black'}`}>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleStatus(index)}
                                    className="mr-2"
                                />
                                <span>{todo.text}</span>
                            </div>
                            <button 
                                className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 rounded-lg text-sm px-4 py-2"
                                onClick={() => handleDelete(index)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-8">
                <h1 className="text-2xl font-bold mb-4">Daily tasks</h1>
                <ul className="space-y-2">
                    {dailyTasks.map((task, index) => (
                        <li key={index} className={`flex items-center p-2 border rounded-lg ${task.completed ? 'bg-green-200 line-through' : 'bg-white text-black'}`}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => {}}
                                disabled
                                className="mr-2"
                            />
                            <span>{task.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <TodoCounter todos={todos} /> {/*Licznik zadan*/}
            <CompletedTasksCounter todos={todos} /> {/*Licznik ukonczonych zadan*/}
        </div>
    );
}

const TodoCounter: React.FC<{ todos: Todo[] }> = ({ todos }) => {
    return (
        <div>
            <h2>Liczba zadań: {todos.length}</h2>
            <p>Sprawdź ile zadań masz na swojej liście.</p>
        </div>
    );
}

const CompletedTasksCounter: React.FC<{ todos: Todo[] }> = ({ todos }) => {
    const completedTasks = todos.filter(task => task.completed).length;

    return (
        <div>
            <h2>Ukończone zadania: {completedTasks}</h2>
            <p>Sprawdź ile zadań ukończyłeś.</p>
        </div>
    );
}

export default TodoList;

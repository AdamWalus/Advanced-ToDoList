import './index.scss';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { fetchTodosAsync, addTodoAsync, toggleTodo, deleteTodo } from './todosSlice';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function TodoList() {
  const dispatch = useDispatch<AppDispatch>(); 
  const todos = useSelector((state: RootState) => state.todos);
  const [inputValue, setInputValue] = useState('');

  //pobieranie listy zadan
  useEffect(() => {
    dispatch(fetchTodosAsync());
  }, [dispatch]);

  //obsluga formularza do dodawania nowego zadania
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(addTodoAsync(inputValue));
    setInputValue('');
  };

  //czy zadanie jest ukonczone czy nie
  const handleStatus = (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (todoToUpdate) {
      dispatch(toggleTodo(id));
      fetch(`http://localhost:3001/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: todoToUpdate.text, completed: !todoToUpdate.completed })
      })
        .then(response => response.json())
        .then(data => console.log('Zaktualizowane todo:', data))
        .catch(error => console.error('Blad podczas aktualizacji listy:', error));
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTodo(id));
    fetch(`http://localhost:3001/todos/${id}`, { method: 'DELETE' })
      .catch(error => console.error('Blad podczas usuwania zadan:', error));
  };

  const dailyTasks: Todo[] = [
    { id: 1, text: "idz do sklepu", completed: false },
    { id: 2, text: "wroc ze sklepu", completed: false },
    { id: 3, text: "zamow", completed: false },
  ];


  useEffect(() => {
    const tasksList = document.querySelector('.tasks-list');
    const headerContainer = document.querySelector('.header-container');
    if (tasksList && headerContainer) {
      const hasMoreThan3Tasks = tasksList.children.length > 3;
      if (hasMoreThan3Tasks) {
        headerContainer.classList.add('header-container-mt10');
      } else {
        headerContainer.classList.remove('header-container-mt10');
      }
    }
  }, [todos]);
  

  return (
    <Router>
      <div className="w-full header-container">
      <nav className="navbar">
          <div className="navbar-content max-w-[1200px]">
            <div className="navbar-flex">
            <div className="navbar-links">
                <Link to="/home" className="navbar-link">Todo App</Link>
              </div>
              <div className="navbar-links">
                <Link to="/about" className="navbar-link">O nas</Link>
                <Link to="/contact" className="navbar-link">Kontakt</Link>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="w-full p-4 max-w-[500px] mx-auto">
          <Routes>
            <Route path="/home" element={<TodoListComponent todos={todos} handleSubmit={handleSubmit} setInputValue={setInputValue} handleStatus={handleStatus} handleDelete={handleDelete} dailyTasks={dailyTasks} inputValue={inputValue} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const TodoListComponent: React.FC<{
  todos: Todo[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleStatus: (id: number) => void;
  handleDelete: (id: number) => void;
  inputValue:string;
  dailyTasks: Todo[];
}> = ({ todos, handleSubmit, setInputValue, handleStatus, handleDelete,inputValue,  dailyTasks }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lista do zrobienia</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only">To do list</label>
        <div className="relative">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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
      <ul className="mt-4 space-y-2 tasks-list">
        {todos.map((todo) => (
          <li key={todo.id} className={`flex items-center justify-between p-2 border rounded-lg ${todo.completed ? 'bg-green-200' : 'bg-white text-black'}`}>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleStatus(todo.id)}
                className="mr-2"
              />
              <span className={todo.completed ? 'line-through text-zinc-500' : ''}>{todo.text}</span>
            </div>
            <button
              className="rounded-lg text-sm px-4 py-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4"
              onClick={() => handleDelete(todo.id)}
              style={{ textDecoration: 'none' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <h1 className="text-2xl font-bold mb-4">Daily tasks</h1>
        <ul className="space-y-2">
          {dailyTasks.map((task) => (
            <li key={task.id} className={`flex items-center p-2 border rounded-lg ${task.completed ? 'bg-green-200 line-through' : 'bg-white text-black'}`}>
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
      <TodoCounter todos={todos} />
      <CompletedTasksCounter todos={todos} />
    </div>
  );
}

const TodoCounter: React.FC<{ todos: Todo[] }> = ({ todos }) => {
  return (
    <div>
      <h2>Liczba zadań: {todos.length}</h2>
      <p></p>
    </div>
  );
}

const CompletedTasksCounter: React.FC<{ todos: Todo[] }> = ({ todos }) => {
  const completedTasks = todos.filter(task => task.completed).length;

  return (
    <div>
      <h2>Ukończone zadania: {completedTasks}</h2>
      <p></p>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2 className="text-2xl font-bold">O nas</h2>
      <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec mauris vitae velit mollis ullamcorper eu quis nunc. Donec lobortis, ex quis consequat placerat.</p>
    </div>
  );
}

function Contact() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Kontakt</h2>
      <p className="mt-4">Telefon: 123432432</p>
      <p>Email: hlaoooo@gmail.com</p>
      <p>Adres: </p>
    </div>
  );
}

function NotFound() {
  return <h2>Strona nie znaleziona</h2>;
}

export default TodoList;

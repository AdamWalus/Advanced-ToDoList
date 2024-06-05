import axios from 'axios';

const API_URL = 'http://localhost:3001'; 

export const fetchTodos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
  } catch (error) {
    console.error('Blad pocdzas pobierania listy:', error);
    return [];
  }
};

export const addTodo = async (text) => {
  try {
    const response = await axios.post(`${API_URL}/todos`, { text, completed: false });
    return response.data;
  } catch (error) {
    console.error('Blad podczas dodawania zadania:', error);
    return null;
  }
};


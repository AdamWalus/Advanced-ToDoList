import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTodos, addTodo } from './Api/Api';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

//asynchroniczne pobieranie listy zadan z serwera
export const fetchTodosAsync = createAsyncThunk<Todo[]>('todos/fetchTodos', async () => {
  const response = await fetchTodos();
  return response;
});

export const addTodoAsync = createAsyncThunk<Todo, string>('todos/addTodo', async (text) => {
  const response = await addTodo(text);
  return response;
});

//tworzy "kawałek" stanu do listy zadan 'todos'
const todosSlice = createSlice({
  name: 'todos',
  initialState: [] as Todo[],
  //reducers - definiuje akcje, które modyfikują toggleTodo oraz deleteTodo
  reducers: {
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      return state.filter(todo => todo.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosAsync.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        return action.payload;
      })
      .addCase(addTodoAsync.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.push(action.payload);
      });
  },
});

export const { toggleTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;

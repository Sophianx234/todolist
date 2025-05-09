import express, { Request, Response } from 'express';
import cors from 'cors';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let todos: Todo[] = [];
let nextId = 1;

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST new todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required and must be a string' });
  }

  const newTodo: Todo = {
    id: nextId++,
    text,
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT update todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;

  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const updatedTodo = {
    ...todos[todoIndex],
    ...(text !== undefined && { text }),
    ...(completed !== undefined && { completed })
  };

  todos[todoIndex] = updatedTodo;
  res.json(updatedTodo);
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos = todos.filter(todo => todo.id !== id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 
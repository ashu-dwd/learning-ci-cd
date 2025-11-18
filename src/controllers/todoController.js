/**
 * Controller functions for Todo REST API.
 * Responsible for HTTP status codes and response formatting.
 */

const todoService = require("../services/todoService");

/**
 * Get all todos
 */
const getTodos = (req, res) => {
  const todos = todoService.getTodos();
  res.json(todos);
};

/**
 * Get a todo by ID
 */
const getTodoById = (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const todo = todoService.getTodoById(id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });

  res.json(todo);
};

/**
 * Create a new todo
 */
const createTodo = (req, res) => {
  const { title } = req.body;
  if (typeof title !== "string" || !title.trim())
    return res.status(400).json({ error: "Title is required" });

  const newTodo = todoService.createTodo({ title: title.trim() });
  res.status(201).json(newTodo);
};

/**
 * Update an existing todo
 */
const updateTodo = (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const updates = {};
  if (typeof req.body.title === "string") updates.title = req.body.title.trim();
  if (typeof req.body.completed === "boolean")
    updates.completed = req.body.completed;

  const updatedTodo = todoService.updateTodo(id, updates);
  if (!updatedTodo) return res.status(404).json({ error: "Todo not found" });

  res.json(updatedTodo);
};

/**
 * Delete a todo
 */
const deleteTodo = (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const removed = todoService.deleteTodo(id);
  if (!removed) return res.status(404).json({ error: "Todo not found" });

  res.status(204).send();
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};

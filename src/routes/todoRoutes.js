/**
 * Todo routes definition.
 * Each route delegates to the corresponding controller function.
 */

const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

// GET /todos - List all todos
router.get("/", todoController.getTodos);

// GET /todos/:id - Get a single todo by ID
router.get("/:id", todoController.getTodoById);

// POST /todos - Create a new todo
router.post("/", todoController.createTodo);

// PUT /todos/:id - Update a todo by ID
router.put("/:id", todoController.updateTodo);

// DELETE /todos/:id - Delete a todo by ID
router.delete("/:id", todoController.deleteTodo);

module.exports = router;

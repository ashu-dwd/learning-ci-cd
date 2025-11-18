/**
 * In-memory storage for Todo items.
 * This abstraction allows us to easily swap with a database model in the future.
 */

let todos = [];
let currentId = 1;

/**
 * @typedef {Object} Todo
 * @property {number} id - Unique ID for the todo
 * @property {string} title - Todo description/title
 * @property {boolean} completed - Completion status
 */

module.exports = {
  getAll: () => todos,
  getById: (id) => todos.find((todo) => todo.id === id),
  create: ({ title }) => {
    const newTodo = { id: currentId++, title, completed: false };
    todos.push(newTodo);
    return newTodo;
  },
  update: (id, updates) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return null;
    if (typeof updates.title === "string") todo.title = updates.title;
    if (typeof updates.completed === "boolean")
      todo.completed = updates.completed;
    return todo;
  },
  delete: (id) => {
    const idx = todos.findIndex((todo) => todo.id === id);
    if (idx === -1) return false;
    todos.splice(idx, 1);
    return true;
  },
};

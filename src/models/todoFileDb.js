/**
 * File-based storage for Todo items, per user (by IP).
 * Each user's todos are stored under their IP in a single JSON file.
 */

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../../todos.json");

function readDb() {
  if (!fs.existsSync(DB_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch (e) {
    return {};
  }
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function getUserTodos(ip) {
  const db = readDb();
  return db[ip] || [];
}

function setUserTodos(ip, todos) {
  const db = readDb();
  db[ip] = todos;
  writeDb(db);
}

function getAll(ip) {
  return getUserTodos(ip);
}

function getById(ip, id) {
  return getUserTodos(ip).find((todo) => todo.id === id);
}

function create(ip, { title }) {
  const todos = getUserTodos(ip);
  const newId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
  const newTodo = { id: newId, title, completed: false };
  todos.push(newTodo);
  setUserTodos(ip, todos);
  return newTodo;
}

function update(ip, id, updates) {
  const todos = getUserTodos(ip);
  const idx = todos.findIndex((todo) => todo.id === id);
  if (idx === -1) return null;
  if (typeof updates.title === "string") todos[idx].title = updates.title;
  if (typeof updates.completed === "boolean")
    todos[idx].completed = updates.completed;
  setUserTodos(ip, todos);
  return todos[idx];
}

function remove(ip, id) {
  const todos = getUserTodos(ip);
  const idx = todos.findIndex((todo) => todo.id === id);
  if (idx === -1) return false;
  todos.splice(idx, 1);
  setUserTodos(ip, todos);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};

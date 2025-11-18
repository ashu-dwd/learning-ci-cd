/**
 * File-based user management for optional account creation and sync.
 * Stores users as { username, passwordHash, todos: [] }
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DB_PATH = path.join(__dirname, "../../users.json");

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

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function createUser(username, password) {
  const db = readDb();
  if (db[username]) return null;
  db[username] = {
    passwordHash: hashPassword(password),
    todos: [],
  };
  writeDb(db);
  return true;
}

function authenticate(username, password) {
  const db = readDb();
  const user = db[username];
  if (!user) return false;
  return user.passwordHash === hashPassword(password);
}

function getUserTodos(username) {
  const db = readDb();
  return db[username]?.todos || [];
}

function setUserTodos(username, todos) {
  const db = readDb();
  if (!db[username]) return false;
  db[username].todos = todos;
  writeDb(db);
  return true;
}

module.exports = {
  createUser,
  authenticate,
  getUserTodos,
  setUserTodos,
};

/**
 * Controller for authentication and user account management.
 * Supports: signup, login, logout, and todo migration from anonymous to user.
 */

const userDb = require("../models/userFileDb");

function getSessionUser(req) {
  return req.session && req.session.username;
}

exports.signup = (req, res) => {
  const { username, password } = req.body;
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password.trim()
  ) {
    return res.status(400).json({ error: "Username and password required" });
  }
  if (userDb.createUser(username.trim(), password.trim())) {
    req.session.username = username.trim();
    return res.status(201).json({ success: true });
  }
  return res.status(409).json({ error: "Username already exists" });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password.trim()
  ) {
    return res.status(400).json({ error: "Username and password required" });
  }
  if (userDb.authenticate(username.trim(), password.trim())) {
    req.session.username = username.trim();
    return res.json({ success: true });
  }
  return res.status(401).json({ error: "Invalid credentials" });
};

exports.logout = (req, res) => {
  if (req.session) req.session.destroy(() => {});
  res.json({ success: true });
};

exports.getCurrentUser = (req, res) => {
  if (getSessionUser(req)) {
    res.json({ username: getSessionUser(req) });
  } else {
    res.json({ username: null });
  }
};

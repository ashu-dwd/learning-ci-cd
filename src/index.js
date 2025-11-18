/**
 * Entry point for the Todo REST API using Express.js.
 * Scalable structure: routes/controllers/services/models.
 *
 * To run: `pnpm install` (if needed), then `node src/index.js`
 */

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

//unabling cors
app.use(cors());

// Enable parsing of JSON bodies
app.use(express.json());

// Session middleware for login state
app.use(
  session({
    secret: "todo_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true if using HTTPS
  })
);

// Serve static files from public/
app.use(express.static(path.join(__dirname, "../public")));

// Health check or welcome route
app.get("/", (req, res) => {
  res.json({
    message:
      "Todo API is running and This is the check that my ci cd pipeline is working",
  });
});

// Mount todo routes under /todos path
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

// Global error handler (catches thrown errors in routes/controllers)
app.use((err, req, res, next) => {
  // Customize as project grows for different error shapes/types
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Todo API server running on http://localhost:${PORT}`);
});

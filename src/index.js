/**
 * Entry point for the Todo REST API using Express.js.
 * Scalable structure: routes/controllers/services/models.
 *
 * To run: `pnpm install` (if needed), then `node src/index.js`
 */

const express = require("express");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable parsing of JSON bodies
app.use(express.json());

// Health check or welcome route
app.get("/", (req, res) => {
  res.json({ message: "Todo API is running" });
});

// Mount todo routes under /todos path
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

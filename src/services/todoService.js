/**
 * Service layer for Todo operations.
 * Abstracts business logic from controller and isolates model dependency.
 */

const todoModel = require("../models/todo");

module.exports = {
  /**
   * Get all todos
   * @returns {Array<Object>}
   */
  getTodos: () => {
    // Potential place for filtering, pagination, etc.
    return todoModel.getAll();
  },

  /**
   * Get a todo by ID
   * @param {number} id
   * @returns {Object|null}
   */
  getTodoById: (id) => {
    return todoModel.getById(id);
  },

  /**
   * Create a new todo
   * @param {Object} data
   * @param {string} data.title
   * @returns {Object}
   */
  createTodo: (data) => {
    // Business logic: could check for duplicates, length constraints, etc.
    return todoModel.create(data);
  },

  /**
   * Update a todo by ID
   * @param {number} id
   * @param {Object} updates
   * @returns {Object|null}
   */
  updateTodo: (id, updates) => {
    return todoModel.update(id, updates);
  },

  /**
   * Delete a todo by ID
   * @param {number} id
   * @returns {boolean}
   */
  deleteTodo: (id) => {
    return todoModel.delete(id);
  },
};

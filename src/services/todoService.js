/**
 * Service layer for Todo operations, per user (by IP).
 * Abstracts business logic from controller and isolates model dependency.
 */

const todoModel = require("../models/todoFileDb");

module.exports = {
  /**
   * Get all todos for a user
   * @param {string} ip
   * @returns {Array<Object>}
   */
  getTodos: (ip) => {
    return todoModel.getAll(ip);
  },

  /**
   * Get a todo by ID for a user
   * @param {string} ip
   * @param {number} id
   * @returns {Object|null}
   */
  getTodoById: (ip, id) => {
    return todoModel.getById(ip, id);
  },

  /**
   * Create a new todo for a user
   * @param {string} ip
   * @param {Object} data
   * @param {string} data.title
   * @returns {Object}
   */
  createTodo: (ip, data) => {
    return todoModel.create(ip, data);
  },

  /**
   * Update a todo by ID for a user
   * @param {string} ip
   * @param {number} id
   * @param {Object} updates
   * @returns {Object|null}
   */
  updateTodo: (ip, id, updates) => {
    return todoModel.update(ip, id, updates);
  },

  /**
   * Delete a todo by ID for a user
   * @param {string} ip
   * @param {number} id
   * @returns {boolean}
   */
  deleteTodo: (ip, id) => {
    return todoModel.delete(ip, id);
  },
};

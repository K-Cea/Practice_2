// src/models/User.js
const crypto = require('crypto');

class User {
  /**
   * @param {Object} params
   * @param {string} [params.id]
   * @param {string} params.username
   * @param {string} params.password - Hashed password
   * @param {string} [params.role='user'] - 'user' | 'admin'
   */
  constructor({ id, username, password, role = 'user' }) {
    this.id = id || `usr_${crypto.randomBytes(4).toString('hex')}`;
    this.username = username;
    this.password = password;
    this.role = role === 'admin' ? 'admin' : 'user';
  }

  // Sanitized view ensuring password is never exposed in JSON responses
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      role: this.role
    };
  }
}

// In-memory data store for standalone testing & prototype execution
const usersStore = [];

module.exports = {
  User,
  usersStore
};
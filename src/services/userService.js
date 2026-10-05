// src/services/userService.js
const crypto = require('crypto');
const { User, usersStore } = require('../models/User');

/**
 * Secure password hashing using Node's built-in crypto (requires zero npm packages)
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against the stored salt:hash string (ready for USR-04 login)
 */
function verifyPassword(password, storedHash) {
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;
  const hashToVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return originalHash === hashToVerify;
}

/**
 * [USR-03] Service: Register a new user with password hashing
 * @param {Object} payload - { username, password, role }
 * @returns {Object} Sanitized user object without password
 */
async function registerUser({ username, password, role = 'user' }) {
  // 1. Check if username already exists
  const userExists = usersStore.find(
    (u) => u.username.toLowerCase() === username.toLowerCase().trim()
  );
  if (userExists) {
    const error = new Error('Username is already taken.');
    error.statusCode = 400;
    error.code = 'USER_EXISTS';
    throw error;
  }

  // 2. Hash the password
  const hashedPassword = hashPassword(password);

  // 3. Create model instance and save to store
  const newUser = new User({
    username: username.trim(),
    password: hashedPassword,
    role: role || 'user'
  });

  usersStore.push(newUser);

  // 4. Return sanitized user data (id, username, role)
  return newUser.toJSON();
}

module.exports = {
  registerUser,
  hashPassword,
  verifyPassword
};
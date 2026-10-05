// src/services/userService.js
const crypto = require('crypto');
const { User, usersStore } = require('../models/User');

/**
 * Secure password hashing using Node built-in crypto (zero external npm dependencies)
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against the stored salt:hash string
 */
function verifyPassword(password, storedHash) {
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;
  const hashToVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return originalHash === hashToVerify;
}

/**
 * Generates a session / bearer token
 */
function generateToken(user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, username: user.username, role: user.role })).toString('base64');
  const signature = crypto.randomBytes(16).toString('hex');
  return `sprint_${payload}.${signature}`;
}

/**
 * [USR-03] Service: Register a new user
 */
async function registerUser({ username, password, role = 'user' }) {
  const userExists = usersStore.find(
    (u) => u.username.toLowerCase() === username.toLowerCase().trim()
  );
  if (userExists) {
    const error = new Error('Username is already taken.');
    error.statusCode = 400;
    error.code = 'USER_EXISTS';
    throw error;
  }

  const hashedPassword = hashPassword(password);
  const newUser = new User({
    username: username.trim(),
    password: hashedPassword,
    role: role || 'user'
  });

  usersStore.push(newUser);
  return newUser.toJSON();
}

/**
 * [USR-04] Service: Authenticate user, verify password, return token & sanitized profile
 * @param {Object} payload - { username, password }
 * @returns {Object} { token, user }
 */
async function authenticateUser({ username, password }) {
  // 1. Locate user by username
  const user = usersStore.find(
    (u) => u.username.toLowerCase() === username.toLowerCase().trim()
  );

  // 2. Reject if user does not exist or password does not match
  if (!user || !verifyPassword(password, user.password)) {
    const error = new Error('Invalid username or password.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  // 3. Issue token
  const token = generateToken(user);

  return {
    token,
    user: user.toJSON()
  };
}

module.exports = {
  registerUser,
  authenticateUser,
  hashPassword,
  verifyPassword
};
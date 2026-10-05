// src/validators/userValidator.js

/**
 * Validates registration payload:
 * - username: required, non-empty string
 * - password: required, minimum 6 characters
 * - role: optional ('user' or 'admin')
 */
function validateRegisterInput(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Request body is missing.'] };
  }

  const { username, password, role } = data;

  if (!username || typeof username !== 'string' || !username.trim()) {
    errors.push('Username is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (role && !['user', 'admin'].includes(role)) {
    errors.push('Role must be either "user" or "admin".');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates login payload:
 * - username: required
 * - password: required
 */
function validateLoginInput(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Request body is missing.'] };
  }

  const { username, password } = data;

  if (!username || typeof username !== 'string' || !username.trim()) {
    errors.push('Username is required.');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateRegisterInput,
  validateLoginInput
};

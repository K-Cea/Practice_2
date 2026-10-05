// src/controllers/userController.js
const { validateRegisterInput, validateLoginInput } = require('../validators/userValidator');
const { registerUser, authenticateUser } = require('../services/userService');

/**
 * [USR-05] Handle User Registration
 * POST /api/register
 */
async function register(req, res) {
  try {
    // 1. Validate payload
    const validation = validateRegisterInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_FAILED',
        message: validation.errors.join(' ')
      });
    }

    // 2. Delegate to business logic service
    const user = await registerUser(req.body);

    // 3. Return standardized 201 Created response
    return res.status(201).json({
      success: true,
      data: user,
      message: 'User registered successfully'
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An error occurred during registration.'
    });
  }
}

/**
 * [USR-05] Handle User Login
 * POST /api/login
 */
async function login(req, res) {
  try {
    // 1. Validate payload
    const validation = validateLoginInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_FAILED',
        message: validation.errors.join(' ')
      });
    }

    // 2. Authenticate credentials
    const authData = await authenticateUser(req.body);

    // 3. Return standardized 200 OK response
    return res.status(200).json({
      success: true,
      data: authData,
      message: 'Login successful'
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An error occurred during authentication.'
    });
  }
}

module.exports = {
  register,
  login
};
const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getProjects, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');
const { validateProjectInput } = require('../validators/projectValidator');

// [PROJ-06] Setup required routes
router.post('/', validateProjectInput, createProject);
router.get('/', getProjects);

// Additional CRUD routes
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
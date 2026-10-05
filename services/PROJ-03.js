const Project = require('../models/Project');

// [PROJ-03] Create a new project
const createProjectService = async (projectData) => {
  const project = new Project(projectData);
  return await project.save();
};

// [PROJ-04] Fetch all projects and populate/include their tasks
const getAllProjectsWithTasksService = async () => {
  return await Project.find().populate('tasks');
};

// Update project helper for CRUD
const updateProjectService = async (id, updateData) => {
  return await Project.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete project helper for CRUD
const deleteProjectService = async (id) => {
  return await Project.findByIdAndDelete(id);
};

module.exports = {
  createProjectService,
  getAllProjectsWithTasksService,
  updateProjectService,
  deleteProjectService
};
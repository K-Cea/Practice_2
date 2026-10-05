const validateProjectInput = (req, res, next) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error: Project name is required.' 
    });
  }
  next();
};

module.exports = { validateProjectInput };
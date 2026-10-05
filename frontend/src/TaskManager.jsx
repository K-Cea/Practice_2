import React, { useState, useEffect } from 'react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch tasks from backend on load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Backend connection error (Server may not be running yet).');
    }
  };

  // Create task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!title || !description) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });

      if (!response.ok) throw new Error('Failed to create task');
      
      setMessage('Task created successfully!');
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      setError('Error creating task: ' + err.message);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete task');
      fetchTasks();
    } catch (err) {
      setError('Error deleting task: ' + err.message);
    }
  };

  // Save edit
  const handleSaveEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDesc })
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      setError('Error updating task: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Task Manager (Connected to API)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {/* Task Creation Form */}
      <form onSubmit={handleCreateTask} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px' }}>
        <h3>Create New Task</h3>
        <div>
          <label>Title: </label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <br />
        <div>
          <label>Description: </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <br />
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <h3>Task List</h3>
      {tasks.length === 0 ? (
        <p>No tasks found or backend is offline.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id || task._id} style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px' }}>
              {editingId === (task.id || task._id) ? (
                <div>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <br /><br />
                  <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                  <br /><br />
                  <button onClick={() => handleSaveEdit(task.id || task._id)}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ marginLeft: '5px' }}>Cancel</button>
                </div>
              ) : (
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <button onClick={() => {
                    setEditingId(task.id || task._id);
                    setEditTitle(task.title);
                    setEditDesc(task.description);
                  }}>Edit</button>
                  <button onClick={() => handleDelete(task.id || task._id)} style={{ marginLeft: '5px', color: 'red' }}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
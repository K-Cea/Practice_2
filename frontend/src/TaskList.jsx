import React, { useState } from 'react';

export default function TaskList() {
  // Dummy tasks for UI testing
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Sample Task 1', description: 'This is the first test task.' },
    { id: 2, title: 'Sample Task 2', description: 'This is the second test task.' }
  ]);
  
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Delete a task
  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Start editing a task
  const handleEditClick = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description);
  };

  // Save edited task
  const handleSaveEdit = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, title: editTitle, description: editDesc } : task
    ));
    setEditingId(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Task List</h2>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px' }}>
              {editingId === task.id ? (
                <div>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)} 
                  />
                  <br /><br />
                  <textarea 
                    value={editDesc} 
                    onChange={(e) => setEditDesc(e.target.value)} 
                  />
                  <br /><br />
                  <button onClick={() => handleSaveEdit(task.id)}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ marginLeft: '5px' }}>Cancel</button>
                </div>
              ) : (
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <button onClick={() => handleEditClick(task)}>Edit</button>
                  <button onClick={() => handleDelete(task.id)} style={{ marginLeft: '5px', color: 'red' }}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
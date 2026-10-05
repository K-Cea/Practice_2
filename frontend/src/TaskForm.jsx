import React, { useState } from 'react';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!title || !description) {
      setError('Please fill in all fields.');
      return;
    }

    setMessage('Task created successfully in UI!');
    setTitle('');
    setDescription('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create Task</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        <br />
        <div>
          <label>Description: </label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>
        <br />
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
}
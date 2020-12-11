import React, { useState } from 'react';
import { Input } from 'antd';
import client from '../utils/api-client';
import { ErrorBoundary } from 'react-error-boundary';

const { Search } = Input;

const TodoForm = ({ auth, ErrorFallback, onDispatch, onRun, tasks }) => {
  const [addedTask, setAddedTask] = useState('');

  const handleAddedTask = (e) => {
    setAddedTask(e.target.value);
  };

  const handleAdd = async (value) => {
    if (value === '') return;

    const payload = await onRun(client.addTask(auth.token, value));
    setAddedTask('');
    onDispatch({ type: 'ADD', payload });
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setAddedTask('')}
      resetKeys={[addedTask]}
    >
      <Search
        disabled={Boolean(!auth)}
        enterButton="Add"
        onChange={handleAddedTask}
        onSearch={handleAdd}
        placeholder="Add a task"
        value={addedTask}
      />
    </ErrorBoundary>
  );
};

export default TodoForm;

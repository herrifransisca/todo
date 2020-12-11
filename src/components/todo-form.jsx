import React, { useState } from 'react';
import { Input } from 'antd';
import client from '../utils/api-client';
import { ErrorBoundary } from 'react-error-boundary';

const { Search } = Input;

const TodoForm = ({ auth, ErrorFallback, onDispatch, onError, tasks }) => {
  const [addedTask, setAddedTask] = useState('');

  const handleAddedTask = (e) => {
    setAddedTask(e.target.value);
  };

  const onAdd = async (value) => {
    if (value === '') return;

    try {
      const {
        data: { data: result },
      } = await client.addTask(auth.token, value);
      setAddedTask('');
      onDispatch({ type: 'ADD', payload: result });
    } catch (error) {
      onError(error);
    }
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
        onSearch={onAdd}
        placeholder="Add a task"
        value={addedTask}
      />
    </ErrorBoundary>
  );
};

export default TodoForm;

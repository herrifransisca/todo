import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import TodoList from './todo-list';

const TodoLists = ({ auth, ErrorFallback, onData, onError, tasks }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => onData([])}
      resetKeys={[tasks]}
    >
      <TodoList
        auth={auth}
        onData={onData}
        onError={onError}
        completed={false}
        tasks={tasks}
      />
      <TodoList
        auth={auth}
        onData={onData}
        onError={onError}
        completed={true}
        tasks={tasks}
      />
    </ErrorBoundary>
  );
};

export default TodoLists;

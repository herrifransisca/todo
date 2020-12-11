import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import TodoList from './todo-list';

const TodoLists = ({ auth, ErrorFallback, onDispatch, onRun, tasks }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => onDispatch([])}
      resetKeys={[tasks]}
    >
      <TodoList
        auth={auth}
        onDispatch={onDispatch}
        onRun={onRun}
        completed={false}
        tasks={tasks}
      />
      <TodoList
        auth={auth}
        onDispatch={onDispatch}
        onRun={onRun}
        completed={true}
        tasks={tasks}
      />
    </ErrorBoundary>
  );
};

export default TodoLists;

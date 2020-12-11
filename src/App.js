import React, { useEffect, useReducer } from 'react';
import './App.css';
import { Layout, Space, Alert, Empty, Spin } from 'antd';
import { useLocalStorageState } from './utils';
import client from './utils/api-client';
import { useAsync } from './utils/hooks';
import TodoForm from './components/todo-form';
import TodoLists from './components/todo-lists';
import TopHeader from './components/top-header';
import AppSider from './components/app-sider';

const { Content } = Layout;

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'POPULATE':
      return { ...state, tasks: action.payload };

    case 'ADD':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'DELETE':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload._id),
      };

    case 'EDIT': {
      const tasksCopy = [...state.tasks];
      const index = tasksCopy.indexOf(action.item);
      tasksCopy[index] = { ...action.item };
      tasksCopy[index].description = action.editedTask;
      return { ...state, tasks: tasksCopy };
    }

    case 'COMPLETE': {
      const tasksCopy = [...state.tasks];
      const index = tasksCopy.indexOf(action.item);
      tasksCopy[index] = { ...action.item };
      tasksCopy[index].completed = true;
      return { ...state, tasks: tasksCopy };
    }

    case 'INCOMPLETE': {
      const tasksCopy = [...state.tasks];
      const index = tasksCopy.indexOf(action.item);
      tasksCopy[index] = { ...action.item };
      tasksCopy[index].completed = false;
      return { ...state, tasks: tasksCopy };
    }

    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
};

const App = () => {
  const { error, isError, isIdle, isLoading, isSuccess, run } = useAsync();
  const [state, dispatch] = useReducer(taskReducer, { tasks: [] });
  const [auth, setAuth] = useLocalStorageState('auth-todo-app', null);

  useEffect(() => {
    if (!auth) return;

    const populateTasks = async () => {
      const payload = await run(client.getTasks(auth.token));
      dispatch({ type: 'POPULATE', payload });
    };
    populateTasks();
  }, [run, auth]);

  const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <Alert message="Error" description={error.message} type="error" showIcon />
  );

  return (
    <Layout>
      <AppSider auth={auth} onAuth={setAuth} />
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <TopHeader />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div className="site-layout-background" style={{ padding: 24 }}>
            {isIdle ? <Empty /> : null}
            {isLoading ? <Spin /> : null}
            {isError ? (
              <div css={{ color: 'red' }}>
                <p>There was an error:</p>
                <pre>{error.message}</pre>
              </div>
            ) : null}
            {isSuccess ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <TodoForm
                  auth={auth}
                  ErrorFallback={ErrorFallback}
                  onDispatch={dispatch}
                  onRun={run}
                  tasks={state.tasks}
                />
                <TodoLists
                  auth={auth}
                  ErrorFallback={ErrorFallback}
                  onDispatch={dispatch}
                  onRun={run}
                  tasks={state.tasks}
                />
              </Space>
            ) : null}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

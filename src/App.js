import React, { useEffect } from 'react';
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

const App = () => {
  const {
    data: tasks,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    setData,
    setError,
    run,
  } = useAsync({
    error: null,
    status: 'idle',
    data: null,
  });
  const [auth, setAuth] = useLocalStorageState('auth-todo-app', null);

  useEffect(() => {
    if (!auth) return;
    run(client.getTasks(auth.token));
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
                  onData={setData}
                  onError={setError}
                  tasks={tasks}
                />
                <TodoLists
                  auth={auth}
                  ErrorFallback={ErrorFallback}
                  onData={setData}
                  onError={setError}
                  tasks={tasks}
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

import React, { useEffect, useState } from 'react';
import './App.css';
import {
  Button,
  Layout,
  Menu,
  PageHeader,
  Space,
  Alert,
  Empty,
  Spin,
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import LoginForm from './components/login-form';
import RegisterForm from './components/register-form';
import { useLocalStorageState } from './utils';
import client from './utils/api-client';
import { useAsync } from './utils/hooks';
import TodoForm from './components/todo-form';
import TodoLists from './components/todo-lists';

const { Header, Content, Sider } = Layout;

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
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  useEffect(() => {
    if (!auth) return;
    run(client.getTasks(auth.token));
  }, [run, auth]);

  const handleLogin = (values) => {
    setIsLoginModalVisible(false);
    setAuth(values);
  };

  const handleLogout = () => {
    setAuth(null);
  };

  const handleRegister = (values) => {
    setIsRegisterModalVisible(false);
    setAuth(values);
    // TODO: not tested yet. because cors problem
  };

  const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <Alert message="Error" description={error.message} type="error" showIcon />
  );

  return (
    <Layout>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div className="logo">To Do</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Tasks
          </Menu.Item>
        </Menu>

        <div style={{ marginTop: '64px' }}>
          <Space
            direction="vertical"
            style={{ width: '100%', marginTop: '16px' }}
          >
            {!auth && (
              <>
                <Alert
                  message="Please login/register to start using this todo-app!"
                  type="info"
                  showIcon
                />
                <Alert
                  message="Register form not working"
                  type="error"
                  showIcon
                />
                <Alert
                  message="Please use this email/password to login: illusion@gmail.com/12345678"
                  type="info"
                  showIcon
                />
                <Button
                  onClick={() => setIsLoginModalVisible(true)}
                  style={{ width: '100%' }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => setIsRegisterModalVisible(true)}
                  style={{ width: '100%' }}
                >
                  Register
                </Button>
              </>
            )}

            {auth && (
              <>
                <div style={{ color: '#fff' }}>
                  Username: {auth ? auth.user.name : null}
                </div>
                <div style={{ color: '#fff' }}>
                  Email: {auth ? auth.user.email : null}
                </div>
                <Button onClick={handleLogout} style={{ width: '100%' }}>
                  Logout
                </Button>
              </>
            )}
          </Space>

          <LoginForm
            onCancel={() => setIsLoginModalVisible(false)}
            onLogin={handleLogin}
            visible={isLoginModalVisible}
          />
          <RegisterForm
            onCancel={() => setIsRegisterModalVisible(false)}
            onLogin={handleRegister}
            visible={isRegisterModalVisible}
          />
        </div>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header style={{ padding: 0 }} className="site-layout-background">
          <PageHeader
            onBack={() => null}
            title="Tasks"
            backIcon={<HomeOutlined />}
          />
          ,
        </Header>
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

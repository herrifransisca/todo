import React, { useState } from 'react';
import { Alert, Button, Layout, Menu, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import LoginForm from '../components/login-form';
import RegisterForm from '../components/register-form';

const { Sider } = Layout;

const AppSider = ({ auth, onAuth }) => {
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const handleLogin = (values) => {
    setIsLoginModalVisible(false);
    onAuth(values);
  };

  const handleLogout = () => {
    onAuth(null);
  };

  const handleRegister = (values) => {
    setIsRegisterModalVisible(false);
    onAuth(values);
    // TODO: not tested yet. because cors problem
  };

  return (
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
  );
};

export default AppSider;

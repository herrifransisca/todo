import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Button,
  Modal,
  Input,
  Layout,
  List,
  Menu,
  PageHeader,
  Space,
  Typography,
  Alert,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import axios from "axios";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;
const { Search } = Input;

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [addedTask, setAddedTask] = useState("");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const populateTasks = async () => {
    const {
      data: { data },
    } = await axios.get("https://api-nodejs-todolist.herokuapp.com/task", {
      headers: {
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmEzNGUwNDljZTU3ZTAwMTdhMzdkOWQiLCJpYXQiOjE2MDQ1Mzc5NTJ9.dzmuR0DWdEo4_nrhLmZegG5pQiSV0qXGLj8-hhPDWKY",
      },
    });
    setTasks(data);
    // TODO: what value returned when tasks is empty ? should I setTasks with [] if value is empty ?
  };

  useEffect(() => {
    populateTasks();
  }, []);

  const handleLogin = (values) => {
    setIsLoginModalVisible(false);
    setUser(values.user);
    setToken(values.token);
  };

  const handleLogout = (values) => {
    setUser(null);
    setToken(null);
  };

  const handleRegister = (values) => {
    setIsRegisterModalVisible(false);
    setUser(values.user);
    setToken(values.token);
  };

  const handleAddedTask = (e) => {
    setAddedTask(e.target.value);
  };

  const onComplete = async (item) => {
    const originalTasks = [...tasks];

    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    tasksCopy[index] = { ...item };
    tasksCopy[index].completed = true;
    setTasks(tasksCopy);

    try {
      await axios.put(
        `https://api-nodejs-todolist.herokuapp.com/task/${item._id}`,
        {
          completed: true,
        },
        {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmEzNGUwNDljZTU3ZTAwMTdhMzdkOWQiLCJpYXQiOjE2MDQ1Mzc5NTJ9.dzmuR0DWdEo4_nrhLmZegG5pQiSV0qXGLj8-hhPDWKY",
          },
        }
      );
    } catch (error) {
      setTasks(originalTasks);
      console.log("Error when completing task", error);
    }
  };

  const onIncomplete = async (item) => {
    const originalTasks = [...tasks];

    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    tasksCopy[index] = { ...item };
    tasksCopy[index].completed = false;
    setTasks(tasksCopy);

    try {
      await axios.put(
        `https://api-nodejs-todolist.herokuapp.com/task/${item._id}`,
        {
          completed: false,
        },
        {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmEzNGUwNDljZTU3ZTAwMTdhMzdkOWQiLCJpYXQiOjE2MDQ1Mzc5NTJ9.dzmuR0DWdEo4_nrhLmZegG5pQiSV0qXGLj8-hhPDWKY",
          },
        }
      );
    } catch (error) {
      setTasks(originalTasks);
      console.log("Error when incompleting task", error);
    }
  };

  const onAdd = async (value) => {
    if (value === "") return;

    try {
      const {
        data: { data },
      } = await axios.post(
        "https://api-nodejs-todolist.herokuapp.com/task",
        {
          description: value,
        },
        {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmEzNGUwNDljZTU3ZTAwMTdhMzdkOWQiLCJpYXQiOjE2MDQ1Mzc5NTJ9.dzmuR0DWdEo4_nrhLmZegG5pQiSV0qXGLj8-hhPDWKY",
          },
        }
      );
      setAddedTask("");
      setTasks([...tasks, data]);
    } catch (error) {
      console.log("Error when adding a new task", error);
    }
  };

  const onEdit = async (item, editedTask) => {
    const originalTask = [...tasks];

    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    tasksCopy[index] = { ...item };
    tasksCopy[index].description = editedTask;
    setTasks(tasksCopy);

    try {
      await axios.put(
        `https://api-nodejs-todolist.herokuapp.com/task/${item._id}`,
        {
          description: editedTask,
        },
        {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmEzNGUwNDljZTU3ZTAwMTdhMzdkOWQiLCJpYXQiOjE2MDQ1Mzc5NTJ9.dzmuR0DWdEo4_nrhLmZegG5pQiSV0qXGLj8-hhPDWKY",
          },
        }
      );
    } catch (error) {
      setTasks(originalTask);
      console.log("Error when changing task", error);
    }
  };

  const onDelete = async (item) => {
    const originalTasks = [...tasks];
    setTasks(tasks.filter((t) => t._id !== item._id));

    try {
      await axios.delete(
        `https://api-nodejs-todolist.herokuapp.com/task/${item._id}`,
        {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmEzNGUwNDljZTU3ZTAwMTdhMzdkOWQiLCJpYXQiOjE2MDQ1Mzc5NTJ9.dzmuR0DWdEo4_nrhLmZegG5pQiSV0qXGLj8-hhPDWKY",
          },
        }
      );
    } catch (error) {
      setTasks(originalTasks);
      console.log("Error when deleting task", error);
    }
  };

  return (
    <Layout>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
        }}
      >
        <div className="logo">To Do</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Tasks
          </Menu.Item>
        </Menu>

        <div style={{ marginTop: "64px" }}>
          <Space
            direction="vertical"
            style={{ width: "100%", marginTop: "16px" }}
          >
            {!user && (
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
                  style={{ width: "100%" }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => setIsRegisterModalVisible(true)}
                  style={{ width: "100%" }}
                >
                  Register
                </Button>
              </>
            )}

            {user && (
              <>
                <div style={{ color: "#fff" }}>
                  Username: {user ? user.name : null}
                </div>
                <div style={{ color: "#fff" }}>
                  Email: {user ? user.email : null}
                </div>
                <Button onClick={handleLogout} style={{ width: "100%" }}>
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
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div className="site-layout-background" style={{ padding: 24 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Search
                enterButton="Add"
                onChange={handleAddedTask}
                onSearch={onAdd}
                placeholder="Add a task"
                value={addedTask}
              />
              <List
                header={
                  <Text strong>
                    Pending ({tasks.filter((t) => t.completed === false).length}
                    )
                  </Text>
                }
                dataSource={tasks.filter((t) => t.completed === false)}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key="complete"
                        onClick={() => onComplete(item)}
                        type="link"
                      >
                        Complete
                      </Button>,
                      <Button
                        key="delete"
                        onClick={() => onDelete(item)}
                        type="link"
                      >
                        Delete
                      </Button>,
                    ]}
                  >
                    <Typography.Paragraph
                      editable={{
                        onChange: (editedTask) => onEdit(item, editedTask),
                      }}
                    >
                      {item.description}
                    </Typography.Paragraph>
                  </List.Item>
                )}
              />
              <List
                header={
                  <Text strong>
                    Completed (
                    {tasks.filter((t) => t.completed === true).length})
                  </Text>
                }
                dataSource={tasks.filter((t) => t.completed === true)}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key="incomplete"
                        onClick={() => onIncomplete(item)}
                        type="link"
                      >
                        Incomplete
                      </Button>,
                      <Button
                        key="delete"
                        onClick={() => onDelete(item)}
                        type="link"
                      >
                        Delete
                      </Button>,
                    ]}
                  >
                    <Text delete>
                      <Typography.Paragraph
                        editable={{
                          onChange: (editedTask) => onEdit(item, editedTask),
                        }}
                      >
                        {item.description}
                      </Typography.Paragraph>
                    </Text>
                  </List.Item>
                )}
              />
            </Space>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

import React, { useEffect, useReducer, useState } from "react";
import "./App.css";
import {
  Button,
  Input,
  Layout,
  Menu,
  PageHeader,
  Space,
  Alert,
  Empty,
  Spin,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import axios from "axios";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import { useLocalStorageState } from "./utils";
import TodoList from "./components/todo-list";
import { ErrorBoundary } from "react-error-boundary";

const { Header, Content, Sider } = Layout;
const { Search } = Input;

const tasksReducer = (state, newState) => newState;

const App = () => {
  const [state, setState] = useReducer(tasksReducer, {
    status: "idle",
    tasks: null,
    error: null,
  });
  const { status, tasks, error } = state;

  const [addedTask, setAddedTask] = useState("");
  const [auth, setAuth] = useLocalStorageState("auth-todo-app", null);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  useEffect(() => {
    if (!auth) return;
    setState({ status: "pending" });
    const populateTasks = async () => {
      try {
        const {
          data: { data },
        } = await axios.get("https://api-nodejs-todolist.herokuapp.com/task", {
          headers: {
            Authorization: auth.token,
          },
        });
        setState({ status: "resolved", tasks: data });
        // TODO: what value returned when tasks is empty ? should I setTasks with [] if value is empty ?
      } catch (error) {
        setState({ status: "rejected", error });
      }
    };
    populateTasks();
  }, [auth]);

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

  const handleAddedTask = (e) => {
    setAddedTask(e.target.value);
  };

  const onComplete = async (item) => {
    const originalTasks = [...tasks];

    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    tasksCopy[index] = { ...item };
    tasksCopy[index].completed = true;
    setState({ tasks: tasksCopy });

    try {
      await axios.put(
        `https://api-nodejs-todolist.herokuapp.com/task/${item._id}`,
        {
          completed: true,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
    } catch (error) {
      setState({ tasks: originalTasks });
      console.log("Error when completing task", error);
      throw error;
    }
  };

  const onIncomplete = async (item) => {
    const originalTasks = [...tasks];

    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    tasksCopy[index] = { ...item };
    tasksCopy[index].completed = false;
    setState({ tasks: tasksCopy });

    try {
      await axios.put(
        `https://api-nodejs-todolist.herokuapp.com/task/${item._id}`,
        {
          completed: false,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
    } catch (error) {
      setState({ tasks: originalTasks });
      console.log("Error when incompleting task", error);
      throw error;
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
            Authorization: auth.token,
          },
        }
      );
      setAddedTask("");
      setState({ tasks: [...tasks, data] });
    } catch (error) {
      console.log("Error when adding a new task", error);
      throw error;
    }
  };

  const onEdit = async (item, editedTask) => {
    const originalTask = [...tasks];

    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    tasksCopy[index] = { ...item };
    tasksCopy[index].description = editedTask;
    setState({ tasks: tasksCopy });

    try {
      await axios.put(
        `https://api-nodejs-todolist.herokuapp.com/task/${item._id}`,
        {
          description: editedTask,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
    } catch (error) {
      setState({ tasks: originalTask });
      console.log("Error when changing task", error);
      throw error;
    }
  };

  const onDelete = async (item) => {
    const originalTasks = [...tasks];
    setState({ tasks: tasks.filter((t) => t._id !== item._id) });

    try {
      await axios.delete(
        `https://api-nodejs-todolist.herokuapp.com/task/${item._id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
    } catch (error) {
      setState({ tasks: originalTasks });
      console.log("Error when deleting task", error);
      throw error;
    }
  };

  const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <Alert message="Error" description={error.message} type="error" showIcon />
  );

  if (status === "idle") return <Empty />;
  if (status === "pending") return <Spin />;
  if (status === "rejected") throw error;

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

            {auth && (
              <>
                <div style={{ color: "#fff" }}>
                  Username: {auth ? auth.user.name : null}
                </div>
                <div style={{ color: "#fff" }}>
                  Email: {auth ? auth.user.email : null}
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
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => setAddedTask("")}
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
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => setState({ tasks: [] })}
                resetKeys={[tasks]}
              >
                <TodoList
                  completed={false}
                  tasks={tasks}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
                <TodoList
                  completed={true}
                  tasks={tasks}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onIncomplete={onIncomplete}
                />
              </ErrorBoundary>
            </Space>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

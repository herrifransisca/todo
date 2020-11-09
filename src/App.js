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
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorageState } from "./utils";
import axios from "axios";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;
const { Search } = Input;

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [addedTask, setAddedTask] = useState("");
  // const [user, setUser] = useState(null);
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
    console.log("useEffect", data);
    setTasks(data);
    // TODO: what value returned when tasks is empty ? should I setTasks with [] if value is empty ?
  };

  useEffect(() => {
    populateTasks();
  }, []);

  const handleAddedTask = (e) => {
    setAddedTask(e.target.value);
  };

  const onComplete = (item) => {
    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    // #1
    tasksCopy[index] = { ...item };
    tasksCopy[index].status = "completed";
    // console.log("tasksCopy#1", tasksCopy);

    // #2- by changing item status, will it effect "tasks" ?
    // item.status = "Completed";
    // console.log("item", item);
    // tasksCopy[index] = { ...item };
    // console.log("tasksCopy#2", tasksCopy);

    setTasks(tasksCopy);
  };

  const onIncomplete = (item) => {
    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    tasksCopy[index] = { ...item };
    tasksCopy[index].status = "pending";
    setTasks(tasksCopy);
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
    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    tasksCopy[index] = { ...item };
    tasksCopy[index].task = editedTask;
    setTasks(tasksCopy);

    // api
    try {
      const result = await axios.put(
        "https://api-nodejs-todolist.herokuapp.com/task/5fa35b8c9ce57e0017a37dc3",
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
      console.log("api-edit-result", result);
    } catch (error) {
      console.log("api-edit-error", error);
    }
  };

  const onDelete = async (item) => {
    setTasks(tasks.filter((t) => t.id !== item.id));

    // api
    try {
      const result = await axios.delete(
        "https://api-nodejs-todolist.herokuapp.com/task/5fa35b8c9ce57e0017a37dc3",
        {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmEzNGUwNDljZTU3ZTAwMTdhMzdkOWQiLCJpYXQiOjE2MDQ1Mzc5NTJ9.dzmuR0DWdEo4_nrhLmZegG5pQiSV0qXGLj8-hhPDWKY",
          },
        }
      );
      console.log("api-delete-result", result);
    } catch (error) {
      console.log("api-delete-error", error);
    }
  };

  const showRegisterModal = () => {
    setIsRegisterModalVisible(true);
  };

  const handleOkRegisterModal = (e) => {
    setIsRegisterModalVisible(false);
  };

  const handleCancelRegisterModal = (e) => {
    setIsRegisterModalVisible(false);
  };

  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  const handleOkLoginModal = (e) => {
    setIsLoginModalVisible(false);
  };

  const handleCancelLoginModal = (e) => {
    setIsLoginModalVisible(false);
  };

  const handleGetTasks = async () => {
    // const result = await axios.get(
    //   'https://api-nodejs-todolist.herokuapp.com/task',
    //   {
    //     origin: req.body.origin,
    //     destination: req.body.destination,
    //     weight: req.body.weight,
    //     courier: req.body.courier,
    //   },
    //   {
    //     headers: {
    //       key: config.get('rajaongkirApiKey'),
    //     },
    //   }
    // );

    const { data } = await axios.get(
      "https://api-nodejs-todolist.herokuapp.com/task",
      {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmEzNGUwNDljZTU3ZTAwMTdhMzdkOWQiLCJpYXQiOjE2MDQ1Mzc5NTJ9.dzmuR0DWdEo4_nrhLmZegG5pQiSV0qXGLj8-hhPDWKY",
        },
      }
    );

    console.log("result", data.data);
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

        <div style={{ marginTop: "160px" }}>
          <div style={{ color: "#fff" }}>
            {/* Username: {user ? user.name : null} */}
            Username: Illusion
          </div>
          {/* <div style={{ color: "#fff" }}>Email: {user ? user.email : null}</div> */}
          <div style={{ color: "#fff" }}>Email: illusion@gmail.com</div>

          <Space
            direction="vertical"
            style={{ width: "100%", marginTop: "16px" }}
          >
            <Button onClick={showRegisterModal} style={{ width: "100%" }}>
              Register
            </Button>
            <Button onClick={showLoginModal} style={{ width: "100%" }}>
              Login
            </Button>
            <Button onClick={handleGetTasks} style={{ width: "100%" }}>
              Get Tasks
            </Button>
          </Space>

          <Modal
            title="Register"
            visible={isRegisterModalVisible}
            onOk={handleOkRegisterModal}
            onCancel={handleCancelRegisterModal}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>

          <Modal
            title="Login"
            visible={isLoginModalVisible}
            onOk={handleOkLoginModal}
            onCancel={handleCancelLoginModal}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
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
                    ]}
                  >
                    <Text delete>{item.description}</Text>
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

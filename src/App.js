import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Button,
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

const { Header, Content, Sider } = Layout;
const { Text } = Typography;
const { Search } = Input;

const App = () => {
  const [tasks, setTasks] = useLocalStorageState("tasks", []);
  const [addedTask, setAddedTask] = useState("");

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

  const onAdd = (value) => {
    setAddedTask("");

    const newTasks = [
      ...tasks,
      {
        id: uuidv4(),
        task: value,
        status: "pending",
      },
    ];
    setTasks(newTasks);
  };

  const onEdit = (item, editedTask) => {
    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    tasksCopy[index] = { ...item };
    tasksCopy[index].task = editedTask;
    setTasks(tasksCopy);
  };

  const onDelete = (item) => {
    const newTasks = tasks.filter((t) => t.id !== item.id);
    setTasks(tasks.filter((t) => t.id !== item.id));
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
                    Pending (
                    {tasks.filter((t) => t.status === "pending").length})
                  </Text>
                }
                dataSource={tasks.filter((t) => t.status === "pending")}
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
                      {item.task}
                    </Typography.Paragraph>
                  </List.Item>
                )}
              />
              <List
                header={<Text strong>Completed</Text>}
                dataSource={tasks.filter((t) => t.status === "completed")}
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
                    <Text delete>{item.task}</Text>
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

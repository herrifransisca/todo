import { Button, List, Typography } from 'antd';
import React from 'react';
import client from '../utils/api-client';

const { Text } = Typography;

const TodoList = ({ auth, completed, tasks, onData, onError }) => {
  const filtered = tasks.filter((t) => t.completed === completed);
  const count = filtered.length;
  const title = completed ? 'Completed' : 'Pending';

  const onEdit = async (item, editedTask) => {
    const originalTask = [...tasks];

    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    tasksCopy[index] = { ...item };
    tasksCopy[index].description = editedTask;
    onData(tasksCopy);

    try {
      await client.editTask(auth.token, item._id, editedTask);
    } catch (error) {
      onData(originalTask);
      onError(error);
    }
  };

  const onDelete = async (item) => {
    const originalTasks = [...tasks];
    onData(tasks.filter((t) => t._id !== item._id));

    try {
      await client.deleteTask(auth.token, item._id);
    } catch (error) {
      onData(originalTasks);
      onError(error);
    }
  };

  const onComplete = async (item) => {
    const originalTasks = [...tasks];

    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    tasksCopy[index] = { ...item };
    tasksCopy[index].completed = true;
    onData(tasksCopy);

    try {
      await client.completeTask(auth.token, item._id);
    } catch (error) {
      onData(originalTasks);
      onError(error);
    }
  };

  const onIncomplete = async (item) => {
    const originalTasks = [...tasks];

    const tasksCopy = [...tasks];
    const index = tasksCopy.indexOf(item);
    tasksCopy[index] = { ...item };
    tasksCopy[index].completed = false;
    onData(tasksCopy);

    try {
      await client.inCompleteTask(auth.token, item._id);
    } catch (error) {
      onData(originalTasks);
      onError(error);
    }
  };

  return (
    <List
      header={<Text strong>{`${title} (${count})`}</Text>}
      dataSource={filtered}
      renderItem={(item) => (
        <List.Item
          actions={[
            completed ? (
              <Button
                key="incomplete"
                onClick={() => onIncomplete(item)}
                type="link"
              >
                Incomplete
              </Button>
            ) : (
              <Button
                key="complete"
                onClick={() => onComplete(item)}
                type="link"
              >
                Complete
              </Button>
            ),
            <Button key="delete" onClick={() => onDelete(item)} type="link">
              Delete
            </Button>,
          ]}
        >
          {completed ? (
            <Text delete>
              <Typography.Paragraph
                editable={{
                  onChange: (editedTask) => onEdit(item, editedTask),
                }}
              >
                {item.description}
              </Typography.Paragraph>
            </Text>
          ) : (
            <Typography.Paragraph
              editable={{
                onChange: (editedTask) => onEdit(item, editedTask),
              }}
            >
              {item.description}
            </Typography.Paragraph>
          )}
        </List.Item>
      )}
    />
  );
};

export default TodoList;

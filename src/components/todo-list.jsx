import { Button, List, Typography } from 'antd';
import React from 'react';
import client from '../utils/api-client';

const { Text } = Typography;

const TodoList = ({ auth, completed, tasks, onDispatch, onRun }) => {
  const filtered = tasks.filter((t) => t.completed === completed);
  const count = filtered.length;
  const title = completed ? 'Completed' : 'Pending';

  const handleEdit = async (item, editedTask) => {
    const originalTask = [...tasks];
    onDispatch({ type: 'EDIT', item, editedTask });

    try {
      await onRun(client.editTask(auth.token, item._id, editedTask));
    } catch (error) {
      onDispatch({ type: 'POPULATE', payload: originalTask });
    }
  };

  const handleDelete = async (item) => {
    const originalTasks = [...tasks];
    onDispatch({ type: 'DELETE', payload: item });

    try {
      await onRun(client.deleteTask(auth.token, item._id));
    } catch (error) {
      onDispatch(originalTasks);
    }
  };

  const handleComplete = async (item) => {
    const originalTasks = [...tasks];
    onDispatch({ type: 'COMPLETE', item });

    try {
      await onRun(client.completeTask(auth.token, item._id));
    } catch (error) {
      onDispatch({ type: 'POPULATE', payload: originalTasks });
    }
  };

  const handleIncomplete = async (item) => {
    const originalTasks = [...tasks];
    onDispatch({ type: 'INCOMPLETE', item });

    try {
      await onRun(client.inCompleteTask(auth.token, item._id));
    } catch (error) {
      onDispatch({ type: 'POPULATE', payload: originalTasks });
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
                onClick={() => handleIncomplete(item)}
                type="link"
              >
                Incomplete
              </Button>
            ) : (
              <Button
                key="complete"
                onClick={() => handleComplete(item)}
                type="link"
              >
                Complete
              </Button>
            ),
            <Button key="delete" onClick={() => handleDelete(item)} type="link">
              Delete
            </Button>,
          ]}
        >
          {completed ? (
            <Text delete>
              <Typography.Paragraph
                editable={{
                  onChange: (editedTask) => handleEdit(item, editedTask),
                }}
              >
                {item.description}
              </Typography.Paragraph>
            </Text>
          ) : (
            <Typography.Paragraph
              editable={{
                onChange: (editedTask) => handleEdit(item, editedTask),
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

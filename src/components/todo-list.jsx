import { Button, List, Typography } from "antd";
import React from "react";

const { Text } = Typography;

const TodoList = ({
  completed,
  tasks,
  onComplete,
  onDelete,
  onEdit,
  onIncomplete,
}) => {
  const filtered = tasks.filter((t) => t.completed === completed);
  const count = filtered.length;
  const title = completed ? "Completed" : "Pending";

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

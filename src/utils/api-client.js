import axios from 'axios';

const getTasks = (token) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/task`, {
    headers: {
      Authorization: token,
    },
  });
};

const completeTask = (token, taskId) => {
  return axios.put(
    `https://api-nodejs-todolist.herokuapp.com/task/${taskId}`,
    {
      completed: true,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

const inCompleteTask = (token, taskId) => {
  return axios.put(
    `https://api-nodejs-todolist.herokuapp.com/task/${taskId}`,
    {
      completed: false,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

const addTask = (token, task) => {
  return axios.post(
    'https://api-nodejs-todolist.herokuapp.com/task',
    {
      description: task,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

const editTask = (token, taskId, editedTask) => {
  return axios.put(
    `https://api-nodejs-todolist.herokuapp.com/task/${taskId}`,
    {
      description: editedTask,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

const deleteTask = (token, taskId) => {
  return axios.delete(
    `https://api-nodejs-todolist.herokuapp.com/task/${taskId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export default {
  addTask,
  completeTask,
  deleteTask,
  editTask,
  getTasks,
  inCompleteTask,
};

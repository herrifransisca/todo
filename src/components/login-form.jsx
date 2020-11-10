import React, { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";

const LoginForm = ({ onSubmit }) => {
  const [error, setError] = useState(null);

  const onFinish = async ({ email, password }) => {
    try {
      const { data } = await axios.post(
        "https://api-nodejs-todolist.herokuapp.com/user/login",
        {
          email,
          password,
        },
        {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmEzNGUwNDljZTU3ZTAwMTdhMzdkOWQiLCJpYXQiOjE2MDQ1Mzc5NTJ9.dzmuR0DWdEo4_nrhLmZegG5pQiSV0qXGLj8-hhPDWKY",
          },
        }
      );
      setError(null);
      onSubmit(data);
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        email: "",
        password: "",
      }}
      onFinish={onFinish}
    >
      {error && (
        <Form.Item>
          <Alert message={error} type="error" />{" "}
        </Form.Item>
      )}
      <Form.Item
        name="email"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;

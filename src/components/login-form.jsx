import React, { useState } from "react";
import { Alert, Form, Input, Modal } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";

const LoginForm = ({ onCancel, onLogin, visible }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);

  return (
    <Modal
      cancelText="Cancel"
      okText="Login"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(async ({ email, password }) => {
            // form.resetFields();
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
              onLogin(data);
            } catch (error) {
              setError("Invalid email or password.");
            }
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      title="Login"
      visible={visible}
    >
      <Form
        form={form}
        initialValues={{
          email: "",
          password: "",
        }}
        name="login_form_in_modal"
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
          <Input prefix={<MailOutlined />} placeholder="Email" />
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
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginForm;

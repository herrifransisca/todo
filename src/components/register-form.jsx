import React, { useState } from "react";
import { Alert, Form, Input, Modal } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";

const RegisterForm = ({ onCancel, onRegister, visible }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);

  return (
    <Modal
      cancelText="Cancel"
      okText="Register"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(async ({ name, email, password }) => {
            // form.resetFields();
            try {
              const { data } = await axios.post(
                "hhttps://api-nodejs-todolist.herokuapp.com/user/register",
                {
                  name,
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
              onRegister(data);
            } catch (error) {
              setError("Register failed.");
              console.log("register failed, the error=", error);
            }
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      title="Register"
      visible={visible}
    >
      <Form
        form={form}
        initialValues={{ name: "", email: "", password: "" }}
        name="register_form_in_modal"
      >
        {error && (
          <Form.Item>
            <Alert message={error} type="error" />{" "}
          </Form.Item>
        )}
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your Name!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Name" />
        </Form.Item>
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

export default RegisterForm;

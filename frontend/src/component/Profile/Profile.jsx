import React, { useState, useEffect } from "react";
import { Button } from "@themesberg/react-bootstrap";
import {
  Button as AntButton,
  Form,
  Input,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import BootstrapLoader from "../BootstrapLoader";
import { changeUserPassword } from "../../api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [changePassword, setChangePassword] = useState({});

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const currentIdentifier = localStorage.getItem("currentIdentifier");
    const currentPassword = localStorage.getItem("currentPassword");

    setUserData({
      currentUser,
      currentIdentifier,
      currentPassword,
    });
  }, []);

  const handleProfile = () => {
    setChangePassword({});
    setIsModalOpen(true);
  };

  const handlePassword = async (values, event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log("Form values After changeUserPassword:", values);

      if (isModalOpen) {
        if (values.currentPassword === userData.currentPassword) {
          if (values.password === values.passwordConfirmation) {
            const formData = new FormData();
            formData.append("currentPassword", values.currentPassword);
            formData.append("password", values.password);
            formData.append(
              "passwordConfirmation",
              values.passwordConfirmation
            );

            const success = await changeUserPassword(formData, token);

            if (success) {
              localStorage.setItem("currentPassword", values.password);
              console.log("Password Change Successful");
              message.success("Password Change Successful");
              setIsModalOpen(false);
              form.resetFields();
            } else {
              console.log("Failed to Change Password");
              message.error("Failed to Change Password");
            }
          } else {
            console.log("New Password is Not matched with Confirm Password");
            message.error("New Password is Not matched with Confirm Password");
          }
        } else {
          console.log("currentPassword is Not matched with Your old Password");
          message.error(
            "currentPassword is Not matched with Your old Password"
          );
        }
      }
    } catch (err) {
      console.log("Error:", err);
      if (err.response) {
        console.log("Error response:", err.response);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }
  const handleModalCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  return (
    <>
      <h5 style={{ textAlign: "center" }}>Your Info</h5>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Form initialValues={userData} layout="vertical">
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item label="ID" name={["currentUser", "id"]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Username" name={["currentUser", "username"]}>
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item label="Email" name={["currentUser", "email"]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}></Col>
          </Row>
        </Form>
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
        }}
      >
        <AntButton
          mt="xl"
          onClick={() => navigate(-1)}
          style={{
            color: "#5250e6",
            backgroundColor: "#f0f0ff",
            border: "1px solid #ddddfe",
            height: "auto",
            padding: "10px 20px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            fontWeight: "700",
          }}
        >
          Back
        </AntButton>
        <AntButton
          type="text"
          danger
          onClick={handleProfile}
          style={{
            color: "#5250e6",
            backgroundColor: "#f0f0ff",
            border: "1px solid #ddddfe",
            height: "auto",
            padding: "10px 20px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            fontWeight: "700",
          }}
        >
          Apply to Change Password
        </AntButton>
      </div>

      <Modal
        style={{ width: "400px" }}
        title="Change Password Modal"
        onOk={handlePassword}
        open={isModalOpen}
        onCancel={handleModalCancel}
        centered
        footer={[
          <div>
            <Button
              key="cancel"
              onClick={handleModalCancel}
              style={{
                border: "2px solid #d1d5db",
                backgroundColor: "transparent",
                color: "black",
                borderRadius: "10px",
              }}
            >
              Cancel
            </Button>{" "}
            <Button
              key="submit"
              type="primary"
              disabled={isLoading}
              onClick={(event) => handlePassword(form.getFieldsValue(), event)}
              style={{
                borderRadius: "10px",
              }}
            >
              Submit for Change Password
              {isLoading && <BootstrapLoader />}
            </Button>
          </div>,
        ]}
      >
        <Form
          form={form}
          onFinish={handlePassword}
          initialValues={changePassword}
          layout="vertical"
        >
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                label="currentPassword"
                name="currentPassword"
                rules={[
                  { required: true, message: "Please enter a currentPassword" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="New Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter a New Password" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Confirm Password"
                name="passwordConfirmation"
                rules={[
                  {
                    required: true,
                    message: "Please enter a Confirm Password",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Profile;

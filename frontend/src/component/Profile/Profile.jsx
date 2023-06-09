import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@themesberg/react-bootstrap";
import {
  Button as AntButton,
  Form,
  Input,
  Row,
  Col,
  Modal,
  message,
  Card,
  Space,
} from "antd";
import {
  DeleteOutlined,
  KeyOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import BootstrapLoader from "../BootstrapLoader";
import { changeUserPassword, deleteUserData } from "../../api";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [changePassword, setChangePassword] = useState({});
  const [deleteFormData, setDeleteFormData] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const currentPassword = localStorage.getItem("currentPassword");

    setUserData({
      currentUser,
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

  const handleDeleteForm = async (values, event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log("Form values:", values.id);

      const success = await deleteUserData(values.id, token);

      if (success) {
        console.log("Deleting an entry");
        message.success("Deleting an entry");
        setIsDeleteModalOpen(false);
        form.resetFields();
        localStorage.clear();
        window.location.reload();
      } else {
        console.log("Failed to delete entry.");
        message.error("Failed to delete entry.");
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
    setIsDeleteModalOpen(false);
  };

  const handleDelete = (record) => {
    console.log("Select for Delete", record);
    setDeleteFormData({ ...record });
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <Card style={{ width: 500, margin: "0 auto" }}>
        <h5 style={{ textAlign: "center" }}>Your Info</h5>
        <Form initialValues={userData} layout="vertical">
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item label="ID" name={["currentUser", "id"]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Username" name={["currentUser", "username"]}>
                <Input readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item label="Email" name={["currentUser", "email"]}>
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={24}></Col>
          </Row>
          <Space>
            <AntButton
              type="text"
              danger
              onClick={handleProfile}
              icon={<KeyOutlined />}
              style={{
                color: "#25805b",
                backgroundColor: "#def7ec",
                border: "1px solid #d1f3cd",
                height: "auto",
                padding: "10px",
                borderRadius: "13px",
                display: "flex",
                alignItems: "baseline",
                fontWeight: "700",
              }}
            >
              Change Password
            </AntButton>
            <AntButton
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(userData.currentUser)}
              style={{
                color: "#b34c4c",
                backgroundColor: "#f6cccc",
                border: "1px solid rgb(231 176 176)",
                height: "auto",
                padding: "10px",
                borderRadius: "13px",
                display: "flex",
                alignItems: "center",
                fontWeight: "700",
              }}
            >
              Delete My Account
            </AntButton>
            <AntButton
              onClick={() => navigate(-1)}
              icon={<LeftCircleOutlined />}
              style={{
                color: "#5250e6",
                backgroundColor: "#f0f0ff",
                border: "1px solid #ddddfe",
                height: "auto",
                padding: "10px 20px",
                borderRadius: "13px",
                display: "flex",
                alignItems: "center",
                fontWeight: "700",
              }}
            >
              Back
            </AntButton>
          </Space>
        </Form>
      </Card>

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
                <Input.Password />
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
                <Input.Password />
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
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Delete Modal"
        onOk={handleDeleteForm}
        open={isDeleteModalOpen}
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
              onClick={(event) =>
                handleDeleteForm(form.getFieldsValue(), event)
              }
              style={{
                borderRadius: "10px",
              }}
            >
              Delete
              {isLoading && <BootstrapLoader />}
            </Button>
          </div>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleDeleteForm}
          initialValues={{ ...deleteFormData }}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ID" name="id" hidden>
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <b>{deleteFormData.username}</b> ! Are u sure for delete this
              Account ?
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Profile;

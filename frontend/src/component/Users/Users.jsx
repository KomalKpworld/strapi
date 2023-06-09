import React, { useState, useEffect } from "react";
import { Button } from "@themesberg/react-bootstrap";
import {
  Button as AntButton,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Table,
  message,
  Select,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import BootstrapLoader from "../BootstrapLoader";

import {
  fetchUsersData,
  createUser,
  updateUserData,
  deleteUserData,
} from "../../api";

const Users = () => {
  const token = localStorage.getItem("token");
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");

  const [data, setData] = useState([]);

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [createFormData, setCreateFormData] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [deleteFormData, setDeleteFormData] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      width: 20,
      key: "rowNumber",
      render: (text, record, index) => index + 1,
    },
    {
      dataIndex: "id",
      title: "ID",
      width: 20,
      sorter: (a, b) => a.id - b.id,
    },
    {
      dataIndex: "username",
      title: "Username",
      width: 70,
      sorter: (a, b) => (a.username || "").localeCompare(b.username || ""),
      render: (text) =>
        text ? text : <span style={{ color: "green" }}>Empty</span>,
    },
    {
      dataIndex: "email",
      title: "Email",
      width: 100,
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
      render: (text) =>
        text ? text : <span style={{ color: "green" }}>Empty</span>,
    },
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      width: 80,
      sorter: (a, b) => (a.role?.name || "").localeCompare(b.role?.name || ""),
      render: (text, record) =>
        record.role?.name ? (
          record.role?.name
        ) : (
          <span style={{ color: "green" }}>No Available</span>
        ),
    },
    {
      dataIndex: "confirmed",
      title: "Confirmed",
      width: 70,
      sorter: (a, b) =>
        (a.confirmed || "")
          .toString()
          .localeCompare((b.confirmed || "").toString()),
      render: (confirmed) => <span>{confirmed.toString()}</span>,
    },
    {
      dataIndex: "blocked",
      title: "Blocked",
      width: 70,
      sorter: (a, b) =>
        (a.blocked || "")
          .toString()
          .localeCompare((b.blocked || "").toString()),
      render: (blocked) => <span>{blocked.toString()}</span>,
    },
    {
      dataIndex: "createdAt",
      title: "Created At",
      width: 100,
      sorter: (a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""),
      render: (text) =>
        text ? text : <span style={{ color: "green" }}>Empty</span>,
    },
    {
      dataIndex: "updatedAt",
      title: "UpdatedAt",
      width: 100,
      sorter: (a, b) => (a.updatedAt || "").localeCompare(b.updatedAt || ""),
      render: (text) =>
        text ? text : <span style={{ color: "green" }}>Empty</span>,
    },
    {
      title: "Edit",
      width: 40,
      render: (text, record) => (
        <AntButton
          type="text"
          danger
          onClick={() => handleEdit(record)}
          icon={<EditOutlined style={{ verticalAlign: "baseline" }} />}
          style={{
            color: "#25805b",
            background: "#def7ec",
            borderRadius: "13px",
          }}
        />
      ),
    },
    {
      title: "Delete",
      width: 40,
      render: (text, record) => (
        <AntButton
          type="text"
          danger
          onClick={() => handleDelete(record)}
          icon={<DeleteOutlined style={{ verticalAlign: "baseline" }} />}
          style={{
            color: "#b34c4c",
            background: "#f6cccc",
            borderRadius: "13px",
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    handleUsersApi();
    // eslint-disable-next-line
  }, []);

  const handleUsersApi = async (searchQuery = "") => {
    try {
      const data = await fetchUsersData(searchQuery, token);
      setData(data);
      console.log(data, "data");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateForm = async (values, event) => {
    event.preventDefault();

    try {
      console.log("Form values After Create:", values);

      if (isCreateModalOpen) {
        const formData = new FormData();
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("role", values.role);
        formData.append("confirmed", values.confirmed);

        const success = await createUser(formData);

        if (success) {
          console.log("Creating a new entry");
          message.success("Creating a new entry");
          setIsCreateModalOpen(false);
          form.resetFields();
          handleUsersApi(searchQuery);
        } else {
          console.log("Failed to create entry");
          message.error("Failed to create entry");
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

  const handleEditForm = async (values, event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log("Form values After Edit:", values);

      if (isEditModalOpen) {
        const formData = new FormData();
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("role", values.role.id);
        formData.append("confirmed", values.confirmed);

        const success = await updateUserData(values.id, formData, token);

        if (success) {
          console.log("Updating an entry");
          message.success("Updating an entry");
          setIsEditModalOpen(false);
          setData((prevData) =>
            prevData.map((row) =>
              row.id === values.id ? { ...row, ...values } : row
            )
          );
          form.resetFields();
          handleUsersApi(searchQuery);
        } else {
          console.log("Failed to update entry");
          message.error("Failed to update entry");
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
      console.log("Form values:", values);

      const success = await deleteUserData(values.id, token);

      if (success) {
        console.log("Deleting an entry");
        message.success("Deleting an entry");
        setIsDeleteModalOpen(false);
        setData((prevData) => prevData.filter((row) => row.id !== values.id));
        form.resetFields();
        handleUsersApi(searchQuery);
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

  const deleteMultipleCategoryData = async (selectedRecords) => {
    console.log(selectedRecords, "Delete");
    try {
      setIsLoading(true);

      for (const id of selectedRecords) {
        const success = await deleteUserData(id, token);
        handleUsersApi(searchQuery);

        if (!success) {
          console.log(`Failed to delete category with ID ${id}.`);
          message.error(`Failed to delete category with ID ${id}.`);
          return;
        }
      }

      setIsLoading(false);
      setSelectedRecords([]);
      setData((prevData) => {
        return prevData.map((row) =>
          selectedRecords.includes(row.id) ? { ...row, status: "deleted" } : row
        );
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreate = () => {
    form.resetFields();
    setCreateFormData({});
    setIsCreateModalOpen(true);
  };

  const handleEdit = (record) => {
    console.log("Select for Edit", record);
    setEditFormData(record);
    setIsEditModalOpen(true);
  };

  const handleDelete = (record) => {
    console.log("Select for Delete", record);
    setDeleteFormData({ ...record });
    setIsDeleteModalOpen(true);
  };

  const handleModalCancel = () => {
    form.resetFields();
    setCreateFormData({});
    setEditFormData({});
    setDeleteFormData({});
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const filterData = (data, searchQuery) => {
    return data.filter((row) =>
      Object.keys(row).some((key) =>
        key === "role"
          ? row[key] &&
            row[key]["name"] &&
            row[key]["name"]
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : row[key] &&
            row[key]
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
      )
    );
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys: selectedRecords,
    onChange: (selectedRows) => {
      setSelectedRecords(selectedRows);
    },
  };

  const pagination = {
    defaultPageSize: 5,
    pageSizeOptions: [1, 2, 3, 5, 10, 20, 30, 50, 100, 150, 200],
    showSizeChanger: true,
    locale: { items_per_page: "" },
    showTotal: (total, range) => (
      <span style={{ fontWeight: "600" }}>
        {`${range[0]} - ${range[1]}  of  ${total}  items`}
      </span>
    ),
  };

  return (
    <main>
      {/* DeleteModal */}
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
              <Form.Item label="ID" name="id">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
        </Form>
      </Modal>

      {/* EditModal */}
      <Modal
        title="Update Modal"
        onOk={handleEditForm}
        open={isEditModalOpen}
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
              onClick={(event) => handleEditForm(form.getFieldsValue(), event)}
              style={{
                borderRadius: "10px",
              }}
            >
              Update
              {isLoading && <BootstrapLoader />}
            </Button>
          </div>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleEditForm}
          initialValues={editFormData}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ID" name="id">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="username"
                name="username"
                rules={[{ required: true, message: "Please enter a username" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="email"
                name="email"
                rules={[{ required: true, message: "Please enter a email" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="role"
                name={["role", "id"]}
                rules={[{ required: true, message: "Please enter a role" }]}
              >
                <Select>
                  <Select.Option value="1">(1)-Authenticate</Select.Option>
                  <Select.Option value="2">(2)-Public</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="confirmed" name="confirmed">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
        </Form>
      </Modal>

      {/* CreateModal */}
      <Modal
        open={isCreateModalOpen}
        title="Create Modal"
        onCancel={handleModalCancel}
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
                handleCreateForm(form.getFieldsValue(), event)
              }
              style={{
                borderRadius: "10px",
              }}
            >
              Create {isLoading && <BootstrapLoader />}
            </Button>
          </div>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateForm}
          initialValues={{ ...createFormData, confirmed: true }}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="username"
                name="username"
                rules={[{ required: true, message: "Please enter a username" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="email"
                name="email"
                rules={[{ required: true, message: "Please enter a email" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="password"
                name="password"
                rules={[{ required: true, message: "Please enter a password" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="role"
                name="role"
                rules={[{ required: true, message: "Please enter a role" }]}
              >
                <Select>
                  <Select.Option value="1">(1)-Authenticate</Select.Option>
                  <Select.Option value="2">(2)-Public</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="confirmed" name="confirmed">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
        </Form>
      </Modal>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px 0px",
        }}
      >
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          suffix={<SearchOutlined />}
          style={{
            width: 200,
            backgroundColor: "#fff",
            border: "2px solid #e6e6e6",
            borderRadius: "15px",
            padding: "10px 20px",
          }}
        />

        {selectedRecords?.length > 0 && (
          <>
            <Button
              type="text"
              danger
              disabled={isLoading}
              onClick={() => deleteMultipleCategoryData(selectedRecords)}
              style={{
                color: "#b34c4c",
                background: "#f6cccc",
                borderRadius: "15px",
                border: "1px solid #b34c4c",
                fontWeight: "600",
                padding: "10px 30px",
              }}
            >
              Delete All {isLoading && <BootstrapLoader />}
            </Button>
          </>
        )}

        <AntButton
          type="text"
          danger
          onClick={handleCreate}
          icon={<PlusOutlined />}
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
          Create New Category
        </AntButton>
      </div>

      <Table
        rowKey="id"
        rowSelection={rowSelection}
        dataSource={filterData(data, searchQuery)}
        columns={columns}
        pagination={{
          ...pagination,
          position: ["topRight"],
        }}
        title={() => (
          <h5 style={{ textAlign: "center", color: "#2876d2" }}>
            <b>Users Data Table</b>
          </h5>
        )}
      />
    </main>
  );
};

export default Users;

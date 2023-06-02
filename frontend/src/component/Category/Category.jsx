import React, { useState, useEffect } from "react";
import { Button } from "@themesberg/react-bootstrap";
import { Button as AntButton, Modal, Form, Input, Row, Col, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import BootstrapLoader from "../BootstrapLoader";
import {
  fetchCategoryData,
  createCategoryData,
  updateCategoryData,
  deleteCategoryData,
} from "../../api";

const Category = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = localStorage.getItem("token");
  const [form] = Form.useForm();

  const [data, setData] = useState([]);

  const [createFormData, setCreateFormData] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [deleteFormData, setDeleteFormData] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const initialColumns = [
    {
      title: "No.",
      dataIndex: "rowNumber",
      width: 50,
      key: "rowNumber",
      render: (text, record, index) => index + 1, // Render the row number
    },
    { dataIndex: "id", title: "ID", width: 70 },
    {
      dataIndex: "category_name",
      title: "category_name",
      width: 150,
      render: (text) =>
        text ? text : <span style={{ color: "green" }}>Empty</span>,
    },
    {
      dataIndex: "move",
      title: "move",
      width: 70,
      render: (text) =>
        text ? text : <span style={{ color: "green" }}>Empty</span>,
    },
    {
      dataIndex: "category_image",
      title: "category_image",
      width: 200,
      render: (text) =>
        text ? text : <span style={{ color: "green" }}>No Available</span>,
    },
    {
      dataIndex: "file",
      title: "File",
      width: 150,
      render: (text, record) => {
        const file = record.file ? record.file[0] : null;
        if (file) {
          return (
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          );
        } else {
          return <span style={{ color: "green" }}>No Available</span>;
        }
      },
    },
    {
      title: "Edit",
      width: 70,
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
      width: 70,
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

  // eslint-disable-next-line
  const [columns, setColumns] = useState(initialColumns);

  useEffect(() => {
    handleCategoryApi();
    // eslint-disable-next-line
  }, []);

  const handleCategoryApi = async (searchQuery = "") => {
    try {
      const data = await fetchCategoryData(searchQuery);
      setData(data);
      console.log(data, "data");
      // console.log("Performing API call with searchQuery:", searchQuery);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateForm = async (values, event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log("Form values After Create:", values);

      if (isCreateModalOpen) {
        if (currentUser && currentUser.id) {
          const formData = new FormData();
          formData.append("category_name", values.category_name);
          formData.append("move", values.move);
          for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
          }

          const success = await createCategoryData(formData, token);

          if (success) {
            console.log("Creating a new entry");
            setIsCreateModalOpen(false);
            form.resetFields();
            setFileNames([]);
            handleCategoryApi(searchQuery);
          } else {
            console.log("Failed to create entry");
          }
        } else {
          console.log("Invalid currentUser object. Unable to create data.");
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
      if (
        currentUser &&
        currentUser.id &&
        values.created_by_user &&
        values.created_by_user.id === currentUser.id
      ) {
        if (isEditModalOpen) {
          const formData = new FormData();
          formData.append("category_name", values.category_name);
          formData.append("move", values.move);
          for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
          }

          const success = await updateCategoryData(values.id, formData, token);

          if (success) {
            console.log("Updating an entry");
            setIsEditModalOpen(false);
            setData((prevData) =>
              prevData.map((row) =>
                row.id === values.id ? { ...row, ...values } : row
              )
            );
            form.resetFields();
            setFileNames([]);
            handleCategoryApi(searchQuery);
          } else {
            console.log("Failed to update entry");
          }
        }
      } else {
        console.log("User is not authorized to update this data.");
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

      if (currentUser && currentUser.id) {
        if (
          values.created_by_user &&
          values.created_by_user.id === currentUser.id
        ) {
          const success = await deleteCategoryData(values.id, token);

          if (success) {
            console.log("Deleting an entry");
            setIsDeleteModalOpen(false);
            setData((prevData) =>
              prevData.filter((row) => row.id !== values.id)
            );
            form.resetFields();
            setFileNames([]);
            handleCategoryApi(searchQuery);
          } else {
            console.log("Failed to delete entry.");
          }
        } else {
          console.log("User is not authorized to delete this data.");
        }
      } else {
        console.log("Invalid currentUser object. Unable to delete data.");
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
        const success = await deleteCategoryData(id, token);
        handleCategoryApi(searchQuery);
        if (!success) {
          console.log(`Failed to delete category with ID ${id}.`);
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
    setFileNames([]);
    setCreateFormData({});
    setEditFormData({});
    setDeleteFormData({});
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const fileNames = selectedFiles.map((file) => file.name);
    setFileNames(fileNames);
  };

  const filterData = (data, searchQuery) => {
    return data.filter((row) =>
      Object.keys(row).some((key) =>
        key === "category_id"
          ? row[key] &&
            row[key]["category_name"] &&
            row[key]["category_name"]
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
            <Col span={12}>
              <Form.Item label="created_by_user" name="created_by_user" hidden>
                <Input
                  value={deleteFormData?.created_by_user?.id || ""}
                  disabled
                />
              </Form.Item>
            </Col>
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
              <Form.Item label="created_by_user" name="created_by_user" hidden>
                <Input
                  value={editFormData?.created_by_user?.id || ""}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Category Name" name="category_name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Move" name="move">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="File"
                name="files"
                rules={[
                  { required: true, message: "Please upload a category image" },
                ]}
              >
                <input type="file" multiple onChange={handleFileChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              {fileNames.length > 0 && (
                <div>
                  <strong>Selected File:</strong>
                  <ul>
                    {fileNames.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Col>
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
          initialValues={createFormData}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Category Name"
                name="category_name"
                rules={[
                  { required: true, message: "Please enter a category name" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Move"
                name="move"
                rules={[{ required: true, message: "Please enter a Move" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="File"
                name="file"
                rules={[
                  { required: true, message: "Please upload a category image" },
                ]}
              >
                <input type="file" multiple onChange={handleFileChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              {fileNames.length > 0 && (
                <div>
                  <strong>Selected File:</strong>
                  <ul>
                    {fileNames.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Col>
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
          Create New Product
        </AntButton>
      </div>

      <Table
        rowKey="id"
        rowSelection={rowSelection}
        dataSource={filterData(data, searchQuery)}
        columns={columns}
        pagination={pagination}
      />
    </main>
  );
};

export default Category;

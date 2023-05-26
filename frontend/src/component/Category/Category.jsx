import React, { useState, useEffect } from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button as AntButton, Modal, Form, Input, Row, Col } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  fetchCategoryData,
  createCategoryData,
  updateCategoryData,
  deleteCategoryData,
} from "../../api";

const Category = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [createFormData, setCreateFormData] = useState({});
  const [deleteFormData, setDeleteFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");

  const initialColumns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "category_name",
      headerName: "category_name",
      width: 150,
      renderCell: (params) =>
        params.row.category_name ? (
          params.row.category_name
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      field: "move",
      headerName: "move",
      width: 70,
      renderCell: (params) =>
        params.row.move ? (
          params.row.move
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      field: "category_image",
      headerName: "category_image",
      width: 250,
      renderCell: (params) =>
        params.row.category_image ? (
          params.row.category_image
        ) : (
          <span style={{ color: "green" }}>No Available</span>
        ),
    },
    {
      field: "file",
      headerName: "File",
      width: 150,
      renderCell: (params) => {
        const file = params.row.file ? params.row.file[0] : null;
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
      field: "edit",
      headerName: " ",
      width: 70,
      renderCell: (params) => (
        <AntButton
          type="text"
          danger
          onClick={() => handleEdit(params.row)}
          icon={<EditOutlined />}
          style={{
            color: "#25805b",
            background: "#def7ec",
            borderRadius: "13px",
          }}
        />
      ),
    },
    {
      field: "delete",
      headerName: " ",
      width: 70,
      renderCell: (params) => (
        <AntButton
          type="text"
          danger
          onClick={() => handleDelete(params.row)}
          icon={<DeleteOutlined />}
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

  const handleDelete = (row) => {
    console.log("Select for Delete", row);
    setDeleteFormData({ ...row });
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (row) => {
    console.log("Select for Edit", row);
    setEditFormData(row);
    setIsEditModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleCreate = () => {
    setCreateFormData({});
    setIsCreateModalOpen(true);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const fileNames = selectedFiles.map((file) => file.name);
    setFileNames(fileNames);
  };

  const handleCreateForm = async (values) => {
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
    }
  };

  const handleDeleteForm = async (values) => {
    try {
      console.log("Form values:", values);

      if (currentUser && currentUser.id) {
        if (values.addedBy && values.addedBy.id === currentUser.id) {
          const success = await deleteCategoryData(values.id, token);

          if (success) {
            console.log("Deleting an entry");
            setIsDeleteModalOpen(false);
            setData((prevData) =>
              prevData.filter((row) => row.id !== values.id)
            );
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
    }
  };

  const handleEditForm = async (values) => {
    try {
      console.log("Form values After Edit:", values);
      if (
        currentUser &&
        currentUser.id &&
        values.addedBy &&
        values.addedBy.id === currentUser.id
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
            setIsEditModalOpen(false);
            setData((prevData) =>
              prevData.map((row) =>
                row.id === values.id ? { ...row, ...values } : row
              )
            );
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
    }
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
        footer={null}
      >
        <Form
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
              <Form.Item label="addedBy" name="addedBy" hidden>
                <Input value={deleteFormData?.addedBy?.id || ""} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmltype="submit">
              Delete
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleModalCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* EditModal */}
      <Modal
        title="Update Modal"
        onOk={handleEditForm}
        open={isEditModalOpen}
        onCancel={handleModalCancel}
        centered
        footer={null}
      >
        <Form
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
              <Form.Item label="addedBy" name="addedBy" hidden>
                <Input value={editFormData?.addedBy?.id || ""} disabled />
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
            <Col span={12}></Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmltype="submit">
              Update
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleModalCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* CreateModal */}
      <Modal
        open={isCreateModalOpen}
        title="Create Modal"
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
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

          <Form.Item>
            <Button type="primary" htmltype="submit">
              Create
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleModalCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div>
        <AntButton
          type="text"
          danger
          onClick={handleCreate}
          icon={<PlusOutlined />}
          style={{
            color: "#5250e6",
            backgroundColor: "#f0f0ff",
            border: "1px solid #ddddfe",
          }}
        >
          Create New Category
        </AntButton>
        <br />
        <br />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 200 }}
          suffix={<SearchOutlined />}
        />

        <br />
        <br />
        <DataGrid
          // rows={data}

          // rows={data.filter((row) =>
          //   row.category_name.toLowerCase().includes(searchQuery.toLowerCase())
          // )}

          // rows={data.filter((row) =>
          //   Object.values(row).some(
          //     (value) =>
          //       value &&
          //       value
          //         .toString()
          //         .toLowerCase()
          //         .includes(searchQuery.toLowerCase())
          //   )
          // )}

          rows={data.filter((row) =>
            Object.keys(row).some(
              (key) =>
                row[key] &&
                row[key]
                  .toString()
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            )
          )}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 20, 30, 50, 100]}
          checkboxSelection
          style={{ boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)" }}
        />

        <Button mt="xl" onClick={() => navigate("/homepage")}>
          Go Back HomePage
        </Button>
      </div>
    </main>
  );
};

export default Category;
